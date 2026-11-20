# AI Knowledge Assistant – Reducing Unsupported Responses in Generative AI

[![Vercel Deployment](https://img.shields.io/badge/Deployed-Vercel-black?style=flat&logo=vercel)](https://vercel.com)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB%20Compass-green?style=flat&logo=mongodb)](https://www.mongodb.com/)
[![React](https://img.shields.io/badge/Frontend-React.js-blue?style=flat&logo=react)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js%20%7C%20Express-darkgreen?style=flat&logo=node.js)](https://nodejs.org/)

---

## 📌 Project Overview

**Project Title:** AI Knowledge Assistant – Reducing Unsupported Responses in Generative AI  
**Academic Domain:** Generative AI Reliability, Knowledge Engineering, Natural Language Processing  
**Core Problem:** Standard Generative AI systems predict tokens probabilistically, which causes them to produce *AI Hallucinations* (fluent yet unverified or fabricated facts) when asked queries not grounded in an organization's internal knowledge base.

### The Solution: Tri-Layer Knowledge Grounding Architecture
This project enforces a **Closed-World Assumption (CWA)** to guarantee 100% factual fidelity:
1. **Knowledge Retrieval Layer:** Token extraction and relevance scoring against authoritative institutional documents stored in MongoDB.
2. **Knowledge Graph Layer:** Traverses relational paths to verify ontological coherence between entities and attributes before answering.
3. **Rule-Based Inference Engine:** Evaluates formal deductive logic rules. If premises are missing or confidence is insufficient, it strictly refuses to extrapolate, displaying:
   > *"Sorry, the requested information is not available in our knowledge base. I cannot provide a verified answer."*

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React.js (Vite), HTML5, CSS3 (Modular design system), JavaScript (ES6+) |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB (Local MongoDB Compass & MongoDB Atlas for production) |
| **ODM** | Mongoose (Schema validation, indexing, and relational references) |
| **Graph Visualization** | Interactive SVG/Canvas Ontological Network Visualizer |
| **Version Control** | Git, GitHub |
| **Deployment** | Vercel (Full-Stack Serverless Architecture) |

---

## 🗄️ MongoDB Database Structure

- **Database Name:** `AIKnowledgeAssistant`
- **Compass Connection URI:** `mongodb://127.0.0.1:27017/AIKnowledgeAssistant`

### Collections Created:
1. **`knowledge`**: Authoritative institutional facts, values, entities, attributes, and source references.
2. **`questions`**: Log of all queries submitted, their verification status (`VERIFIED` / `UNSUPPORTED`), and confidence scores.
3. **`answerhistories`**: Complete audit trace containing synthesized answers, retrieved facts, formal reasoning steps, and graph traversal paths.
4. **`knowledgegraphs`**: Graph nodes (entities) and edges (ontological relationships).

---

## 🧪 Validated Core Test Cases

| Question | Verification Status | Expected & Produced Result |
| :--- | :---: | :--- |
| **"What are the college working hours?"** | `VERIFIED` | **9 AM to 4 PM.** *(Source: Institutional Policy Manual 2026, Section 1.3)* |
| **"When does the library close?"** | `VERIFIED` | **5 PM.** *(Source: Campus Library Handbook 2026, Rule 4.2)* |
| **"What is the casual leave allowance?"** | `VERIFIED` | **12 days per year.** *(Source: Human Resource Service Rules 2026, Rule 18)* |
| **"What is the hostel food menu?"** | `UNSUPPORTED` | **"Sorry, the requested information is not available in our knowledge base. I cannot provide a verified answer."** |

---

## 💻 Local Setup & Execution Guide

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB Community Server or MongoDB Compass running locally on `127.0.0.1:27017`

### Step 1: Clone Repository
```bash
git clone https://github.com/kirthikakumar20/AI-Knowledge-Assistant.git
cd AI-Knowledge-Assistant
```

### Step 2: Install Dependencies
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Step 3: Run Backend Server
```bash
cd ../backend
node server.js
# Backend runs at http://localhost:5000 (auto-seeds database if empty)
```

### Step 4: Run React Frontend
```bash
cd ../frontend
npm run dev
# Frontend runs at http://localhost:3000
```

### Step 5: Inspect in MongoDB Compass
1. Open **MongoDB Compass**.
2. Connect to `mongodb://127.0.0.1:27017`.
3. Locate database `AIKnowledgeAssistant`.
4. Inspect collections: `knowledge`, `questions`, `answerhistories`, `knowledgegraphs`.

---

## 🚀 Vercel Production Deployment

The project is structured with a root `vercel.json` and `api/index.js` serverless wrapper for Express.
In the Vercel Project Settings, add the environment variable:
- `MONGODB_URI`: `mongodb+srv://<username>:<password>@cluster0.mongodb.net/AIKnowledgeAssistant?retryWrites=true&w=majority`

---

## 📄 License
Academic College Project – MIT License. Developed for research and educational purposes.
