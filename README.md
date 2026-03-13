# 🛡️ She-Shield — Women's Health & Safety Assistant

> An AI-powered web app giving women access to health information and emergency safety tools.

---

## Features
- 🤖 AI chat with memory — ask about PCOS, mental health, menstrual health, nutrition
- 🏥 Nearby hospital finder with live interactive map
- 🚨 SOS button with real-time GPS location and emergency numbers
- 💡 Smart follow-up question suggestions after every response
- 🎨 Modern dark UI with typing animation and timestamps

## Tech Stack
Python • Flask • Groq API (LLaMA 3.3) • JavaScript • HTML • CSS • Leaflet.js • OpenStreetMap

## Run Locally
```bash
git clone https://github.com/palak1-2/she-shield.git
cd she-shield
pip3 install flask groq python-dotenv
```

Create a `.env` file and add:
```
GROQ_API_KEY=your_key_here
```

Then run:
```bash
python3 app.py
```
Open `http://127.0.0.1:5000` in your browser.

---

> Built by **Palak Sinojia
> *This app is not a substitute for professional medical advice.*
```

Then push:
```
git add README.md
git commit -m "add README"
git push
