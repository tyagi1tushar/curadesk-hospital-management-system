from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import google.generativeai as genai
import json
import os 
from dotenv import load_dotenv

load_dotenv()

# Gemini config
genai.configure(
    api_key=os.getenv(
        "GEMINI_API_KEY"
    )
)

model = genai.GenerativeModel(
    "gemini-3-flash-preview"
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

Analyze:

{data.symptom}

Return ONLY raw JSON.

Example:

{{
  "department":"General Physician",
  "severity":"medium",
  "advice":"Rest and hydrate"
}}

No markdown.
No explanation.
Only JSON.
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