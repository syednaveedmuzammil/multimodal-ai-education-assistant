# Multimodal AI Education Assistant

A student-profile-centered learning platform that processes text, PDF, images, speech, and handwritten notes to generate personalized summaries, explanations, and quizzes.

## Architecture

```
User → Student Profile → Learning History → AI Services → Outputs
```

Every AI feature reads from and updates the student's profile and learning history.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React (Vite), Tailwind CSS, shadcn/ui, Framer Motion |
| Backend | FastAPI, SQLAlchemy, JWT Auth |
| Database | MySQL 8 |
| LLM | Ollama + Phi-3 Mini |
| OCR | EasyOCR (CPU) |
| Speech | Whisper Tiny |
| PDF | PyMuPDF |
| NLP | spaCy |

## Prerequisites

- Python 3.11+
- Node.js 18+
- MySQL 8 (or Docker)
- [Ollama](https://ollama.com/) with Phi-3 Mini

## Quick Start (Local Development)

### 1. Start MySQL

```bash
docker compose up mysql -d
```

Or use a local MySQL instance and create database `edu_assistant`.

### 2. Start Ollama

```bash
ollama serve
ollama pull phi3:mini
```

### 3. Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
pip install -r requirements.txt
python -m spacy download en_core_web_sm
copy .env.example .env       # edit DATABASE_URL if needed
uvicorn app.main:app --reload --port 8000
```

API docs: http://localhost:8000/docs

### 4. Frontend

```bash
cd frontend
npm install
npm run dev
```

App: http://localhost:5173

## Milestone 1 Features

- [x] User registration & login (JWT)
- [x] Student profile (auto-created on register)
- [x] Protected routes
- [x] Multimodal input: Text, PDF, Image, Speech, Handwritten Notes
- [x] AI Summary (profile-aware)
- [x] AI Explanation (profile-aware)
- [x] Quiz generation — 5 MCQs with correct answers
- [x] Learning history log
- [x] Session management

## Milestone 2 (Planned)

- Quiz attempts & auto-evaluation
- Difficulty prediction
- Knowledge tracing
- Weak topic detection
- Personalized study plans
- Analytics dashboard

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/register` | Register + create profile |
| POST | `/api/v1/auth/login` | Login → JWT |
| GET | `/api/v1/auth/me` | Current user |
| GET/PUT | `/api/v1/profile` | Student profile |
| POST | `/api/v1/text/submit` | Submit text |
| POST | `/api/v1/pdf/upload` | Upload PDF |
| POST | `/api/v1/image/upload` | Upload image |
| POST | `/api/v1/speech/upload` | Upload audio |
| POST | `/api/v1/notes/upload` | Upload handwritten notes |
| POST | `/api/v1/assistant/summary` | Generate summary |
| POST | `/api/v1/assistant/explain` | Generate explanation |
| POST | `/api/v1/assistant/quiz` | Generate 5 MCQs |
| GET | `/api/v1/sessions` | List sessions |
| GET | `/api/v1/quizzes/{id}` | Get quiz with answers |
| GET | `/api/v1/history` | Learning history |
| GET | `/api/v1/health` | Health check |

## Docker (Production-Ready Structure)

```bash
# MySQL + Backend (Ollama runs on host for GPU/CPU flexibility)
docker compose up -d
```

## CPU / 8GB RAM Notes

- Whisper **tiny** model (~75MB)
- EasyOCR runs in CPU mode
- Phi-3 Mini via Ollama (~2.3GB)
- Models load lazily on first request
- Process one upload at a time for best performance

## Project Structure

```
├── backend/          # FastAPI + AI services
├── frontend/         # React + shadcn/ui
├── docker-compose.yml
└── README.md
```
