# 🗂️ Team Task Manager

> A full-stack web app for teams to manage projects, assign tasks, and track progress — with role-based access control.

![Banner](https://placehold.co/1200x400/1A56A0/ffffff?text=Team+Task+Manager&font=montserrat)

&nbsp;

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-Vercel-black?style=for-the-badge)](https://your-app.vercel.app)
[![Backend](https://img.shields.io/badge/⚙️_Backend-Railway-purple?style=for-the-badge)](https://your-backend.railway.app/health)
[![GitHub](https://img.shields.io/badge/📁_Repo-GitHub-181717?style=for-the-badge&logo=github)](https://github.com/rajkumar1325/Projects)

&nbsp;

---

## 🧩 What is this?

**Team Task Manager** is a full-stack project management tool built for small teams. It lets admins create projects, invite members, assign tasks, and track progress — all in one place.

Think of it as a lightweight **Jira / Trello** — built from scratch with a real database, authentication, and role-based permissions.

---

## ❓ Problem it Solves

Managing tasks across a team via WhatsApp or spreadsheets is chaotic. This app gives teams:

- A **single source of truth** for all project tasks
- **Clear ownership** — every task has an assignee
- **Role control** — only admins can create projects and assign tasks
- **Deadline visibility** — overdue tasks are highlighted automatically

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
- Three statuses: `Todo` → `In Progress` → `Done`
- Members can only update **their own tasks**
- Admins can update **any task**

### 🚨 Dashboard
- See **all your assigned tasks** across every project
- **Overdue tasks highlighted** in red automatically
- Quick status updates from the dashboard

### 🛡️ Role-Based Access Control
| Action | Admin | Member |
|--------|-------|--------|
| Create project | ✅ | ❌ |
| Add/remove members | ✅ | ❌ |
| Create tasks | ✅ | ❌ |
| Update own tasks | ✅ | ✅ |
| Update any task | ✅ | ❌ |
| View dashboard | ✅ | ✅ |

---

## 🛠️ Tech Stack

### Frontend
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite)
![React Router](https://img.shields.io/badge/React_Router-7-CA4245?style=flat-square&logo=reactrouter)
![Axios](https://img.shields.io/badge/Axios-1.x-5A29E4?style=flat-square)

### Backend
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=node.js)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Railway-4169E1?style=flat-square&logo=postgresql)
![JWT](https://img.shields.io/badge/JWT-Auth-000000?style=flat-square&logo=jsonwebtokens)
![bcrypt](https://img.shields.io/badge/bcrypt-Password_Hashing-orange?style=flat-square)

---

## 🗄️ Database Schema

```
users
 └── projects (owner_id → users.id)
      └── project_members (many-to-many: users ↔ projects)
      └── tasks (assignee_id → users.id)
```

- `ON DELETE CASCADE` — delete a project → tasks & memberships auto-delete
- Foreign keys enforced at DB level (not just app level)

---

## 🚀 Getting Started (Local)

### Prerequisites
- Node.js 18+
- PostgreSQL (or Railway account)

### 1. Clone the repo
```bash
git clone https://github.com/rajkumar1325/Projects.git
cd Projects/TeamTaskManager
```

### 2. Setup Backend
```bash
cd backend
npm install
```

Create `.env`:
```env
DATABASE_URL=postgresql://your_db_url
JWT_SECRET=your_secret_key
PORT=5000
```

Run schema:
```bash
# Paste contents of src/config/schema.sql into your PostgreSQL console
```

Start server:
```bash
npm run dev
```

### 3. Setup Frontend
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

App runs at `http://localhost:5173` 🎉

---

## 📁 Project Structure

```
TeamTaskManager/
├── backend/
│   └── src/
│       ├── config/
│       │   ├── db.js          # PostgreSQL connection
│       │   └── schema.sql     # All 4 tables
│       ├── middleware/
│       │   ├── auth.js        # JWT verification
│       │   └── rbac.js        # Role-based access
│       └── routes/
│           ├── auth.js        # Signup / Login
│           ├── projects.js    # Project CRUD
│           ├── members.js     # Add / Remove members
│           └── tasks.js       # Task CRUD + status
└── frontend/
    └── src/
        ├── pages/
        │   ├── Dashboard.jsx  # All tasks overview
        │   ├── ProjectDetail.jsx  # Tasks + members per project
        │   ├── Login.jsx
        │   └── Signup.jsx
        ├── context/
        │   └── AuthContext.jsx
        └── api/
            └── axios.js
```

---

## 🌐 Deployment

| Service | Platform |
|---------|----------|
| Frontend | [Vercel](https://vercel.com) |
| Backend | [Railway](https://railway.app) |
| Database | Railway PostgreSQL |

---

## 👨‍💻 Author

**Raj Kumar**
[![GitHub](https://img.shields.io/badge/GitHub-rajkumar1325-181717?style=flat-square&logo=github)](https://github.com/rajkumar1325)

---

## 📄 License

MIT — free to use and modify.
