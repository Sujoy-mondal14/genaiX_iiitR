# 🎓 IIITRanchi Grievance Portal — AI-Powered Campus Problem Solver

> An intelligent campus grievance management system that uses **Google Gemini AI** to automatically classify student complaints and route them to the correct department in real time.

---

## 📺 Demo Video

> Watch the full demo of the portal in action:

[![Demo Video](https://img.shields.io/badge/▶%20Watch%20Demo-YouTube-red?style=for-the-badge&logo=youtube)](https://www.youtube.com/watch?v=YOUR_VIDEO_ID_HERE)

> ⚠️ **Note:** Replace `YOUR_VIDEO_ID_HERE` in the link above with your actual YouTube video ID once the demo is uploaded.

---

## 📌 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Setup Instructions](#setup-instructions)
- [User Guide](#user-guide)
- [Admin Guide](#admin-guide)
- [AI Classification System](#ai-classification-system)
- [API Reference](#api-reference)
- [Project Structure](#project-structure)

---

## Overview

The **IIITRanchi Grievance Portal** is a full-stack AI-integrated web application built for the IIIT Ranchi campus. Students can submit campus issues (infrastructure breakdowns, hygiene problems, food quality concerns, etc.) through a modern web interface. The backend AI agent — powered by **Google Gemini** — automatically classifies the complaint into a defined category, assigns it an appropriate priority level, and routes it to the relevant resolution staff.

---

## Features

| Feature | Description |
|---|---|
| 🤖 **AI Auto-Classification** | Gemini LLM classifies issues into 6 predefined categories with confidence scores |
| 📋 **Issue Submission** | Students submit issues with descriptions and optional image uploads |
| 🔖 **Unique Tracking IDs** | Every submission receives a unique tracking ID for follow-up |
| 📊 **Live Status Tracking** | Students can view the live resolution status of their issues |
| 👷 **Worker Assignment** | Admins assign available maintenance workers to specific issues |
| ⭐ **Review System** | Students rate resolved issues (1–5 stars) with optional feedback |
| 📢 **Animated Notice Board** | Live campus announcements visible to all logged-in users |
| 📈 **Activity Stats** | Homepage displays last-24h activity: cases raised, resolved, and success rate |
| 🔐 **Role-Based Access** | Separate portals for Students and Admins |
| 🖼️ **Image Preview Modal** | Admins can click to expand issue images in a full-screen modal |

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React (Vite), TailwindCSS, React Router DOM, Lucide React |
| **Backend API** | FastAPI, Uvicorn, Python-Multipart |
| **Database** | SQLite + SQLAlchemy ORM |
| **AI / LLM** | Google Generative AI (Gemini) |
| **Auth** | Session-based via `localStorage` |

---

## Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                      Browser (React)                         │
│   Home → Login → Student Dashboard / Admin Control Center   │
└───────────────────────┬──────────────────────────────────────┘
                        │ HTTP REST API (port 8000)
┌───────────────────────▼──────────────────────────────────────┐
│                   FastAPI Backend                            │
│   /login  /issues  /issues/:id/assign  /stats  /workers     │
└──────────────┬────────────────────────┬──────────────────────┘
               │                        │
┌──────────────▼──────────┐   ┌─────────▼──────────────────────┐
│  SQLite Database        │   │  Google Gemini AI Agent        │
│  (SQLAlchemy ORM)       │   │  (Classification + Routing)    │
└─────────────────────────┘   └────────────────────────────────┘
```

---

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** v16.x or higher → [Download](https://nodejs.org/)
- **Python** 3.8 or higher → [Download](https://www.python.org/)
- **A valid Google Gemini API Key** → [Get one here](https://aistudio.google.com/app/apikey)

---

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd "IIIT hackathon"
```

### 2. Backend Setup

```bash
# Step 1: Create a Python virtual environment
python -m venv venv

# Step 2: Activate it
# macOS / Linux:
source venv/bin/activate
# Windows:
venv\Scripts\activate

# Step 3: Install dependencies
pip install -r requirements.txt
```

**Configure Environment Variables:**

Create a `.env` file in the project root with your Google API key:

```env
GOOGLE_API_KEY="your_google_gemini_api_key_here"
```

**Start the Backend Server:**

```bash
cd backend
uvicorn main:app --reload
```

> ✅ The API will be live at `http://127.0.0.1:8000`
> 📖 Interactive API docs available at `http://127.0.0.1:8000/docs`

---

### 3. Frontend Setup

Open a **new terminal window** and run:

```bash
cd frontend

# Install Node dependencies
npm install

# Start the Vite development server
npm run dev
```

> ✅ The app will be live at `http://localhost:5173`

---

## User Guide

This guide is for **students** using the IIITRanchi Grievance Portal.

### Step 1 — Access the Portal

Open your browser and navigate to:

```
http://localhost:5173
```

The home page displays:
- A welcome banner explaining the portal
- Live **activity stats** (cases raised, resolved, and success rate in the last 24 hours)
- The campus **Notice Board** with important announcements

---

### Step 2 — Log In

1. Click the **"Get Started"** button on the home page.
2. On the Login page, enter your credentials:
   - **User ID**: Your college register number (e.g., `2025ug1007`)
   - **Password**: Your account password
3. Click **"Login"**. You will be automatically redirected to your **Student Dashboard**.

> ❗ If you see an "Invalid credentials" error, double-check your User ID and password and try again.

---

### Step 3 — Submit a New Issue

On your dashboard, the **"Submit a New Issue"** form is at the top:

1. **Register Number & Name** are pre-filled — these are read-only.
2. **Issue Category** — Choose from the dropdown:
   - `Bathroom & Hygiene`
   - `Anti-Ragging & Safety`
   - `Mess & Food Quality`
   - `Academic Issues`
   - `Infrastructure/Maintenance`
   - `Other (Specify)` — selecting this reveals a text box to describe your custom category
   - **Leave on default** ("Let AI Decide / Auto-Classify") to let the Gemini AI automatically determine the best category.
3. **Description** — Write a clear, detailed description of the problem. The more detail you provide, the more accurate the AI classification.
4. **Optional Image Upload** — Attach a photo of the issue (e.g., a broken fixture, spoiled food). Supported formats: JPG, PNG, GIF, WEBP.
5. Click **"Submit Issue"**.

> ✅ A success message will appear with your unique **Tracking ID** (e.g., `TRK-2025-00042`). Save this ID to follow up on your issue.

---

### Step 4 — Track Your Issues

Below the submission form is the **"My Issues"** table showing all issues you have ever submitted.

| Column | Description |
|---|---|
| **Tracking ID** | Unique ID for each submission |
| **Type** | The category (AI-classified or manually chosen) |
| **Status** | Current state: `Submitted` → `Assigned` → `Resolved` |
| **Assigned Worker** | Name of the maintenance staff assigned |
| **Timeline** | Date raised and date resolved (if applicable) |
| **Review** | Rate the resolution after the issue is marked Resolved |

**Status Color Codes:**
- 🟡 `Submitted` — Your issue has been logged and is awaiting admin review
- 🔵 `Assigned` — A worker has been assigned and is working on it
- 🟢 `Resolved` — The issue has been resolved

---

### Step 5 — Submit a Review

Once your issue is marked **Resolved**, a **"Rate"** button appears in the Review column.

1. Click **"Rate"** to open the review modal.
2. Select a **Star Rating** (1 = Poor, 5 = Excellent).
3. Optionally add written **Feedback** about your experience.
4. Click **"Submit"** to send your review.

Your rating will be visible to the admin for service quality analysis.

---

### Step 6 — View the Notice Board

The **Notice Board** is displayed on both the home page and the dashboard. It shows campus-wide announcements posted by admins. Scroll through it to stay updated with important notices.

---

### Step 7 — Log Out

Click the **"Logout"** button in the top navigation bar to securely log out of your session.

---

## Admin Guide

This guide is for **administrators and executive staff** managing the grievance portal.

### Accessing the Admin Panel

Log in with admin credentials:
- **User ID**: `admin` (or your assigned admin ID)
- **Password**: Your admin password

Upon login, you will be redirected to the **Admin Control Center** at `/admin`.

---

### Admin Dashboard Overview

The admin panel has the following sections:

#### 1. Notice Board (Admin Mode)

At the top of the admin dashboard is the **Notice Board with admin controls**. In admin mode, you can:

- **Post new announcements** visible to all logged-in students
- **Delete** existing notices

---

#### 2. Pending Issues Tab

This is the primary action area for managing reported issues.

**Table Columns:**

| Column | Description |
|---|---|
| **Tracking ID** | Unique identifier for each issue |
| **Issue & Description** | Category name, truncated description, optional image thumbnail, and submitting student's name |
| **Priority** | AI-assigned priority level — `High` (🔴), `Medium` (🟠), or `Low` (⬜) |
| **Assign Worker** | Dropdown of currently **available** maintenance workers |
| **Actions** | Buttons to Resolve or Delete the issue |

**How to Manage a Pending Issue:**

1. **Review the issue** — Read the description and click on the image thumbnail (if any) to open the full-screen image preview modal.
2. **Assign a Worker** — Select an available worker from the "Assign Worker" dropdown. The worker's status automatically changes to "Unavailable" so they won't be double-assigned.
3. **Resolve the Issue** — Once the problem is fixed, click the green **"Resolve"** button. The issue moves to the Resolved tab.
4. **Delete** — If an issue is spam, duplicate, or irrelevant, click the red **"Delete"** button to remove it permanently.

> 🔴 **Real-time alert:** A pulsing red dot appears on the "Pending Issues" tab title whenever there are newly submitted (unassigned) issues requiring immediate attention.

---

#### 3. Resolved & Reviews Tab

Click the **"Resolved & Reviews"** tab to view all closed issues.

**Table Columns:**

| Column | Description |
|---|---|
| **Tracking ID** | Unique identifier |
| **Issue Details** | Category, description snippet, and the student who submitted it |
| **Timestamps** | Date the issue was resolved |
| **Student Review** | Star rating (★/5) and written comment left by the student |

Use this tab to:
- Audit resolved cases and their timelines
- Monitor student satisfaction scores and feedback
- Identify recurring problem areas by reviewing categories of resolved issues

---

### Managing Workers

Workers are the maintenance staff assigned to fix issues. Admins can manage workers via the `/admin/workers` page (accessible from the admin navigation).

**Worker Management Features:**
- View all registered workers and their current **availability status**
- Add new workers with their name and profession/specialization
- Remove workers who are no longer on staff

**Worker Assignment Rules:**
- Only workers with `available = true` status appear in the assignment dropdown
- Once assigned to an issue, a worker's status is set to `Unavailable`
- Workers become available again once the issue they were assigned to is resolved

---

### Managing Users

Navigate to `/admin/users` (accessible from the admin navigation) to manage registered student accounts.

**User Management Features:**
- View all registered student accounts
- See user details including their register numbers
- Remove user accounts if necessary

---

### Admin — Workflow Summary

```
New Issue Submitted (Status: "Submitted")
            │
            ▼
Admin Reviews Issue in Pending Tab
            │
            ▼
Admin Assigns a Worker (Status → "Assigned")
            │
Worker resolves the real-world problem
            │
            ▼
Admin clicks "Resolve" (Status → "Resolved")
            │
            ▼
Student Rates the Resolution (Optional)
            │
            ▼
Visible in "Resolved & Reviews" Tab
```

---

### Priority Levels Explained

The AI agent assigns one of three priority levels to each issue:

| Priority | Color | Meaning |
|---|---|---|
| **High** | 🔴 Red | Urgent — safety hazards, anti-ragging, blocked facilities |
| **Medium** | 🟠 Orange | Important — food issues, broken equipment, hygiene concerns |
| **Low** | ⬜ Gray | Non-urgent — minor academic requests, general feedback |

Admins should always address **High** priority issues first.

---

### Admin Quick Reference

| Task | How |
|---|---|
| Post an announcement | Use the Notice Board form at the top of the admin dashboard |
| Assign a worker | Use the dropdown in the "Assign Worker" column on the Pending tab |
| Resolve an issue | Click the green "Resolve" button in the Actions column |
| Delete an issue | Click the red "Delete" button in the Actions column |
| View resolved history | Switch to the "Resolved & Reviews" tab |
| Manage workers | Navigate to `/admin/workers` |
| Manage users | Navigate to `/admin/users` |

---

## AI Classification System

The AI agent uses **Google Gemini** to analyze the text description of each submitted issue and classify it into one of the 6 predefined categories:

| Category | Examples |
|---|---|
| `Bathroom & Hygiene` | Broken toilets, unclean washrooms, water leakage |
| `Anti-Ragging & Safety` | Harassment incidents, unsafe corridors, security concerns |
| `Mess & Food Quality` | Stale food, unhygienic kitchen, poor serving quality |
| `Academic Issues` | Missing faculty, lab equipment issues, timetable conflicts |
| `Infrastructure/Maintenance` | Broken lights, faulty fans, damaged furniture, WiFi issues |
| `Other` | Any issue not fitting a specific category above |

**Outputs from the AI Agent:**
- ✅ **Category** — The predicted category label
- 📊 **Confidence Score** — How certain the model is (0.0 to 1.0)
- 🚨 **Priority** — `High`, `Medium`, or `Low` (auto-determined by category/keywords)
- ⚠️ **Fallback** — If confidence is below threshold, the issue is flagged for **manual admin review**

> **Target Accuracy:** ≥ 75% as per hackathon requirements

---

## API Reference

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/login` | Authenticate a user (student or admin) |
| `GET` | `/stats` | Get last-24h activity statistics |
| `POST` | `/issues` | Submit a new issue |
| `GET` | `/issues/my/{user_id}` | Get all issues for a specific student |
| `GET` | `/issues/pending` | Get all unresolved issues (admin only) |
| `GET` | `/issues/resolved` | Get all resolved issues (admin only) |
| `POST` | `/issues/{id}/assign` | Assign a worker to an issue |
| `POST` | `/issues/{id}/status` | Update the status of an issue |
| `POST` | `/issues/{id}/review` | Submit a student review for a resolved issue |
| `GET` | `/workers/available` | List all currently available workers |
| `GET` | `/notices` | Fetch all notice board announcements |
| `POST` | `/notices` | Post a new notice (admin only) |
| `DELETE` | `/notices/{id}` | Delete a notice (admin only) |

> 📖 Full interactive docs: `http://127.0.0.1:8000/docs` (Swagger UI)

---

## Project Structure

```
IIIT hackathon/
├── backend/
│   ├── main.py              # FastAPI app — all routes and DB logic
│   ├── agent.py             # Google Gemini AI classification agent
│   └── routers/             # Modular route handlers
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.jsx           # Landing page with stats & notice board
│   │   │   ├── Login.jsx          # Authentication page
│   │   │   ├── Dashboard.jsx      # Student issue submission & tracking
│   │   │   ├── AdminDashboard.jsx # Admin control center
│   │   │   ├── AdminUsers.jsx     # User management (admin)
│   │   │   └── AdminWorkers.jsx   # Worker management (admin)
│   │   ├── components/
│   │   │   ├── Navbar.jsx         # Top navigation bar
│   │   │   └── NoticeBoard.jsx    # Animated announcements component
│   │   ├── App.jsx                # Routes and layout
│   │   └── index.css              # Global styles
│   ├── index.html
│   ├── vite.config.js
│   └── tailwind.config.js
├── database/                # Database initialization scripts
├── database.db              # SQLite database file
├── requirements.txt         # Python dependencies
├── .env                     # Environment variables (not committed)
├── .gitignore
└── README.md
```

---

## AI Agent Classification Accuracy

The classification agent leverages the Gemini LLM for contextual NLP text analysis. It targets **≥ 75% accuracy** across the 6 categories.

- **High-confidence predictions** (score ≥ 0.75): Automatically classified and routed.
- **Low-confidence predictions** (score < 0.75): Flagged for manual admin review to ensure no issue is misclassified.

---

## Contributing

This project was built for the **IIIT Ranchi Hackathon**. Team size: 1–3 members.

---

*Built with ❤️ for IIIT Ranchi*
