# Chatty: A Role-Based Language Learning Assistant

Chatty is an interactive language learning platform that uses large language models (LLMs) to help users practice real-world conversation through immersive, scenario-based roleplay. Users can define custom situations, receive grammar feedback, hear responses as audio, and continue conversations naturally using AI-generated suggestions.

## 🌟 Features

- 🎭 Scenario-based roleplay with customizable AI character
- 🌐 Monolingual enforcement in target language (English, Chinese, Japanese)
- 🗣️ Text-to-speech audio responses
- 💬 Intelligent conversation suggestions
- 📚 Personalized grammar lessons and critique after conversation
- 📖 Gemini-powered dictionary lookup for unknown words

---

## 🛠️ Setup Instructions

### ✅ Step 1: Clone the Repository

```bash
git clone https://github.com/your-username/chatty.git
cd chatty/NewUI+Backend
```

---

### ✅ Step 2: Create and Activate Conda Environment

```bash
conda create -n chatty-env python=3.10
conda activate chatty-env
```

---

### ✅ Step 3: Install Python Dependencies

```bash
pip install -r requirements.txt
```

---

### ✅ Step 4: Install Node.js Dependencies for Frontend

```bash
npm install
```

---

### ✅ Step 5: Start the Backend (FastAPI)

```bash
cd Backend
python server.py
```

This starts the backend on `http://localhost:8000`.

---

### ✅ Step 6: Add the API Key for the frontend environment

Add .env file to the frontend folder, which should include

NEXT_PUBLIC_APIKEY: 
NEXT_PUBLIC_AUTHDOMAIN: 
NEXT_PUBLIC_PROJECTID: 
NEXT_PUBLIC_STORAGEBUCKET: 
NEXT_PUBLIC_MESSAGINGSENDERID: 
NEXT_PUBLIC_APPID: 
NEXT_PUBLIC_MEASUREMENTID:

You can get the API key from https://firebase.google.com/docs/projects/api-keys

---

### ✅ Step 7: Start the Frontend (Next.js)

In a new terminal:

```bash
cd NewUI
npm run dev
```

Frontend runs on `http://localhost:3000`.
