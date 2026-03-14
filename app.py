import os
from flask import Flask, render_template, request, jsonify, session
from chatbot.responses import get_response

app = Flask(__name__)
app.secret_key = "sheshield-secret-key"

@app.route("/")
def home():
    session["history"] = []
    return render_template("index.html")

@app.route("/chat", methods=["POST"])
def chat():
    user_message = request.json.get("message")
    
    # Get history from session
    history = session.get("history", [])
    
    # Get response with history
    response = get_response(user_message, history)
    
    # Update history
    history.append({"role": "user", "content": user_message})
    history.append({"role": "assistant", "content": response})
    
    # Keep only last 10 messages so it doesn't get too long
    if len(history) > 10:
        history = history[-10:]
    
    session["history"] = history
    
    return jsonify({"response": response})

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))
    app.run(host="0.0.0.0", port=port, debug=False)