from groq import Groq
from dotenv import load_dotenv
import os

load_dotenv()
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

SYSTEM_PROMPT = """
You are She-Shield, a compassionate and knowledgeable women's health and safety assistant.

You help women with:
- Women's health topics: PCOS, menstrual health, pregnancy, nutrition, mental health
- Safety guidance and emergency situations
- Finding medical help and knowing when to see a doctor
- Self care and wellness tips

Rules:
- Always be warm, supportive and non judgmental
- Keep responses concise — maximum 3-4 sentences
- If someone is in danger or emergency, always tell them to call 112 immediately
- Never diagnose — always suggest consulting a doctor for serious concerns
- If asked anything unrelated to women's health or safety, politely redirect back to your purpose
"""

def get_response(message, history=[]):
    try:
        messages = [{"role": "system", "content": SYSTEM_PROMPT}]
        messages.extend(history)
        messages.append({"role": "user", "content": message})

        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=messages
        )
        return response.choices[0].message.content
    except Exception as e:
        print("Error:", e)
        return "I'm having trouble connecting right now. Please try again in a moment."