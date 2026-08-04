import json
import os
from datetime import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv  # <-- Import load_dotenv
from google import genai
from google.genai import types

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
CORS(app)

MESSAGES_FILE = 'messages.json'

# Initialize Gemini Client (automatically picks up GEMINI_API_KEY from environment)
client = None
if os.getenv("GEMINI_API_KEY"):
    client = genai.Client()

# System Instruction / Persona Context
SYSTEM_INSTRUCTION = """
You are "AI Hardik", an interactive AI representative for Hardik Khariwal's personal portfolio website.
Your role is to answer questions from recruiters, visitors, and engineering hiring managers concisely and professionally.

--- HARDIK'S PROFILE & BACKGROUND ---
- Name: Hardik Khariwal
- Education: Dual Degree (B.Tech + M.Tech) Student in Electrical Engineering at IIT Bombay (Expected Grad: 2027), Specializing in Signal Processing & Communication with a Minor in Artificial Intelligence and Data Science.
- Current Roles:
  1. AI Engineer Intern at Raekis.ai (Remote) - Building and deploying AI engineering solutions, agentic workflows, and LLM integrations.
  2. Software Developer at Placement Office, IIT Bombay - Engineering web and analytical platforms for campus placement operations.
- Previous Roles: Software Engineer Intern at Attentions.ai - Scalable backend features and software application modules.
- Research / Thesis: Dual Degree Project exploring Multi-Resolution Wavelet Analysis on Biometrics under Professor Gadre at IIT Bombay.
- Core Skills & Stack:
  - Languages: Python, C/C++, TypeScript, JavaScript, SQL
  - AI / ML: PyTorch, TensorFlow, LLMs, Prompt Engineering, RAG, Agentic AI Workflows, OpenCV
  - Full-Stack: React, Next.js, Flask, FastAPI, Node.js, PostgreSQL, Docker, Git, Linux (Ubuntu/Kali)
- Contact:
  - Email: khariwalhardik@gmail.com
  - Phone: +91 99502 29120
  - Location: IIT Bombay, Powai, Mumbai, Maharashtra, India
  - Socials: LinkedIn (in/hardikkhariwal), GitHub (github.com/khariwalhardik)

--- RESPONSE GUIDELINES ---
1. Maintain a friendly, confident, and professional tone.
2. Keep responses brief and formatted cleanly (1-3 sentences or short bullet points).
3. Always speak in the third person when describing Hardik (e.g., "Hardik is an AI Engineer...", "His research focuses on...").
4. If a question is off-topic or unrelated to Hardik's background, work, or skills, politely redirect the user back to his portfolio.
"""

# --- Contact Form Endpoint ---
@app.route('/api/contact', methods=['POST'])
def handle_contact():
    try:
        data = request.get_json()
        if not data or not data.get('name') or not data.get('email') or not data.get('message'):
            return jsonify({'status': 'error', 'message': 'All fields are required.'}), 400

        new_entry = {
            'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
            'name': data.get('name').strip(),
            'email': data.get('email').strip(),
            'message': data.get('message').strip()
        }

        messages = []
        if os.path.exists(MESSAGES_FILE):
            with open(MESSAGES_FILE, 'r', encoding='utf-8') as f:
                try:
                    messages = json.load(f)
                except json.JSONDecodeError:
                    messages = []

        messages.append(new_entry)

        with open(MESSAGES_FILE, 'w', encoding='utf-8') as f:
            json.dump(messages, f, indent=2, ensure_ascii=False)

        return jsonify({'status': 'success', 'message': 'Message saved successfully.'}), 200

    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

# --- Gemini LLM Chat Endpoint ---
@app.route('/api/chat', methods=['POST'])
def handle_chat():
    try:
        data = request.get_json()
        user_msg = data.get('message', '').strip()

        if not user_msg:
            return jsonify({'error': 'Message cannot be empty.'}), 400

        if not client:
            return jsonify({
                'reply': "Hardik is an AI Engineer and Dual Degree student at IIT Bombay. You can contact him at khariwalhardik@gmail.com."
            }), 200

        # Call Gemini Model using an active listed identifier
        response = client.models.generate_content(
            model='gemini-3.5-flash',  # <-- Use gemini-2.5-flash or gemini-2.0-flash
            contents=user_msg,
            config=types.GenerateContentConfig(
                system_instruction=SYSTEM_INSTRUCTION,
                temperature=0.3,
                max_output_tokens=300
            )
        )

        reply = response.text.strip() if response.text else "I couldn't process that request."
        return jsonify({'reply': reply}), 200

    except Exception as e:
        print(f"Gemini API Error: {e}")
        return jsonify({
            'reply': "Hardik is an AI Engineer Intern at Raekis.ai and an EE Dual Degree student at IIT Bombay. Feel free to contact him at khariwalhardik@gmail.com!"
        }), 200

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5001, debug=True)