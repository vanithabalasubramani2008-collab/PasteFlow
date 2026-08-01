# 🚀 PasteFlow - Premium Developer Workspace

![PasteFlow Banner](https://via.placeholder.com/1200x300/1A1A1A/10B981?text=PasteFlow+-+Modern+Developer+Workspace)

**PasteFlow** is a premium, cloud-native code snippet management tool designed for developers. Drawing inspiration from modern IDEs and terminal applications, PasteFlow provides a powerful, keyboard-first Neobrutalism experience (Deep Graphite, Emerald, Amber, and Violet) to manage, protect, and share your code.

---

## ✨ Features

### Code Editor & UI
- **Monaco Editor Integration**: Syntax highlighting, auto-indentation, line numbers.
- **Premium Neobrutalism Theme**: Stark contrasts, dark mode, floating editor panels.
- **Command Palette (`Cmd/Ctrl + K`)**: Instantly navigate between pages.
- **Markdown Preview**: Readme style rendering.

### Paste Management
- **Visibility Controls**: Public, Unlisted, Private.
- **Password Protection**: Secure individual pastes with passwords.
- **Auto-Expiration**: Self-destructing pastes.
- **Tags & Search**: Filter and explore public pastes.

### Actions
- 📋 1-Click Copy
- ⬇️ Download as `.txt`
- 📱 Generate QR Code for Mobile Sharing

---

## 🏗️ Architecture

```mermaid
graph TD
    Client[Web Browser - React/Vite]
    Proxy[Nginx - Reverse Proxy]
    API[FastAPI Backend - Python]
    DB[(PostgreSQL Database)]

    Client -->|HTTP/HTTPS| Proxy
    Proxy -->|/api/*| API
    Proxy -->|/*| Client
    API -->|SQLAlchemy ORM| DB
```

### 📂 Folder Structure

```mermaid
graph TD
    Root[PasteFlow Root]
    Root --> Backend[backend/]
    Root --> Frontend[frontend/]
    Root --> Nginx[nginx/]
    Root --> Docker[docker-compose.yml]

    Backend --> Core[app/core/]
    Backend --> Models[app/models/]
    Backend --> API[app/api/]
    Backend --> Services[app/services/]
    
    Frontend --> Pages[src/pages/]
    Frontend --> Comps[src/components/]
```

### 🗄️ Database ER Diagram

```mermaid
erDiagram
    USERS ||--o{ PASTES : creates
    USERS {
        int id PK
        string email
        string hashed_password
        boolean is_active
    }
    PASTES {
        int id PK
        string title
        text content
        string language
        string visibility
        string password_hash
        datetime expires_at
        int views
        int owner_id FK
    }
```

---

## 🚀 Quick Start (Docker)

The fastest way to run PasteFlow is via Docker.

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/pasteflow.git
cd pasteflow

# 2. Build and start the containers
docker compose up --build -d

# 3. Access the application
# Frontend: http://localhost:3000
# Backend API Docs (Swagger): http://localhost:8000/docs
```

## 💻 Local Development

### 1. Backend (FastAPI)
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
alembic upgrade head
uvicorn app.main:app --reload --port 8000
```

### 2. Frontend (React/Vite)
```bash
cd frontend
npm install
npm run dev
```

---

## 🔐 Environment Variables

Create a `.env` file in the root directory:

```env
# Database
POSTGRES_USER=pasteflow_user
POSTGRES_PASSWORD=pasteflow_pass
POSTGRES_DB=pasteflow_db
DATABASE_URL=postgresql://pasteflow_user:pasteflow_pass@postgres:5432/pasteflow_db

# Security
JWT_SECRET=super_secret_jwt_key
JWT_REFRESH_SECRET=super_secret_refresh_key
CORS_ORIGIN=http://localhost:3000

# Ports
API_PORT=8000
FRONTEND_PORT=3000
```

---

## 🚢 Deployment Guide

### Vercel (Frontend)
1. Import the repository into Vercel.
2. Set the Framework Preset to `Vite`.
3. Set the Build Command to `npm run build` and Output Directory to `dist`.

### Render / Railway (Backend)
1. Connect your repository.
2. Select the `backend` folder as the Root Directory.
3. Use `uvicorn app.main:app --host 0.0.0.0 --port $PORT` as the Start Command.
4. Add the `DATABASE_URL` connecting to a hosted PostgreSQL instance (e.g., Neon or Supabase).

---

## 🧪 Testing

The backend is fully tested using `pytest`.
```bash
cd backend
python -m pytest tests/
```

## 📜 License
MIT License.
