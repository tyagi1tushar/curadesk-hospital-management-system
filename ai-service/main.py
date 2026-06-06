from fastapi import ( FastAPI, HTTPException, UploadFile, File )
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import google.generativeai as genai
import json
import os 
from dotenv import load_dotenv
from langchain_text_splitters import ( RecursiveCharacterTextSplitter )
from pdf2image import convert_from_bytes
from PIL import Image
import io
import pytesseract

pytesseract.pytesseract.tesseract_cmd = (
    r"C:\Program Files\Tesseract-OCR\tesseract.exe"
)


load_dotenv()

# Gemini config
genai.configure(
    api_key=os.getenv(
        "GEMINI_API_KEY"
    )
)

model = genai.GenerativeModel(
    "gemini-3.5-flash"
)

app = FastAPI(
    title="CuraDesk AI Service",
    version="1.0"
)

# CORS

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class SummaryRequest(BaseModel):
    text: str

class SymptomRequest(BaseModel):
    symptom: str

class RagRequest(BaseModel):
    question: str
    context: str
    history: str = ""

class EmbedRequest(BaseModel):
    text: str
    
class ProcessReportRequest(
    BaseModel
):
    text: str


@app.get("/")
def root():

    return {
        "message":
        "CuraDesk AI Service Running"
    }


@app.get("/health")
def health():

    return {
        "status":
        "healthy"
    }


@app.post("/summarize")
def summarize(
    data: SummaryRequest
):

    try:

        prompt = f"""
You are a medical AI assistant.

Analyze the report below.

Return ONLY raw JSON.

Format:

{{
  "short_summary":"...",
  "important_findings":"...",
  "possible_abnormalities":"...",
  "patient_explanation":"..."
}}

No markdown.
No explanation.
Only JSON.

Report:
{data.text}
"""

        response = model.generate_content(
                prompt
            )

        cleaned = (

            response.text

            .replace(
                "```json",
                ""
            )

            .replace(
                "```",
                ""
            )

            .strip()
        )

        result = json.loads(
                cleaned
            )

        return result

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )
    
@app.post("/symptom-analysis")
def symptom_analysis(
    data: SymptomRequest
):

    try:

        prompt = f"""
You are a medical triage AI.

Analyze the symptom and identify the doctor specialization.

Return ONLY JSON.

Example:

{{
  "specialization":"Cardiologist",
  "severity":"high",
  "advice":"Seek immediate medical attention"
}}

Valid specializations:

- Cardiologist
- Neurologist
- Dermatologist
- Orthopedic
- ENT Specialist
- General Physician
- Gastroenterologist
- Pulmonologist
- Psychiatrist
- Ophthalmologist

Symptom:

{data.symptom}

Rules:
- Return ONLY JSON
- Use one specialization from the list
- No markdown
- No explanation
"""

        response = model.generate_content(
            prompt
        )

        cleaned = response.text \
                .replace(
                    "```json",
                    ""
                ) \
                .replace(
                    "```",
                    ""
                ) \
                .strip()

        result = json.loads(
                cleaned
            )

        return result

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )
    
@app.post("/rag-answer")
def rag_answer(
    data: RagRequest
):

    try:

        prompt = f"""
You are CuraDesk AI.

Use ONLY the provided context.

Conversation History:
{data.history}

Context:
{data.context}

Question:
{data.question}

Rules:
- Answer from context only
- Be concise
- If answer missing say:
"I could not find this in the uploaded document."
"""

        response = model.generate_content(
            prompt
        )

        return {
            "answer": response.text
        }

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )
    

@app.post("/embed-report")
def embed_report(
    data: EmbedRequest
):

    try:

        print(
            "FASTAPI EMBEDDING CALLED"
        )

        response = genai.embed_content(
            model=
            "models/gemini-embedding-001",
            content=
            data.text
        )

        return {
            "embedding": response["embedding"]
        }

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )
        
        
@app.post(
    "/process-report"
)
def process_report(
    data:
    ProcessReportRequest
):

    try:

        print(
            "PROCESS REPORT CALLED"
        )

        splitter = (
            RecursiveCharacterTextSplitter(

                chunk_size=1200,

                chunk_overlap=200,

                separators=[

                    "\n\n",

                    "\n",

                    ". ",

                    " ",

                    ""
                ],
            )
        )

        chunks = (
            splitter.split_text(
                data.text
            )
        )

        embeddings = []

        for chunk in chunks:

            response = (
                genai.embed_content(

                    model=
                    "models/gemini-embedding-001",

                    content=
                    chunk
                )
            )

            embeddings.append(

                response[
                    "embedding"
                ]
            )

        return {

            "chunks":
                chunks,

            "embeddings":
                embeddings
        }

    except Exception as e:

        raise HTTPException(

            status_code=500,

            detail=str(e)
        )
        
        
@app.post(
    "/ocr-report"
)
async def ocr_report(

    file:
    UploadFile = File(...)
):

    try:

        print(
            "OCR REPORT CALLED"
        )

        pdf_bytes = (
            await file.read()
        )

        images = (
    convert_from_bytes(

        pdf_bytes,

        poppler_path=
        r"C:\poppler\Library\bin"
    )
 )

        pages = []

        for i, img in enumerate(images):

            text = (
                pytesseract
                .image_to_string(
                    img
                )
            )

            pages.append({

                "page":
                    i + 1,

                "text":
                    text
            })

        return {

            "pages":
                pages
        }

    except Exception as e:

        raise HTTPException(

            status_code=500,

            detail=str(e)
        )