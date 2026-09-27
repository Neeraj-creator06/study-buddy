# AI StudyBuddy — AI-Powered Learning Assistance Platform

> **Study Smarter. Learn Faster. Achieve More.**  
> An intelligent, full-stack educational companion that transforms unstructured study materials (PDF, DOCX, TXT) into high-yield summaries, 3D interactive flashcards, self-grading diagnostic quizzes, and personalized exam roadmaps using **Google Gemini AI**.

---

## 🎨 Visual Identity & Color Palette

Built to match modern, AI-inspired design principles with the following exact brand palette:

| Color Name | HEX Code | Preview / Role |
|---|---|---|
| **Prussian Blue** | `#031130` | Deep midnight ambient base and dark surface styling |
| **SalesPort Blue** | `#185DF1` | Electric primary accent, glowing buttons, spotlight effects |
| **Alice Blue** | `#F3F7FE` | Crisp white/off-white typography, borders & luminous highlights |
| **Deep Dark Background** | `#000000` / `#020614` | Ultra-rich contrast backdrop |

### 🖱️ Interactive Mouse-Drag Color Shift Effect
The application features a real-time **drag-reactive mesh aura** and an interactive **Dynamic Color Mesh Canvas** (`BrandAuraDragCard`):
* Dragging or moving the mouse across the page dynamically shifts radial gradient focal points and interpolates hues between Prussian Blue (`#031130`), SalesPort Blue (`#185DF1`), and luminous Alice Blue (`#F3F7FE`).
* When dragging, velocity and pressure modulate the glow intensity, providing an ultra-tactile and futuristic interface.

---

## 🚀 Key Platform Features

1. **Document Text Extraction Pipeline:**
   * Automated text extraction for **PDF** (`pdf-parse`), **DOCX** (`mammoth`), and **TXT** files up to 25 MB with intelligent document chunking.
2. **AI Study Summarizer:**
   * Generates structured executive overviews, key concept breakdowns, definitions, analogies, and high-yield exam takeaways with markdown export and copy support.
3. **3D Interactive Smart Flashcards:**
   * Spaced repetition flashcard deck featuring fluid 3D card flips (Space/Click), keyboard arrows navigation, shuffle, and mastery tracking with celebratory confetti.
4. **AI Self-Grading Quiz Engine:**
   * Configurable question count (5, 10, 15, 20), difficulty (Easy, Medium, Hard), and style (Multiple Choice / True-False). Anti-cheat design strips answers until server submission, returning detailed score analytics and explanations.
5. **Personalized Study Roadmaps:**
   * Schedules day-by-day milestone roadmaps calibrated to your target exam deadline, daily available hours, and knowledge level with interactive checklists.
6. **Grounded "Ask AI" Document Tutor:**
   * Multi-turn conversational tutor strictly anchored to your uploaded notes, citing document sections and eliminating hallucinations.
7. **Concept Explainer & Analogy Engine:**
   * Breaks down challenging topics with beginner-friendly real-world analogies, technical mechanics, and common misconception callouts.
8. **High-Yield Exam Questions:**
   * Predicts 2-mark short questions, 5-mark descriptive questions, and applied scenario problems.
9. **Progress Analytics & Gamification:**
   * Visual learning trends with **Recharts**, tracking study streaks, quiz score averages, and completed milestones.
10. **Role-Based Access Control (RBAC) & Admin Control Center:**
    * Student and Administrator roles protected by JWT middleware. Admins can view platform metrics, manage user roles, toggle accounts, and moderate content.

---

## 🛠️ Technology Stack

* **Frontend:** React 18, Vite, Tailwind CSS, React Router v6, Axios, Recharts, Lucide Icons, Canvas Confetti.
* **Backend:** Node.js, Express.js, JWT, bcryptjs, Multer, Helmet, CORS, Morgan.
* **Text Extraction:** `pdf-parse`, `mammoth`, native streams.
* **Database:** MongoDB & Mongoose (supports MongoDB Atlas, local MongoDB, or instant in-memory evaluation).
* **AI Engine:** Official Google GenAI SDK (`@google/generative-ai`) targeting Gemini models.

---

## 📂 Project Architecture

```plaintext
study buddy/
├── client/                      # React 18 + Vite + Tailwind Frontend
│   ├── src/
│   │   ├── components/          # Reusable UI widgets & drag-aura card
│   │   ├── context/             # AuthContext (JWT) & ThemeContext
│   │   ├── layouts/             # AppLayout (Sidebar + Navbar + Aura Background)
│   │   ├── pages/               # Landing, Dashboard, Materials, Summaries,
│   │   │                        # Flashcards, Quiz, StudyPlan, AskAI, Explainer, Admin
│   │   ├── services/            # Centralized Axios API clients
│   │   ├── App.jsx              # Declarative router & ProtectedRoute wrappers
│   │   ├── main.jsx
│   │   └── index.css            # Prussian/SalesPort Tailwind glassmorphism
│   ├── tailwind.config.js       # Custom palette definitions
│   └── package.json
│
├── server/                      # Express REST API Backend
│   ├── config/                  # MongoDB resilient connection & Multer
│   ├── controllers/             # Auth, Material, AI, Quiz, StudyPlan, Admin
│   ├── middleware/              # Auth JWT, RBAC, Error, and Upload filters
│   ├── models/                  # Mongoose models (User, Material, Quiz, etc.)
│   ├── routes/                  # Express API routers
│   ├── services/
│   │   ├── geminiService.js     # Gemini prompts, schema validation & fallbacks
│   │   └── textExtractor.js    # PDF, DOCX, TXT parsers & chunkers
│   ├── uploads/                 # Local directory for uploaded study materials
│   ├── seed.js                  # 1-click sample data populator
│   └── server.js                # Server entrypoint
├── .gitignore
└── README.md
```

---

## ⚡ Quick Start Guide

### Prerequisites
* **Node.js** (v18 or higher)
* **npm** (comes with Node.js)

### 1. Backend Setup
```bash
cd server
npm install
```

Configure your environment in `server/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ai_studybuddy
JWT_SECRET=ai_studybuddy_jwt_secret_dev_key_2026_secure
GEMINI_API_KEY=your_gemini_api_key_here
CLIENT_URL=http://localhost:5173
```
> **Note:** If local MongoDB is not running, the server automatically boots an in-memory database so you can evaluate the platform immediately with zero setup!

Seed realistic demo data (materials, flashcards, quiz, study plan):
```bash
node seed.js
```

Start the server:
```bash
npm run dev
# or
node server.js
```
*Backend runs at: `http://localhost:5000`*

---

### 2. Frontend Setup
Open a second terminal:
```bash
cd client
npm install
npm run dev
```
*Frontend runs at: `http://localhost:5173`*

---

## 🔑 Pre-Configured Demo Accounts

For fast evaluation and grading, click the **1-Click Demo Buttons** on the Login Page, or use:

| Role | Email | Password |
|---|---|---|
| **Student** | `student@studybuddy.com` | `password123` |
| **Admin** | `admin@studybuddy.com` | `password123` |

---

## 🌐 REST API Endpoints

### Authentication
* `POST /api/auth/register` — Register new student or admin
* `POST /api/auth/login` — Sign in and receive JWT token
* `GET /api/auth/me` — Inspect active user profile (Protected)
* `PUT /api/auth/profile` — Update goals, preferences, or password (Protected)

### Study Materials
* `POST /api/materials` — Upload PDF/DOCX/TXT and extract text (Protected)
* `GET /api/materials` — List uploaded materials (Protected)
* `GET /api/materials/:id` — View single material and extracted text (Protected)
* `DELETE /api/materials/:id` — Delete material and cascade related items (Protected)

### Gemini AI Services
* `POST /api/ai/summary` — Generate structured study summary (Protected)
* `POST /api/ai/flashcards` — Generate spaced repetition flashcards (Protected)
* `POST /api/ai/quiz` — Generate diagnostic assessment quiz (Protected)
* `POST /api/ai/study-plan` — Generate personalized study roadmap (Protected)
* `POST /api/ai/ask` — Grounded Q&A against study material (Protected)
* `POST /api/ai/important-questions` — Predict 2-mark & 5-mark questions (Protected)
* `POST /api/ai/explain` — Concept explainer with beginner mode (Protected)

### Quizzes & Progress
* `GET /api/quizzes` — Get user quizzes (Protected)
* `POST /api/quizzes/:id/submit` — Submit answers for grading (Protected)
* `GET /api/progress` — Fetch aggregated learning metrics & streak (Protected)
* `GET /api/study-plans` — Fetch active study roadmaps (Protected)
* `PUT /api/study-plans/:planId/tasks/:taskId` — Toggle task milestone completion (Protected)

### Administration (RBAC)
* `GET /api/admin/stats` — System-wide analytics (Admin only)
* `GET /api/admin/users` — Search and paginate user directory (Admin only)
* `PUT /api/admin/users/:id/role` — Update user role (Admin only)
* `PUT /api/admin/users/:id/status` — Disable or activate account (Admin only)
* `DELETE /api/admin/users/:id` — Delete user (Admin only)

---

## 🛡️ Security Best Practices
* **Zero Client API Key Exposure:** Gemini API keys are strictly kept on the Node.js backend.
* **BCrypt Hashing:** Passwords salted and hashed with 10 rounds before persistence.
* **Cheating Prevention:** Correct quiz answers are stripped on the server and only evaluated upon submission.
* **Document Grounding:** Gemini prompts are calibrated to cite and rely on uploaded text to reduce hallucinations.

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
