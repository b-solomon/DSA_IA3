# ExamEase — Continuous Assessment IA3
## EdTech Examination Platform & Algorithmic Analysis System
**Department of Computer Science & Engineering | Data Structures & Algorithms Laboratory**

[![React](https://img.shields.io/badge/Frontend-React%2018%20%2B%20TypeScript-blue.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Bundler-Vite%207-646CFF.svg)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Styling-Tailwind%20CSS-38B2AC.svg)](https://tailwindcss.com/)
[![Python](https://img.shields.io/badge/Backend-Python%20Flask%20%2B%20SQLite-yellow.svg)](https://flask.palletsprojects.com/)
[![License](https://img.shields.io/badge/Academic-Micro--Project%20%2315-indigo.svg)]()

---

## 👥 Team Members & Contribution Matrix

| Name | Register Number | Role & Focus Area | Key Data Structure |
| :--- | :--- | :--- | :--- |
| **B Solomon** | `URK25CS1191` | Full Stack Architecture & LIFO Stack Integration | **Stack (LIFO)** |
| **Dasanapu Murari** | `URK25CS1175` | Hash Tables, Collision Resolution & Mathematics | **Hash Table ($O(1)$)** |
| **Kothapalli Spoody Rex** | `URK25CS1162` | Binary Search Engine & Logarithmic Retrieval | **Binary Search ($O(\log n)$)** |
| **V Ganesh Reddy** | `URK25CS1168` | UI/UX Design, Visualizers & Interactive Sims | **Sorting Algorithms** |

---

## 🎯 Course Outcomes (CO) Mapping

This project explicitly demonstrates three fundamental Data Structures & Algorithms concepts implemented across both frontend interfaces and production backend services:

### 1. CO 1: Linear Data Structures — LIFO Navigation Stack
* **Application:** Real-time question history and navigation tracking during live student exams.
* **Mechanism:** 
  * Each question transition pushes the previous state onto an active stack frame: `PUSH(Q_i)`.
  * The **Previous** action executes `POP()`, strictly retrieving the most recently visited question in Last-In-First-Out (LIFO) order.
  * An interactive on-screen stack telemetry inspector displays active frames and operation notices in real time.
* **Complexity:** Time $O(1)$ push/pop | Space $O(n)$ where $n$ is total questions.

### 2. CO 4: Dynamic Hash Tables & Collision Resolution
* **Application:** Student credential lookup and instant examination score indexing by Registration Number.
* **Mechanism:**
  * Maps registration strings to indices via polynomial rolling hash:
    $$h(\text{regNo}) = \left(\sum_{i=0}^{L-1} S[i] \cdot 31^{L-1-i}\right) \bmod m$$
  * Implements both **Open Addressing** (Linear Probing, Quadratic Probing, Double Hashing) and **Separate Chaining** (linked bucket lists).
  * Proves mathematically why table size $m$ must be a prime number: ensures $\gcd(\text{step}, m) = 1$, preventing factor clustering and probe cycling.
* **Complexity:** Average Time $O(1)$ lookup | Worst Time $O(n)$ with heavy collisions.

### 3. CO 3: Logarithmic Searching — Binary Search Engine
* **Application:** Instant merit rank discovery, score cutoff determination, and administrative record searches.
* **Mechanism:**
  * Exam records are pre-sorted by percentage.
  * Binary search inspects the midpoint $\text{mid} = \lfloor(\text{low} + \text{high}) / 2\rfloor$, halving the active search window at each comparison step.
  * Real-time trace table highlights `low`, `mid`, and `high` pointers with exact comparison conditions: $\text{val} < \text{target}$ or $\text{val} > \text{target}$.
* **Complexity:** Time $O(\log n)$ | Space $O(1)$ auxiliary.

---

## 📖 Plain-English Guide to Hashing Mathematical Symbols

During presentations and viva, faculty frequently ask about the mathematical notation used in hash tables. Below is a beginner-friendly explanation of each symbol in simple words:

| Symbol | Term | What It Means in Simple English | Real-World Project Example |
| :---: | :--- | :--- | :--- |
| **$k$** | **Key** | The specific number or data item you want to store or find. | A student registration roll number like `1191` or numeric key `25`. |
| **$m$** | **Table Size** | The total number of storage slots available in the table. | A prime number like `11` slots (indexed `0` through `10`). |
| **$h(k)$** | **Hash Function** | The formula that calculates which slot the key belongs to by taking the remainder. | $h(1191) = 1191 \bmod 11 = 3$. The student's record belongs in Slot #3. |
| **$\alpha$** | **Load Factor** | How full the table is (calculated as $\text{items} / \text{total slots}$). | If 8 students are stored in 11 slots: $\alpha = 8/11 \approx 0.72$ (72% full). As $\alpha$ approaches 1.0, collisions increase. |
| **$i$** | **Probe Counter** | If two keys want the same slot (a collision), $i$ counts which retry jump we are on. | $i=0$ is the initial slot. If occupied, $i=1$ is the first jump, $i=2$ is the second jump, and so on. |
| **$h_2(k)$** | **Secondary Step** | In Double Hashing, a second formula that calculates how many slots to jump over during a collision. | Instead of jumping by 1 slot every time, jump by $h_2(k) = 5$ slots to avoid clustering. |
| **$\gcd$** | **Greatest Common Divisor** | Checks if two numbers share common factors. We want $\gcd(\text{step}, m) = 1$ (coprime). | Because table size $m=11$ is prime, every jump step is coprime to 11, ensuring the probe visits every slot without getting stuck in a loop. |

---

## 🚀 Key Features

- 🖥️ **Full Student Examination Portal:** Timed exams, autosave, answer review flags, LIFO question history stack, and instant grading analytics.
- 🔬 **Interactive DSA Laboratory:** Hands-on step-by-step visualizers for Stacks, Hash Tables, Binary Search, and Sorting (Bubble, Selection, Quick Sort).
- 🧮 **Comprehensive Hashing & Formulas Hub:** In-depth breakdowns, beginner-friendly symbol glossaries (Keys, Table Sizes, Load Factors, and Jump Steps), and live interactive collision simulators.
- 👨‍🏫 **Teacher & Admin Control Center:** Question bank management, exam authoring, performance analytics, and administrative binary search queries.
- 🌙 **Modern Dark Laboratory Design System:** Clean Tailwind typography, glassmorphism cards, and high-contrast accessible inputs.

---

## 🛠️ Tech Stack & Architecture

- **Frontend:** React 18, TypeScript, Vite 7, Tailwind CSS, Lucide Icons, React Router DOM
- **Backend:** Python 3, Flask, SQLite 3, Werkzeug Security
- **Data Structures:** Custom Python & TypeScript implementations of Stacks, Chained Hash Tables, and Binary Search

---

## 💻 Local Setup & Execution Guide

### Prerequisites
- Node.js (v18+)
- Python (v3.8+)

### 1. Launching the Interactive Frontend
```bash
# Navigate to the project root
cd dsa_ia3

# Install dependencies (already prepared if cloned with node_modules)
npm install

# Start the Vite development server
npm run dev
```
Open **[http://localhost:5173](http://localhost:5173)** in your browser.

### 2. Launching the Flask Backend (Optional)
```bash
# Navigate to the Flask updates directory
cd examease_updates

# Install requirements
pip install -r requirements.txt

# Run the Flask app
python app.py
```
Open **[http://127.0.0.1:5000](http://127.0.0.1:5000)** in your browser.  
*Default Admin Credentials:* `ADMIN` / `admin123`

---

## 🧪 Testing & Verification
The backend test suite covers authentication, role authorization, CSRF protection, question CRUD, deadline enforcement, and binary search accuracy:
```bash
python -m unittest discover -s examease_updates/tests -v
```
*Result:* **10/10 tests passed.**

---

## 📄 Repository Structure
```
dsa_ia3/
├── src/
│   ├── components/         # Reusable UI, Project Banner, DSA Inspectors
│   ├── context/            # Authentication & Toast contexts
│   ├── demo/               # Offline evaluation demo datasets
│   ├── pages/              # Landing, Hashing Hub, Login, Register, Get Started
│   │   ├── student/        # TakeExam (Stack), DsaLab, Results, Practice
│   │   └── teacher/        # Teacher Overview, Questions, Students & Attempts
│   ├── index.css           # Global dark theme & typography
│   └── main.tsx            # Application entry point
├── examease_updates/       # Python Flask backend
│   ├── dsa/                # Pure Python Stack, HashTable, Binary Search
│   ├── tests/              # Automated unit and integration tests
│   ├── app.py              # Flask server and API endpoints
│   └── database.py         # SQLite schema & migrations
├── package.json            # Frontend dependencies & scripts
├── vite.config.ts          # Vite bundler configuration & path aliases
└── README.md               # Project documentation
```

---
*Created for Continuous Assessment IA3 — Department of Computer Science & Engineering.*
