from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-flash-latest")

SYSTEM_PROMPT = """You are a helpful medical assistant. Answer medical questions clearly and simply.
Always remind users to consult a real doctor for serious concerns.
Format responses in clean markdown with headings and bullet points where helpful."""

class Question(BaseModel):
    text: str

@app.get("/")
def root():
    return {"status": "running"}

@app.post("/ask")
async def ask(q: Question):
    response = model.generate_content(f"{SYSTEM_PROMPT}\n\nQuestion: {q.text}")
    return {"answer": response.text}