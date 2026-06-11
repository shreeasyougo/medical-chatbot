from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import google.generativeai as genai
import os
from dotenv import load_dotenv
import threading
import requests
import time

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-1.5-flash")

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

def keep_alive():
    while True:
        time.sleep(14 * 60)
        try:
            requests.get("https://medical-chatbot-nlka.onrender.com")
        except:
            pass

threading.Thread(target=keep_alive, daemon=True).start()