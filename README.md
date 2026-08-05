# Personal Portfolio Website

A fully responsive, interactive personal portfolio website featuring a custom Flask backend powered by the Google Gemini API for an AI assistant chatbot integration.


## 🛠️ Tech Stack & Architecture

- **Frontend:** HTML5, CSS3, JavaScript
- **Backend:** Python (Flask, Flask-CORS)
- **AI Integration:** Google GenAI SDK (Gemini API)
- **Deployment & Tunnels:** `systemd` background services, `ngrok` / `localtunnel`

---

## 📂 Directory Structure

```text
vcard-personal-portfolio/
├── assets/                 # Static assets (images, CSS, JS)
├── backend/                # Flask AI Chatbot Backend
│   ├── app.py              # Main Flask application entrypoint
│   ├── requirements.txt    # Python dependencies
│   ├── venv/               # Virtual environment
│   └── .env                # Environment variables (API keys)
├── website-demo-image/     # Screenshots & demo assets
├── index.html              # Main portfolio interface
├── LICENSE                 # Project License
└── README.md               # Documentation
```

---

## 🚀 Getting Started

### Prerequisites

- [Git](https://git-scm.com/) installed on your machine.
- [Python 3.10+](https://www.python.org/) installed.

### 1. Clone the Repository

```bash
git clone https://github.com/hkhariwal/vcard-personal-portfolio.git
cd vcard-personal-portfolio
```

### 2. Set Up the Backend

Navigate to the `backend` directory, set up your Python virtual environment, and install dependencies:

```bash
cd backend

# Create and activate virtual environment
python3 -m venv venv
source venv/bin/activate

# Install requirements
pip install -r requirements.txt
```

Create a `.env` file inside the `backend/` folder:

```env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=5001
```

### 3. Run the Backend Server

```bash
python app.py
```

The Flask API server will start running on `http://127.0.0.1:5001`.

---

## ⚙️ Background Services (systemd)

To run the backend service automatically in the background on Linux:

### Backend Service (`github-portfolio-backend.service`)

Create `/etc/systemd/system/github-portfolio-backend.service`:

```ini
[Unit]
Description=Portfolio Flask Backend Service (Port 5001)
After=network.target

[Service]
User=hkhariwal
WorkingDirectory=/home/hkhariwal/Desktop/Projects/vcard-personal-portfolio/backend
ExecStart=/home/hkhariwal/Desktop/Projects/vcard-personal-portfolio/backend/venv/bin/python app.py
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target
```

Enable and start the service:

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now github-portfolio-backend.service
```

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.