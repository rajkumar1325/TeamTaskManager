# 🗂️ Team Task Manager

> **A full-stack project management app** — create projects, assign tasks, track progress with role-based access control.

![Banner](https://placehold.co/1200x400/1A56A0/ffffff?text=Team+Task+Manager&font=montserrat)

&nbsp;

[![🚀 Live Demo](https://img.shields.io/badge/🚀_Live_App-Visit_Now-black?style=for-the-badge)](https://team-task-manager-alpha-gules.vercel.app)
[![⚙️ Backend](https://img.shields.io/badge/⚙️_Backend-Railway-7B2FBE?style=for-the-badge)](https://teamtaskmanager-production-6260.up.railway.app/health)
[![📁 GitHub](https://img.shields.io/badge/📁_Source-GitHub-181717?style=for-the-badge&logo=github)](https://github.com/rajkumar1325/TeamTaskManager)

&nbsp;

---

## 🧩 What is this?

**Team Task Manager** is a full-stack project management tool built for small teams. It lets admins create projects, invite members by email, assign tasks, and track progress — all in one place.

Think of it as a lightweight **Jira / Trello** — built from scratch with a real PostgreSQL database, JWT authentication, and role-based permissions enforced on both frontend and backend.

---

## ❓ Problem it Solves

> Managing tasks across a team via WhatsApp or spreadsheets is chaotic.

This app gives teams:

- 📌 A **single source of truth** for all project tasks
- 👤 **Clear ownership** — every task has an assignee
- 🔐 **Role control** — only admins can create projects and assign tasks
- 🚨 **Deadline visibility** — overdue tasks are highlighted automatically

---

## ✨ Features

### 🔐 Authentication
- Secure signup & login with **JWT tokens**
- Passwords hashed with **bcrypt**
- Protected routes — no access without login

### 📁 Project Management
- Admins can **create projects**
- Add or remove team members **by email**
- Each project has its own member list and task board

### ✅ Task Management
- Create tasks with title, description, assignee & due date
- Three statuses: `Todo` → `In Progress` → `Done ✓`
- Members can only update **their own tasks**
- Admins can update **any task**

### 🚨 Dashboard
- See **all your assigned tasks** across every project
- **Overdue tasks highlighted** in red automatically
- Quick status updates directly from the dashboard

### 🛡️ Role-Based Access Control (RBAC)

| Action | 👑 Admin | 👤 Member |
|--------|----------|-----------|
| Create project | ✅ | ❌ |
| Add/remove members | ✅ | ❌ |
| Create & assign tasks | ✅ | ❌ |
| Update own tasks | ✅ | ✅ |
| Update any task | ✅ | ❌ |
| View dashboard | ✅ | ✅ |

---

## 🛠️ Tech Stack

### 🎨 Frontend
![React](https://img.shields.io/badge/React_19-61DAFB?style=flat-square&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite_8-646CFF?style=flat-square&logo=vite&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router_7-CA4245?style=flat-square&logo=reactrouter&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=flat-square)

### ⚙️ Backend
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=flat-square&logo=jsonwebtokens&logoColor=white)
![bcrypt](https://img.shields.io/badge/bcrypt-orange?style=flat-square)

### ☁️ Deployment
![Vercel](https://img.shields.io/badge/Vercel-Frontend-000000?style=flat-square&logo=vercel)
![Railway](https://img.shields.io/badge/Railway-Backend_+_DB-7B2FBE?style=flat-square)

---

## 🗄️ Database Schema

```
👤 users
 └── 📁 projects        (owner_id → users.id)
      └── 👥 project_members  (many-to-many: users ↔ projects)
      └── ✅ tasks            (assignee_id → users.id)
```

> 💡 `ON DELETE CASCADE` — delete a project → its tasks & memberships auto-delete

---

## 🚀 Getting Started (Local Setup)

### Prerequisites
- Node.js 18+
- PostgreSQL (or Railway account)

### 1️⃣ Clone the repo
```bash
git clone https://github.com/rajkumar1325/TeamTaskManager.git
cd TeamTaskManager
```

### 2️⃣ Setup Backend
```bash
cd backend
npm install
```

Create `.env`:
```env
DATABASE_URL=postgresql://your_db_url
JWT_SECRET=your_secret_key
PORT=5000
NODE_ENV=development
```

Run schema in your PostgreSQL console:
```bash
# Paste contents of backend/src/config/schema.sql
```

Start server:
```bash
npm run dev
```

### 3️⃣ Setup Frontend
```bash
cd frontend
npm install
```

Create `.env`:
```env
VITE_API_URL=http://localhost:5000
```

Start app:
```bash
npm run dev
```

🎉 App runs at `http://localhost:5173`

---

## 📁 Project Structure

```
TeamTaskManager/
├── 📂 backend/
│   └── src/
│       ├── ⚙️ config/
│       │   ├── db.js          # PostgreSQL connection pool
│       │   └── schema.sql     # All 4 tables with foreign keys
│       ├── 🔒 middleware/
│       │   ├── auth.js        # JWT verification
│       │   └── rbac.js        # Role-based access control
│       └── 🛣️ routes/
│           ├── auth.js        # POST /signup, POST /login
│           ├── projects.js    # CRUD for projects
│           ├── members.js     # Add/remove members + find-user
│           └── tasks.js       # CRUD + status updates
└── 📂 frontend/
    └── src/
        ├── 📄 pages/
        │   ├── Dashboard.jsx      # All tasks overview
        │   ├── ProjectDetail.jsx  # Tasks + members per project
        │   ├── Login.jsx
        │   └── Signup.jsx
        ├── 🔁 context/
        │   └── AuthContext.jsx    # Global auth state
        └── 🌐 api/
            └── axios.js           # Axios instance with JWT interceptor
```

---

## 🌐 Live Deployment

| Service | Platform | URL |
|---------|----------|-----|
| 🎨 Frontend | Vercel | [team-task-manager-alpha-gules.vercel.app](https://team-task-manager-alpha-gules.vercel.app) |
| ⚙️ Backend | Railway | [teamtaskmanager-production-6260.up.railway.app](https://teamtaskmanager-production-6260.up.railway.app) |
| 🗄️ Database | Railway PostgreSQL | Hosted on Railway |

---

## 👨‍💻 Author

**Raj Kumar**

[![GitHub](https://img.shields.io/badge/GitHub-rajkumar1325-181717?style=flat-square&logo=github)](https://github.com/rajkumar1325)

---

## 📄 License

© 2026 Raj Kumar. All Rights Reserved.

This project and its source code may not be copied, modified, distributed, or used for commercial purposes without explicit written permission from the author.
