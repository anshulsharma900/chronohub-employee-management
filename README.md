# ChronoHub - Employee Management System

A full-stack HR management application with leave tracking, reimbursement management, and role-based access control.

## Tech Stack

### Backend
- **Runtime:** Node.js + Express.js
- **Database:** MongoDB with Mongoose
- **Auth:** JWT + Google OAuth
- **Email:** Nodemailer

### Frontend
- **Framework:** React 19 + Vite
- **Styling:** Tailwind CSS
- **Routing:** React Router DOM
- **Charts:** Chart.js
- **Animations:** Framer Motion

---

## Features

### Authentication
- Email/password registration & login
- Google OAuth integration
- JWT-based sessions
- Password reset via email
- Protected routes with RBAC

### Role-Based Access
| Role       | Access                                      |
|------------|---------------------------------------------|
| Employee   | Dashboard, apply leaves/reimbursements     |
| Manager    | Approve/reject leaves & reimbursements    |
| Admin      | Full control, user management             |

### Leave Management
- Apply for leave types with date range & reason
- Status tracking: pending, approved, rejected, cancelled

### Reimbursement System
- Submit claims: travel, meals, equipment, software, training, other
- Attach receipts
- Status: pending, approved, rejected, paid

### Additional
- Role-specific dashboards with charts
- Calendar view, profile management
- Dark/light theme toggle
- Contact form, responsive design

---

## Project Structure

```
chronohub-backend/
├── config/         # DB configuration
├── controllers/   # Request handlers
├── middleware/    # Auth, error, roles
├── models/        # User, Leave, Reimbursement
├── routes/        # API routes
├── utils/         # Token generation
├── validations/   # Input validation
├── seed.js        # DB seeding
└── server.js      # Entry point

chronohub-frontend/
├── src/
│   ├── api/       # Axios config
│   ├── components/# UI components
│   ├── context/   # Auth, Theme
│   ├── pages/     # Pages (auth, employee, manager, admin)
│   └── routes/    # Route definitions
```

---

## Getting Started

### Prerequisites
- Node.js (v18+), MongoDB

### Backend Setup
```
cd chronohub-backend
cp env.example .env
npm install
npm run dev    # Port 5000
npm run seed   # Seed data
```

### Frontend Setup
```
cd chronohub-frontend
npm install
npm run dev    # Port 5173
```

### Environment Variables
**Backend (.env)**
```
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password
```

---

## API Endpoints

| Method | Endpoint                    | Description              |
|--------|-----------------------------|--------------------------|
| POST   | /api/auth/register         | User registration       |
| POST   | /api/auth/login            | User login              |
| POST   | /api/auth/google           | Google OAuth            |
| POST   | /api/auth/forgot-password  | Request password reset |
| POST   | /api/auth/reset-password   | Reset password          |
| GET    | /api/users                 | Get all users           |
| PUT    | /api/users/:id             | Update user             |
| POST   | /api/leaves                | Create leave request    |
| GET    | /api/leaves                | Get leave requests      |
| PUT    | /api/leaves/:id            | Update leave status     |
| POST   | /api/reimbursements        | Submit reimbursement    |
| GET    | /api/reimbursements        | Get reimbursement list  |
| PUT    | /api/reimbursements/:id    | Update reimbursement    |
| POST   | /api/contact               | Submit contact form     |

---

## License

ISC

## Author

Aastha Kumari
