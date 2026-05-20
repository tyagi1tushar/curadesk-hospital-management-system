import express from "express";
import multer from "multer";
import fs from "fs";
import PDFParser from "pdf2json";
import crypto from "crypto";
import { requireAuth } from "@clerk/express";

import extractTextWithTesseract from "../services/tesseractService.js";

// import extractTextWithGoogleOCR from "../services/googleOcrService.js";

import convertPdfToImages from "../services/pdfToImageService.js";

import path from "path";

import Report
  from "../models/reportModel.js";

import { summarizeMedicalReport } from "../services/reportAiService.js";

import cleanPdfText from "../utilities/cleanPdfText.js";
import chunkText from "../utilities/chunkText.js";

import { createEmbedding } from "../services/embeddingService.js";

import { collection } from "../services/chromaService.js";

const router = express.Router();

const upload = multer({
  dest: "tmp/",
});

router.post(
  "/upload",

  requireAuth(),

  upload.single("report"),
  async (req, res) => {

    try {

      if (!req.file) {

        return res.status(400).json({
          message: "No file uploaded",
        });
      }

      const { userId } =
        req.auth();



      console.log(
        "USER ID:",
        userId
      );

      const pdfParser = new PDFParser();

      // PDF ERROR
      pdfParser.on(
        "pdfParser_dataError",
        (errData) => {

          console.log(
            "PDF PARSE ERROR:",
            errData.parserError
          );

          // delete uploaded file if exists
          if (
            req.file?.path &&
            fs.existsSync(req.file.path)
          ) {
            fs.unlinkSync(req.file.path);
          }

          return res.status(500).json({
            message: "PDF parsing failed",
          });
        }
      );

      // PDF SUCCESS
      pdfParser.on(
        "pdfParser_dataReady",
        async (pdfData) => {

          try {

            const pagesText = [];

            // EXTRACT TEXT
            pdfData.Pages.forEach(

              (page, pageIndex) => {

                let pageText = "";

                page.Texts.forEach(

                  (textItem) => {

                    try {

                      if (

                        textItem.R &&

                        textItem.R[0] &&

                        textItem.R[0].T

                      ) {

                        pageText +=

                          decodeURIComponent(

                            textItem.R[0].T

                          ) + " ";
                      }

                    } catch {

                      pageText +=

                        textItem?.R?.[0]?.T || "";
                    }
                  }
                );

                pagesText.push({

                  page:
                    pageIndex + 1,

                  text:
                    pageText,
                });
              }
            );

            console.log(
              "PAGES EXTRACTED:",
              pagesText
            );

            let text =
              pagesText
                .map((p) => p.text)
                .join("\n");

            // =========================
            // GOOGLE OCR FALLBACK
            // =========================

            if (

              !text ||

              text.length < 200 ||

              text.includes("�") ||

              text.split(" ").length < 30

            ) {

              console.log(
                "USING TESSERACT OCR..."
              );

              const outputDir =
                await convertPdfToImages(
                  req.file.path
                );

              if (outputDir) {

                const files =
                  fs
                    .readdirSync(outputDir)
                    .sort();

                let ocrText = "";

                for (const file of files) {

                  const imagePath =
                    path.join(
                      outputDir,
                      file
                    );

                  console.log(
                    "OCR IMAGE:",
                    imagePath
                  );

                  const pageText =
                    await extractTextWithTesseract(
                      imagePath
                    );

                  ocrText +=
                    pageText + "\n";
                }

                text = ocrText;

                // DELETE OCR TEMP FOLDER

                fs.rmSync(

                  outputDir,

                  {
                    recursive: true,
                    force: true,
                  }
                );

                console.log(
                  "OCR TEXT:",
                  text
                );
              }
            }

            // CLEAN PAGES

            const cleanedPages =

              pagesText.map(

                (p) => ({

                  page:
                    p.page,

                  text:

                    cleanPdfText(
                      p.text
                    ),
                })
              );

            console.log(
              "CLEANED PAGES:",
              cleanedPages
            );

            const cleanedText =

              cleanedPages
                .map(
                  p => p.text
                )
                .join("\n");

            // =========================
            // CREATE FILE HASH
            // =========================

            const fileHash =
              crypto
                .createHash("sha256")
                .update(cleanedText)
                .digest("hex");

            const reportHash =
              fileHash;

            console.log(
              "FILE HASH:",
              fileHash
            );

            // =========================
            // CHECK EXISTING REPORT
            // =========================
            // =========================
            // CHECK EXISTING REPORT
            // + VERIFY CHROMA
            // =========================

            const existingReport =
              await Report.findOne({

                userId,

                fileHash,
              });

            if (existingReport) {

              console.log(
                "REPORT EXISTS → CHECKING CHROMA"
              );

              const chromaCheck =
                await collection.get({

                  ids:
                    existingReport
                      .chromaChunkIds,
                });

              const chromaExists =

                chromaCheck?.ids?.length > 0;

              // CHROMA OK
              if (chromaExists) {

                console.log(
                  "CHROMA FOUND → REUSING"
                );

                return res.json({

                  extractedText:
                    cleanedText,

                  aiSummary:
                    "Report already processed. Reusing stored embeddings.",

                  reportHash,
                });
              }

              // CHROMA MISSING
              console.log(
                "CHROMA MISSING → REBUILDING EMBEDDINGS"
              );
            }



            // CHUNK TEXT
            const pageChunks = [];

            cleanedPages.forEach(

              (p) => {

                const chunks =

                  chunkText(
                    p.text
                  );

                chunks.forEach(

                  (chunk) => {

                    pageChunks.push({

                      page:
                        p.page,

                      text:
                        chunk,
                    });
                  }
                );
              }
            );

            if (

              !pageChunks ||

              pageChunks.length === 0
            ) {

              return res.status(400).json({

                message:
                  "Could not extract readable text from PDF.",
              });
            }

            console.log(
              "PAGE CHUNKS:",
              pageChunks
            );

            // CREATE EMBEDDINGS
            const embeddings =
              await Promise.all(

                pageChunks.map(

                  (chunk) =>

                    createEmbedding(
                      chunk.text
                    )
                )
              );

            console.log(
              "EMBEDDINGS CREATED"
            );

            // STORE IN CHROMADB
            // CREATE CHROMA IDS

            const chunkIds =
              pageChunks.map(
                (_, i) =>
                  `chunk_${Date.now()}_${i}`
              );

            // STORE IN CHROMADB

            console.log(
              "STORING METADATA:",
              {

                reportHash,

                userId,
              }
            );

            await collection.add({

              ids: chunkIds,

              embeddings,

              documents:

                pageChunks.map(
                  c => c.text
                ),

              metadatas:

                pageChunks.map(

                  (c) => ({

                    reportHash,

                    userId,

                    page:
                      c.page,
                  })
                )
            });

            console.log(
              "Stored in ChromaDB successfully"
            );

            // =========================
            // SAVE REPORT METADATA
            // =========================

            await Report.create({

              userId,

              reportName:
                req.file.originalname,

              fileHash,

              chromaChunkIds:
                chunkIds,

              reportType:
                "medical-report",

            });

            console.log(
              "REPORT METADATA SAVED"
            );

            // AI SUMMARY
            const summary =
              "AI summary disabled in free mode.";

            // DELETE TEMP FILE
            if (
              req.file?.path &&
              fs.existsSync(req.file.path)
            ) {

              fs.unlinkSync(req.file.path);
            }

            // FINAL RESPONSE
            return res.json({

              extractedText:
                cleanedText,

              aiSummary: summary,

              reportHash,
            });

          } catch (innerErr) {

            console.log(
              "PROCESSING ERROR:",
              innerErr
            );

            // cleanup
            if (
              req.file?.path &&
              fs.existsSync(req.file.path)
            ) {

              fs.unlinkSync(req.file.path);
            }

            return res.status(500).json({
              message:
                "PDF processing failed",
            });
          }
        }
      );

      // LOAD PDF
      pdfParser.loadPDF(req.file.path);

    } catch (err) {

      console.log(
        "PDF ERROR:",
        err
      );

      // cleanup
      if (
        req.file?.path &&
        fs.existsSync(req.file.path)
      ) {

        fs.unlinkSync(req.file.path);
      }

      return res.status(500).json({
        message:
          "PDF extraction failed",
      });
    }
  }
);

export default router;