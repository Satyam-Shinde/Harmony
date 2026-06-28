# Harmony: AI Study Planner

An AI-powered study planner that helps students organize their learning with intelligent scheduling, automatic note summarization, and AI-generated quizzes.

This project is built using a modern three-tier architecture:

- React + TypeScript frontend
- Node.js + Express backend
- Python FastAPI AI microservice

---

# Features

## Authentication

- User Registration
- User Login
- JWT Authentication
- Forgot Password
- Reset Password
- Protected Routes

---

## Dashboard

- Personalized Dashboard
- Study Statistics
- Quick Navigation
- User Progress

---

## AI Notes Summarizer

Upload study material and generate concise summaries.

Supported document types include:

- PDF
- DOCX
- Text

Features:

- AI-powered summarization
- Save summaries
- View summary history

---

## AI Quiz Generator

Generate quizzes automatically from study material.

Features

- AI-generated questions
- Multiple Choice Questions
- Quiz Attempts
- Score Tracking

---

## AI Study Scheduler

Automatically creates a personalized study timetable based on:

- Subjects
- Available study hours
- Learning priorities

---

## Subject Management

- Add Subjects
- Update Subjects
- Delete Subjects
- Track Study Progress

---

## User Profile

- View Profile
- Update User Information
- Manage Account

---

# Project Architecture

```
Frontend (React + Vite)
            │
            ▼
Node.js Express REST API
            │
            ├──────── MongoDB
            │
            ▼
Python FastAPI AI Service
            │
            ├── Summarization
            ├── Quiz Generation
            └── Smart Scheduler
```

---

# Technology Stack

## Frontend

- React 19
- TypeScript
- Vite
- React Router
- Tailwind CSS
- Lucide Icons

---

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Joi Validation
- Multer
- Axios
- Bcrypt

---

## AI Service

- FastAPI
- Transformers
- PyTorch
- PyPDF2
- python-docx
- Uvicorn

---

# Folder Structure

```
Project
│
├── Frontend
│   ├── src
│   ├── components
│   ├── pages
│   ├── layout
│   └── public
│
├── Backend
│   ├── Controllers
│   ├── Models
│   ├── Routes
│   ├── Middleware
│   └── uploads
│
└── Python
    ├── app
    │   ├── routes
    │   ├── services
    │   ├── db
    │   ├── models
    │   └── utils
```

---

# Installation

## 1. Clone Repository

```bash
git clone https://github.com/Satyam-Shinde/Harmony.git

cd Harmony
```

---

## 2. Install Frontend

```bash
cd Frontend

npm install

npm run dev
```

Runs on:

```
http://localhost:5173
```

---

## 3. Install Backend

```bash
cd Backend

npm install

npm start
```

Runs on:

```
http://localhost:8080
```

---

## 4. Install Python AI Service

Create a virtual environment

Windows

```bash
python -m venv venv

venv\Scripts\activate
```

Linux/macOS

```bash
python3 -m venv venv

source venv/bin/activate
```

Install dependencies

```bash
pip install -r requirements.txt
```

Run the server

```bash
python main.py
```

Runs on

```
http://localhost:8000
```

---

# Environment Variables

Backend `.env`

```
PORT=8080

MONGO_URI=your_mongodb_connection

JWT_SECRET=your_secret_key

EMAIL_USER=your_email

EMAIL_PASS=your_password
```

---

# API Modules

## Authentication

- Register
- Login
- Forgot Password
- Reset Password

---

## User

- Get Profile
- Update Profile

---

## Summarizer

- Upload Notes
- Generate Summary
- Save Summary
- View History

---

## Quiz

- Generate Quiz
- Submit Quiz
- View Attempts

---

## Scheduler

- Generate Schedule
- Save Schedule
- Retrieve Schedule

---

# Database

MongoDB collections include:

- Users
- Subjects
- Schedules
- Quizzes
- Quiz Attempts
- Summaries

---

# Future Improvements

- AI Chat Assistant
- Calendar Integration
- Pomodoro Timer
- Notifications
- Analytics Dashboard
- Mobile Application
- Cloud File Storage
- OCR Support
- Voice Notes
- Dark Mode

---

# Contributors

Final Year Engineering Project

Developed as an AI-powered learning platform to improve study planning, revision, and productivity using modern web technologies and machine learning.

---

# License

This project is developed for educational purposes.
