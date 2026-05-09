# VELO Realty - Premium Real Estate Ecosystem

VELO Realty is a high-performance, full-stack real estate platform designed for the luxury Hyderabad market. It features a stunning, isometric 3D frontend and a robust FastAPI backend with secure administrative controls and CDN-backed asset management.

## 🚀 Technology Stack

### Frontend
- **Framework**: React 18 + Vite
- **Language**: TypeScript
- **Styling**: Premium Glassmorphic CSS + Framer Motion
- **Animations**: GSAP (ScrollTrigger, Parallax)
- **Icons**: Lucide React
- **Media**: ImageKit.io (Real-time 4K Optimization)

### Backend
- **Framework**: FastAPI (Python 3.9+)
- **Database**: PostgreSQL (SQLAlchemy ORM)
- **Security**: OAuth2 with Password Hashing (Passlib/Bcrypt)
- **Task Management**: HMAC-signed Authentication for ImageKit

---

## 📁 Repository Structure

```text
.
├── velo-realty/              # React Frontend Application
│   ├── src/
│   │   ├── components/       # Premium UI Components
│   │   ├── config.ts         # API & ImageKit Global Config
│   │   └── App.tsx           # Main Application Entry
│   └── package.json
└── velo-realty-backend/      # FastAPI Backend Application
    ├── main.py               # API Endpoints & Logic
    ├── models.py             # SQLAlchemy Database Models
    ├── database.py           # DB Connection Engine
    └── requirements.txt      # Python Dependencies
```

---

## 🛠️ Setup & Installation

### 1. Backend Setup
Navigate to the backend directory and set up a virtual environment:

```bash
cd velo-realty-backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

**Database Configuration:**
Ensure you have a PostgreSQL database named `velo_reality` running. Update the connection string in `database.py` if necessary.

**Run the Server:**
```bash
uvicorn main:app --reload --port 8000
```

### 2. Frontend Setup
Navigate to the frontend directory and install dependencies:

```bash
cd velo-realty
npm install  # or yarn
```

**Environment Config:**
Update `src/config.ts` with your local API URL and ImageKit credentials.

**Run the Development Server:**
```bash
npm run dev
```

---

## 💎 Key Features

### Tactical Asset Management
- **Bulk Upload**: Parallel ingestion of 4K architectural imagery.
- **ImageKit Integration**: Automated resizing, optimization, and WebP delivery.
- **Admin Dashboard**: Executive-grade CRUD for Properties, Projects, Developers, and Team.

### Premium UI/UX
- **Isometric Perspectives**: 3D cascading partner grids and interactive cards.
- **Glassmorphic Design**: Modern, translucent UI elements with vibrant accent colors.
- **Holographic Team Section**: Dynamic, interactive showcase of executive leadership.

### Data Integrity
- **Chronological Sorting**: Automated `id`-based ordering across all portfolios.
- **Atomic Operations**: Secure, transactional updates with real-time loading states.

---

## 🔐 Administrative Access
To access the Admin Dashboard:
1. Click the "Sign In" link in the Footer.
2. Log in with your administrative credentials.
3. Once authenticated, you can manage the entire portfolio, view leads, and handle bulk asset uploads.

---

## 📦 Production Deployment
To prepare for production:

**Frontend Build:**
```bash
cd velo-realty
npm run build
```

**Backend Deployment:**
The backend is configured for seamless deployment to **Render** or similar cloud providers. Ensure the `DATABASE_URL` environment variable is set in your production environment.

---

© 2026 VELO Realty Pvt. Ltd. - *Where Speed Meets Realty*
