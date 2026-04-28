# 🦷 DentaCare — Clinic Management System

> A full-stack dental clinic management platform built with **Next.js** and **Express.js**, featuring role-based access control, appointment scheduling, patient records, billing, and real-time notifications.

🌐 **Live Demo**: [dental-clinic-system-three.vercel.app](https://dental-clinic-system-three.vercel.app/login)

---

## 📸 Preview

![DentaCare Login](public/dental-clinic-bg.png)

---

## ✨ Features

### 🔐 Authentication & Security
- JWT-based authentication with secure HTTP-only tokens
- Role-Based Access Control (RBAC) — **Admin** and **Staff** roles
- Rate limiting on auth routes to prevent brute-force attacks
- Security headers via `helmet.js`
- Password hashing with `bcrypt`

### 🏥 Dashboard
- Real-time clinic statistics (patients, appointments, revenue)
- Revenue chart with monthly breakdown
- Today's appointments overview
- Recent patients list

### 👥 Patient Management
- Full CRUD for patient records
- Patient search and filtering
- Patient history and profile management

### 📅 Appointment Management
- Interactive appointment calendar
- Create, edit, and cancel appointments
- Dentist assignment and scheduling

### 💰 Billing & Invoices
- Invoice creation and management
- Billing statistics and revenue tracking
- Invoice status tracking (Paid / Unpaid / Overdue)

### 👤 User & Staff Management *(Admin only)*
- Add, edit, and remove staff accounts
- Reset staff passwords
- Role assignment (Admin / Staff)

### 🔔 Notifications
- In-app notification center
- Appointment reminders via email (Nodemailer + Gmail SMTP)

### ⚙️ Settings
- Clinic profile configuration
- Account settings & password change
- Notification preferences

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 14 (App Router), TypeScript, Tailwind CSS |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB Atlas, Mongoose ODM |
| **Auth** | JSON Web Tokens (JWT) |
| **Email** | Nodemailer (Gmail SMTP) |
| **Logging** | Winston |
| **Security** | Helmet.js, express-rate-limit, bcrypt |
| **Testing** | Jest, React Testing Library |
| **Hosting** | Vercel (Frontend), Render (Backend) |

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (or local MongoDB)
- Gmail account for SMTP (or any SMTP provider)

### 1. Clone the repository
```bash
git clone https://github.com/samanthagwynetha/dental-clinic-system.git
cd dental-clinic-system
```

### 2. Setup the Backend
```bash
cd backend
cp .env.example .env   # Fill in your actual values
npm install
npm run dev
```

**Required `backend/.env` variables:**
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/dental-clinic
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=1d
FRONTEND_URL=http://localhost:3000
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=your@gmail.com
SMTP_PASS=your_app_password
```

### 3. Setup the Frontend
```bash
# From the root of the project
cp .env.example .env.local   # Fill in your actual values
npm install
npm run dev
```

**Required `.env.local` variables:**
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 4. Open the app
Visit `http://localhost:3000`

**Default Admin Credentials:**
```
Email:    admin@clinic.com
Password: admin1234
```

---

## 📁 Project Structure

```
dental-clinic-system/
├── backend/                  # Express.js API server
│   ├── routes/               # Auth, user, admin, dashboard routes
│   ├── src/
│   │   ├── controllers/      # Business logic
│   │   ├── models/           # Mongoose schemas
│   │   ├── routes/           # Patient, appointment, invoice routes
│   │   └── config/           # Database connection
│   ├── middlewares/          # Auth, error handling
│   ├── utils/                # Logger, mailer, token generator
│   └── server.js             # Entry point
│
└── src/                      # Next.js App Router frontend
    ├── app/
    │   ├── login/            # Login page
    │   ├── dashboard/        # Main dashboard
    │   ├── patients/         # Patient management
    │   ├── appointments/     # Appointment calendar
    │   ├── billing/          # Invoice management
    │   ├── users/            # Staff management (Admin only)
    │   └── settings/         # Clinic & account settings
    ├── components/           # Reusable UI components
    ├── lib/                  # API client (axios)
    └── utils/                # Auth guards, role helpers
```

---

## 🌐 Deployment

| Service | Platform | Branch |
|---------|----------|--------|
| Frontend | [Vercel](https://vercel.com) | `main` |
| Backend | [Render](https://render.com) | `main` |
| Database | [MongoDB Atlas](https://cloud.mongodb.com) | Cloud M0 Free Tier |

### Environment Variables in Production
- **Render**: Set all variables from `backend/.env` in the Render dashboard under **Environment**.
- **Vercel**: Set `NEXT_PUBLIC_API_URL` to your Render backend URL.

---

## 🔒 Security Notes

- The `.env` file is **never committed** to the repository.
- JWT secrets are cryptographically generated (64-char hex).
- Auth routes are rate-limited to **50 requests per 15 minutes**.
- All API responses are secured with appropriate HTTP headers via Helmet.

---

## 📄 License

This project is for educational and portfolio purposes.

---

<div align="center">
  Made with 🦷 by <a href="https://github.com/samanthagwynetha">samanthagwynetha</a>
</div>
