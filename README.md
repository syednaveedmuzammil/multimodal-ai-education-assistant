# Multimodal AI Education Assistant

> **An AI-powered multimodal educational assistant for personalized learning using Large Language Models and Knowledge Tracing**

A full-stack web application designed to provide students with an intelligent and personalized learning environment. The system is being developed to support multiple forms of educational input and provide learning assistance through an interactive web interface.

The project combines a **React frontend**, **FastAPI backend**, and **MySQL database**, with AI capabilities being developed for multimodal content processing, summarization, question answering, quiz generation, personalized learning, and knowledge tracing.

---

## 📌 Project Overview

Traditional educational platforms often rely heavily on text-based interaction and provide the same learning resources to every student. This project aims to address these limitations by developing a unified educational assistant capable of processing different forms of learning content and adapting assistance according to the learner's needs and progress.

The proposed system is designed to accept learning materials such as:

* Text
* PDF documents
* Images
* Speech/audio
* Handwritten notes

The platform is intended to provide intelligent learning support including:

* Content summarization
* Academic explanations
* Question answering
* Quiz generation
* Learning history tracking
* Personalized learning recommendations
* Difficulty prediction
* Knowledge tracing
* Knowledge graph-based concept visualization

The project follows a modular architecture so that frontend, backend, database, authentication, and future AI services can be developed and maintained independently.

---

## 🎯 Objectives

The project objectives are:

1. Develop a multimodal AI-based educational assistant capable of processing text, speech, images, and handwritten notes.

2. Provide intelligent learning support through summarization, question answering, explanations, and quiz generation.

3. Implement personalized learning mechanisms by analyzing student performance and learning history.

4. Support adaptive study planning and difficulty prediction.

5. Integrate Large Language Models, OCR, speech recognition, computer vision, and machine learning technologies.

6. Represent relationships between concepts using interactive knowledge graphs.

7. Provide a secure web-based platform for students to manage their learning activities and progress.

---

## 🏗️ System Architecture

```text
                         ┌──────────────────────────┐
                         │       Student/User       │
                         └────────────┬─────────────┘
                                      │
                                      ▼
                         ┌──────────────────────────┐
                         │     React Frontend       │
                         │      Vite + Tailwind     │
                         │                          │
                         │ Dashboard                │
                         │ Chat                     │
                         │ Notes                    │
                         │ Quiz                     │
                         │ Profile                  │
                         │ Analytics                │
                         │ Knowledge Graph           │
                         └────────────┬─────────────┘
                                      │
                              HTTP / REST API
                                      │
                                      ▼
                         ┌──────────────────────────┐
                         │      FastAPI Backend     │
                         │                          │
                         │ Authentication           │
                         │ API Routes               │
                         │ Database Access          │
                         │ Models & Schemas         │
                         │ Application Configuration│
                         └────────────┬─────────────┘
                                      │
                         ┌────────────┴─────────────┐
                         │                          │
                         ▼                          ▼
                ┌──────────────────┐      ┌──────────────────┐
                │    MySQL 8       │      │   AI Services    │
                │                  │      │                  │
                │ User Data        │      │ LLM              │
                │ Profiles         │      │ OCR              │
                │ Learning Data    │      │ Speech           │
                │ History          │      │ ML / Knowledge   │
                └──────────────────┘      │ Tracing          │
                                          └──────────────────┘
```

The current implementation establishes the React/Vite frontend, FastAPI backend, MySQL integration, authentication foundation, and application structure. AI service integration is being developed incrementally.

---

# 🛠️ Technology Stack

## Frontend

| Technology            | Purpose                            |
| --------------------- | ---------------------------------- |
| React 19              | UI development                     |
| Vite                  | Frontend development/build tooling |
| React Router          | Client-side routing                |
| Tailwind CSS          | Styling                            |
| Framer Motion         | Animations and transitions         |
| Axios                 | HTTP/API communication             |
| Lucide React          | UI icons                           |
| Heroicons             | UI icons                           |
| React Hook Form       | Form management                    |
| React Markdown        | Markdown rendering                 |
| Recharts              | Charts and analytics               |
| React Hot Toast       | Notifications                      |
| clsx / tailwind-merge | Conditional and merged styling     |

The current frontend package configuration uses React 19.1.1 and Vite 7.1.3, along with the libraries listed above.

## Backend

| Technology        | Purpose                        |
| ----------------- | ------------------------------ |
| Python            | Backend programming language   |
| FastAPI           | REST API framework             |
| Uvicorn           | ASGI application server        |
| SQLAlchemy        | ORM/database abstraction       |
| PyMySQL           | MySQL database driver          |
| Pydantic          | Data validation                |
| Pydantic Settings | Configuration management       |
| PyJWT             | JWT authentication             |
| pwdlib + Argon2   | Password hashing               |
| python-dotenv     | Environment configuration      |
| python-multipart  | Multipart/file request support |

## Database

* MySQL 8
* Database: `edu_assistant`
* SQLAlchemy ORM
* PyMySQL driver

## Planned AI/ML Layer

The project scope includes integration of:

* Large Language Models
* Optical Character Recognition
* Speech Recognition
* Computer Vision
* Machine Learning
* Knowledge Tracing
* Knowledge Graphs

These capabilities are being implemented progressively and should not be considered fully available merely from the current repository structure.

---

# 📂 Project Structure

```text
multimodal-ai-education-assistant/
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   └── routes/
│   │   │
│   │   ├── core/
│   │   │
│   │   ├── db/
│   │   │
│   │   ├── models/
│   │   │   └── user.py
│   │   │
│   │   ├── schemas/
│   │   │   ├── auth.py
│   │   │   └── user.py
│   │   │
│   │   ├── __init__.py
│   │   └── main.py
│   │
│   ├── .env.example
│   ├── .gitignore
│   └── requirements.txt
│
├── frontend/
│   ├── public/
│   │
│   ├── src/
│   │   ├── components/
│   │   ├── config/
│   │   ├── constants/
│   │   ├── contexts/
│   │   ├── data/
│   │   ├── hooks/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── providers/
│   │   ├── services/
│   │   ├── styles/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   ├── eslint.config.js
│   ├── index.html
│   ├── jsconfig.json
│   ├── package.json
│   ├── package-lock.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── .gitignore
└── README.md
```

The frontend currently contains dedicated pages for areas including the dashboard, chat, analytics, knowledge graph, notes, profile, quiz, authentication, landing/home, and error handling.

---

# 💻 Prerequisites

Install the following before running the project:

* **Node.js 18+**
* **Python 3.11+**
* **MySQL 8**
* Git

Optional AI services will be required as their corresponding modules are integrated.

---

# 🚀 Local Development Setup

## 1. Clone the repository

```bash
git clone https://github.com/syednaveedmuzammil/multimodal-ai-education-assistant.git
cd multimodal-ai-education-assistant
```

---

# 🗄️ 2. Configure MySQL

Make sure MySQL 8 is running.

Create the project database:

```sql
CREATE DATABASE IF NOT EXISTS edu_assistant
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;
```

Verify:

```sql
SHOW DATABASES;
```

The database should contain:

```text
edu_assistant
```

### Local MySQL Configuration

The project uses:

```text
Host: 127.0.0.1 / localhost
Port: 3306
Database: edu_assistant
```

The repository's backend environment template uses a SQLAlchemy/PyMySQL connection URL in the following format:

```text
mysql+pymysql://root:<PASSWORD>@localhost:3306/edu_assistant
```

---

# ⚙️ 3. Backend Setup

Open a terminal in the project root:

```bash
cd backend
```

### Create a virtual environment

Windows:

```powershell
py -m venv venv
```

Activate it:

```powershell
.\venv\Scripts\Activate.ps1
```

If PowerShell blocks script execution for the current session:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
```

Then:

```powershell
.\venv\Scripts\Activate.ps1
```

### Install dependencies

```bash
pip install -r requirements.txt
```

### Configure environment variables

Copy:

```text
.env.example
```

to:

```text
.env
```

Windows:

```powershell
copy .env.example .env
```

Configure the database connection and authentication settings in `.env`.

Example:

```env
APP_NAME=LearnMate AI API
APP_VERSION=1.0.0
ENVIRONMENT=development

HOST=127.0.0.1
PORT=8000

FRONTEND_URL=http://localhost:5173

DATABASE_URL=mysql+pymysql://root:<YOUR_PASSWORD>@localhost:3306/edu_assistant

SECRET_KEY=<YOUR_SECRET_KEY>
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
```

Do not commit `.env` or real credentials to GitHub.

### Start the backend

```bash
uvicorn app.main:app --reload --port 8000
```

The API will be available at:

```text
http://127.0.0.1:8000
```

Interactive API documentation:

```text
http://127.0.0.1:8000/docs
```

OpenAPI schema:

```text
http://127.0.0.1:8000/openapi.json
```

---

# 🎨 4. Frontend Setup

Open another terminal:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the Vite development server:

```bash
npm run dev
```

The frontend will normally be available at:

```text
http://localhost:5173
```

---

# 🧪 Available Frontend Commands

### Development

```bash
npm run dev
```

### Production build

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

### ESLint

```bash
npm run lint
```

---

# 🔐 Authentication

The backend includes a JWT-based authentication foundation.

The authentication system is designed around:

* User registration
* User login
* JWT access tokens
* Current-user retrieval
* Protected resources
* Password hashing
* User profile management

The frontend includes authentication-related pages and protected-route architecture.

---

# 📚 Current Application Areas

The frontend currently contains pages/components supporting the following application areas:

### Landing / Home

Introduces the platform and provides the entry point for users.

### Authentication

Provides login and registration flows.

### Dashboard

Provides the central student learning interface with reusable dashboard components and learning-oriented actions/statistics.

### Chat

Provides the interface for interaction with the educational assistant.

### Notes

Provides the interface for working with learning notes and educational content.

### Quiz

Provides the quiz-oriented learning interface.

### Analytics

Provides the structure for presenting learning and performance information.

### Knowledge Graph

Provides the interface intended for visualizing relationships between concepts.

### Profile

Provides student profile information and management.

---

# 🤖 Multimodal Learning

The project's intended multimodal architecture supports multiple forms of educational input:

```text
                    Learning Content
                           │
          ┌────────────────┼────────────────┐
          │        │       │       │        │
         Text     PDF    Image   Speech   Handwritten
          │        │       │       │        │
          └────────┴───────┴───────┴────────┘
                           │
                           ▼
                    Processing Layer
                           │
                           ▼
                  AI / ML Services
                           │
             ┌─────────────┼─────────────┐
             │             │             │
         Summary      Explanation      Quiz
             │             │             │
             └─────────────┼─────────────┘
                           ▼
                  Personalized Learning
```

The multimodal processing and AI service layer will be expanded as development progresses.

---

# 🧠 Personalized Learning

Personalization is a central part of the project.

The intended system will use information such as:

* Student profile
* Learning history
* Quiz performance
* Concept-level performance
* Difficulty information
* Weak concepts
* Learning progress

to support:

* Difficulty prediction
* Adaptive learning
* Personalized study plans
* Knowledge tracing
* Weak-topic identification
* Learning analytics

---

# 🕸️ Knowledge Graph

The project includes a knowledge-graph component intended to represent relationships between concepts.

A simplified representation is:

```text
        ┌──────────────┐
        │   Concept A  │
        └──────┬───────┘
               │
          prerequisite
               │
               ▼
        ┌──────────────┐
        │   Concept B  │
        └──────┬───────┘
               │
            related
               │
               ▼
        ┌──────────────┐
        │   Concept C  │
        └──────────────┘
```

This is intended to help students understand relationships between topics and identify areas that require additional study.

---

# 🔌 Backend Development

The backend follows a modular FastAPI structure:

```text
app/
├── api/
│   └── routes/
├── core/
├── db/
├── models/
├── schemas/
└── main.py
```

### API Layer

Contains the application's HTTP/API routing structure.

### Core Layer

Contains application-level configuration and security-related functionality.

### Database Layer

Handles database connectivity and session management.

### Models

Contains SQLAlchemy database models.

### Schemas

Contains Pydantic request/response schemas.

### Main Application

`app/main.py` initializes the FastAPI application and its routes/configuration.

---

# 🌐 Frontend Architecture

The frontend follows a modular React architecture:

```text
src/
├── components/
├── config/
├── constants/
├── contexts/
├── data/
├── hooks/
├── layouts/
├── pages/
├── providers/
├── services/
├── styles/
└── utils/
```

This separation allows:

* Reusable UI components
* Centralized configuration
* Reusable hooks
* Page-level organization
* API/service separation
* Application-wide contexts/providers
* Utility functions
* Consistent styling

---

# 🔄 Development Workflow

For local development, run the services independently.

### Terminal 1 — MySQL

Ensure MySQL 8 is running on:

```text
localhost:3306
```

### Terminal 2 — Backend

```powershell
cd backend
.\venv\Scripts\Activate.ps1
uvicorn app.main:app --reload --port 8000
```

### Terminal 3 — Frontend

```powershell
cd frontend
npm run dev
```

The resulting architecture is:

```text
Browser
   │
   ▼
React + Vite
localhost:5173
   │
   │ REST API
   ▼
FastAPI
127.0.0.1:8000
   │
   ▼
MySQL 8
localhost:3306
```

---

# 🛡️ Security Considerations

The project uses a security-oriented backend foundation including:

* JWT authentication
* Password hashing
* Protected API resources
* Environment-based configuration
* Separation of frontend and backend
* Database credentials stored through environment variables

Never commit:

```text
.env
venv/
node_modules/
database credentials
JWT secret keys
API keys
```

to the repository.

---

# 📈 Development Roadmap

## Phase 1 — Foundation

* [x] React/Vite frontend structure
* [x] FastAPI backend structure
* [x] MySQL database configuration
* [x] Authentication foundation
* [x] JWT security foundation
* [x] Student profile foundation
* [x] Dashboard architecture
* [x] Chat interface
* [x] Notes interface
* [x] Quiz interface
* [x] Analytics interface
* [x] Knowledge graph interface
* [x] Complete frontend-backend integration

## Phase 2 — Multimodal AI

* [x] Text processing
* [x] PDF processing
* [x] Image processing
* [x] Handwritten-note processing
* [x] Speech-to-text processing
* [x] LLM-powered summarization
* [x] AI explanations
* [x] AI question answering
* [x] Automated quiz generation


## Phase 3 — Personalized Learning

* [ ] Quiz attempt tracking
* [ ] Automatic evaluation
* [ ] Difficulty prediction
* [ ] Knowledge tracing
* [ ] Weak-concept detection
* [ ] Personalized study plans
* [ ] Learning analytics

## Phase 4 — Advanced Learning Intelligence

* [ ] Interactive knowledge graphs
* [ ] Adaptive recommendations
* [ ] Improved multimodal interaction
* [ ] Model optimization
* [ ] Performance evaluation
* [ ] Deployment

---

# 🎓 Academic Context

**Project Title:**

> Multimodal AI Education Assistant Using Large Language Models and Knowledge Tracing for Personalized Learning

The academic project proposes a web-based intelligent learning platform capable of processing multiple learning modalities and providing personalized educational assistance.

The project objectives include multimodal processing, personalized learning, difficulty prediction, adaptive study planning, knowledge tracing, and knowledge graph-based concept visualization.

The proposed architecture uses a modern web stack with a React frontend and FastAPI backend, together with AI technologies such as Large Language Models, OCR, speech recognition, computer vision, and machine learning.

---

# 📖 References

The project proposal identifies the following foundational research works:

1. Devlin, J., Chang, M.-W., Lee, K., & Toutanova, K.
   **BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding.**
   NAACL-HLT, 2019.

2. Radford, A., Kim, J. W., Xu, T., et al.
   **Robust Speech Recognition via Large-Scale Weak Supervision.**
   ICML, 2023.

3. Dosovitskiy, A., Beyer, L., Kolesnikov, A., et al.
   **An Image is Worth 16×16 Words: Transformers for Image Recognition at Scale.**
   ICLR, 2021.

4. Yang, J., Price, B., Cohen, S., Brown, M. S., & Yang, M.-H.
   **Scene Text Recognition with Transformer-Based Models.**
   IEEE Transactions on Pattern Analysis and Machine Intelligence, 2023.

5. Hochreiter, S., & Schmidhuber, J.
   **Long Short-Term Memory.**
   Neural Computation, 1997.

6. Vaswani, A., Shazeer, N., Parmar, N., et al.
   **Attention Is All You Need.**
   NeurIPS, 2017.

---

# 👥 Project Team

### Team Members

* **S. No. 1:** Dasi Nithinnaidu
* **S. No. 2:** Kesari Abhigna
* **S. No. 3:** Syed Naveed Muzammil

### Guide

**Mr. Andraju Bhanu Prasad**
Associate Professor
Department of Computer Science and Engineering
Vardhaman College of Engineering

---

# 📄 Project Status

This repository is under active development.

The current implementation establishes the full-stack foundation with:

* React/Vite frontend
* FastAPI backend
* MySQL 8 database integration
* Authentication architecture
* Student profile architecture
* Modular frontend structure
* Modular backend structure

Multimodal AI processing, personalized learning, knowledge tracing, and advanced educational intelligence are being developed incrementally.

---

## License

This project is developed as an academic project. Licensing and distribution terms may be added as the project progresses.
