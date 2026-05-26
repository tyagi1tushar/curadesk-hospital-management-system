import express from "express";
import { collection } from "../services/chromaService.js";
import { createEmbedding } from "../services/embeddingService.js";
import { GoogleGenAI } from "@google/genai";
import { askReportWithLangChain } from "../services/langchainReportService.js";
import { getRetriever } from "../services/langchainRetrieverService.js";
import { getChatHistory } from "../services/langchainMemoryService.js";
import { buildGraph } from "../services/langgraphService.js";
import { summarizeMedicalReport } from "../services/reportAIService.js";
import { analyzeSymptoms } from "../services/aiService.js";
import redisClient from "../config/redis.js";
import ChatSession from "../models/chatSessionModel.js";
import Message from "../models/messageModel.js";
import Doctor from "../models/doctor.js";
import crypto from "crypto";

const router = express.Router();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

router.post("/ask", async (req, res) => {

  try {

    const {

      question,

      reportHash

    } = req.body;

    console.log(
      "REPORT HASH RECEIVED:",
      reportHash
    );

    const authData =
      req.auth();

    console.log(
      "AUTH DATA:",
      authData
    );

    const userId =
      authData?.userId;

    const normalizedQuestion =
      question
        ?.trim()
        .toLowerCase()
        .replace(/\s+/g, " ");

    console.log(
      "CHAT USER ID:",
      userId
    );

    if (!userId) {

      return res.status(401).json({

        message:
          "Unauthorized",
      });
    }

    // FIND OR CREATE CHAT SESSION

    let chatSession =

      await ChatSession.findOne({

        userId,

        reportHash:
          reportHash || null,
      });

    if (!chatSession) {

      chatSession =

        await ChatSession.create({

          userId,

          reportHash:
            reportHash || null,
        });
    }

    if (!question) {

      return res.status(400).json({
        message: "Question is required",
      });
    }

    if (!reportHash) {

      return res.status(400).json({

        message:
          "Report not selected.",
      });
    }

    // REDIS CACHE CHECK
    const history =
      await getChatHistory(
        chatSession._id
      );

    console.log(
      "CHAT HISTORY:",
      history
    );

    const historyHash =
      crypto
        .createHash("sha256")
        .update(history || "")
        .digest("hex");

    const cacheKey =
      `rag:v3:${userId}:${reportHash}:${historyHash}:${normalizedQuestion}`;

    const cachedAnswer =
      await redisClient.get(cacheKey);

    if (cachedAnswer) {

      console.log("RAG CACHE HIT");

      return res.json(
        JSON.parse(cachedAnswer)
      );
    }

    let finalAnswer = "";

    let relevantChunks = "";



    const graph =
      buildGraph();









    // =========================
    // SIMPLE QUESTIONS
    // =========================


    const needsAI = [

      "explain",
      "summary",
      "summarize",
      "meaning",
      "analysis",
      "dangerous",
      "precaution",
      "treatment",
      "cause",
      "serious",
      "recommend",

    ].some(word =>
      question
        .toLowerCase()
        .includes(word)
    );




    // GEMINI GENERATION


    // =========================
    // SIMPLE QUESTION MODE
    // NO EMBEDDINGS
    // =========================


    // =========================
    // ADVANCED QUESTION MODE
    // =========================

    // =========================
    // VECTOR SEARCH FOR ALL QUESTIONS
    // =========================

    {

      // CREATE EMBEDDING

      /** const questionEmbedding =
        await createEmbedding(question);

      // VECTOR SEARCH

      console.log(
        "CHROMA FILTER:",
        {
          reportHash,
        }
      );

      const results =
        await collection.query({

          where: {

            reportHash,
          },

          queryEmbeddings: [
            questionEmbedding,
          ],

          nResults: 3,
        }); **/

      console.log(
        "LANGCHAIN RETRIEVER MODE"
      );

      const retriever =
        await getRetriever(
          reportHash
        );

      const docs =
        await retriever.invoke(
          question
        );

      console.log(
        "RETRIEVED DOCS:",
        docs
      );

      console.log(
        "RAG RESULTS:",
        docs
      );

      // EMPTY RESULT

      /** if (

        !results.documents ||

        !results.documents[0] ||

        results.documents[0].length === 0

      ) **/

      if (!docs || docs.length === 0) {

        return res.json({

          answer:
            "No relevant information found.",

          context: "",
        });
      }

      // REMOVE DUPLICATES

      /** relevantChunks =

        results.documents[0]

          .map(

            (doc, i) => {

              const page =

                results
                  .metadatas[0][i]
                  ?.page;

              return `

Page ${page}:

${doc}

`;
            }
          )

          .join("\n"); **/

      relevantChunks =
        docs
          .map(
            (doc, i) => {

              const page =
                doc.metadata?.page;

              return `

Page ${page}:

${doc.pageContent}

`;
            }
          )
          .join("\n");

      console.log(
        "RELEVANT CHUNKS:",
        relevantChunks
      );


      const graphResult =
        await graph.invoke({

          question,

          relevantChunks,

          userId,

          history,
        });


      console.log(
        "GRAPH RESULT:",
        graphResult
      );

      if (
        graphResult.route ===
        "symptom"
      ) {

        console.log(
          "LANGGRAPH SYMPTOM ROUTE"
        );

        // ======================
        // SYMPTOM CACHE KEY
        // ======================

        const symptomCacheKey =
          `symptom:v1:${userId}:${normalizedQuestion}`;

        // ======================
        // REDIS CHECK
        // ======================

        const cachedSymptom =

          await redisClient.get(
            symptomCacheKey
          );

        if (
          cachedSymptom
        ) {

          console.log(
            "SYMPTOM CACHE HIT"
          );

          return res.json(

            JSON.parse(
              cachedSymptom
            )
          );
        }

        // ======================
        // GRAPH CALL
        // ======================

        const symptomResult =
          graphResult;

        const finalResponse = {

          answer:

            `Department: ${symptomResult
              .aiResponse
              ?.department ||

            "General Physician"
            }

Severity: ${symptomResult
              .aiResponse
              ?.severity ||

            "low"
            }

Advice: ${symptomResult
              .aiResponse
              ?.advice ||

            "Please consult a doctor."
            }`,

          doctors:
            symptomResult
              .doctors || [],

          type:

            symptomResult
              .doctors?.length > 0

              ? "available"

              : "no-slots",
        };

        // ======================
        // MONGO SAVE
        // ======================

        await Message.create({

          chatSessionId:
            chatSession._id,

          role:
            "user",

          text:
            question,
        });

        await Message.create({

          chatSessionId:
            chatSession._id,

          role:
            "assistant",

          text:
            finalResponse.answer,
        });

        // ======================
        // REDIS SAVE
        // ======================

        await redisClient.set(

          symptomCacheKey,

          JSON.stringify(
            finalResponse
          ),

          "EX",

          86400
        );

        console.log(
          "SYMPTOM CACHE SAVED"
        );

        return res.json(
          finalResponse
        );
      }

      if (
        graphResult.route ===
        "summary"
      ) {

        console.log(
          "LANGGRAPH SUMMARY ROUTE"
        );

        finalAnswer =
          graphResult.answer;

        const finalResponse = {

          answer:
            finalAnswer,

          context: "",
        };

        // SAVE USER MESSAGE

        await Message.create({

          chatSessionId:
            chatSession._id,

          role:
            "user",

          text:
            question,
        });

        // SAVE AI MESSAGE

        await Message.create({

          chatSessionId:
            chatSession._id,

          role:
            "assistant",

          text:
            finalAnswer,
        });

        // REDIS CACHE

        await redisClient.set(

          cacheKey,

          JSON.stringify(
            finalResponse
          ),

          "EX",

          86400
        );

        return res.json(
          finalResponse
        );
      }

      // =========================
      // RETRIEVAL ONLY
      // =========================

      if (
        graphResult.route ===
        "rag"
      ) {

        console.log(
          "LANGGRAPH RAG ROUTE"
        );

        finalAnswer =
          graphResult.answer;
      }
    }


    // SAVE USER MESSAGE

    await Message.create({

      chatSessionId:
        chatSession._id,

      role:
        "user",

      text:
        question,
    });

    // SAVE AI MESSAGE

    await Message.create({

      chatSessionId:
        chatSession._id,

      role:
        "assistant",

      text:
        finalAnswer,
    });

    // FINAL RESPONSE


    const finalResponse = {

      answer: finalAnswer,

      context: relevantChunks,
    };


    // SAVE TO REDIS CACHE


    await redisClient.set(

      cacheKey,

      JSON.stringify(finalResponse),

      "EX",

      86400 // 24 hours
    );

    res.json(finalResponse);

  } catch (err) {

    console.log("RAG ERROR:", err);

    res.status(500).json({
      message: "RAG failed",
    });
  }
});

router.get(

  "/history",

  async (req, res) => {

    try {

      const authData =
        req.auth();

      const userId =
        authData?.userId;

      if (!userId) {

        return res.status(401).json({

          message:
            "Unauthorized",
        });
      }

      const {

        reportHash

      } = req.query;

      const chatSession =

        await ChatSession.findOne({

          userId,

          reportHash:
            reportHash || null,
        });

      if (!chatSession) {

        return res.json([]);
      }

      const messages =

        await Message.find({

          chatSessionId:
            chatSession._id,
        })

          .sort({

            createdAt: 1,
          });

      res.json(messages);

    } catch (err) {

      console.log(

        "HISTORY ERROR:",

        err
      );

      res.status(500).json({

        message:
          "History failed",
      });
    }
  }
);

export default router;