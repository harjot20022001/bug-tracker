# Bug Tracking System (Mini Jira)

A full-stack bug tracking application built with the MERN stack, featuring role-based access control, real-time notifications, and modern UI/UX design.

## 🚀 Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **NodeMailer** - Email notifications
- **CORS** - Cross-origin resource sharing

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router v6** - Client-side routing
- **Axios** - HTTP client
- **Zod** - Schema validation
- **React Icons** - Icon library

## ✨ Features

### Core Functionality
- **User Authentication** - Registration, login, logout with JWT
- **Role-Based Access Control** - Admin and Employee roles
- **Project Management** - Create, view, edit, delete projects (Admin only)
- **Ticket Management** - Create, assign, update, filter tickets
- **User Management** - Admin can manage all users and roles
- **Email Notifications** - Automatic notifications for ticket assignments and updates

### Advanced Features
- **Real-time Updates** - Immediate UI updates for all operations
- **Ticket Filtering** - Filter by status, priority, assignee, and search
- **Dashboard Analytics** - Statistics and performance metrics
- **Responsive Design** - Mobile-first, modern glassmorphism UI
- **Fast Refresh Optimized** - Separated hooks architecture for better DX

### Security Features
- **Password Hashing** - bcryptjs for secure password storage
- **JWT Authentication** - Token-based authentication
- **Protected Routes** - Role-based route protection
- **Environment Variables** - Secure configuration management

## 🛠️ Local Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- Git

### 1. Clone Repository
```bash
git clone https://github.com/harjot20022001/bug-tracker.git
cd bug-tracker
```

### 2. Backend Setup
```bash
cd bug-tracking-system/backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env file with your configuration
# Required variables:
# - MONGO_URI (MongoDB connection string)
# - JWT_SECRET (random secret key)
# - SMTP credentials (for email notifications)
```

### 3. Frontend Setup
```bash
cd ../frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env file with backend URL
# VITE_API_URL=http://localhost:5001/api/v1
```

### 4. Environment Variables

#### Backend (.env)
```env
NODE_ENV=development
PORT=5001
MONGO_URI=mongodb://localhost:27017/bug-tracker
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=30d
FRONTEND_URL=http://localhost:5173

# Email Configuration (Optional - for notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_EMAIL=your-email@gmail.com
SMTP_PASSWORD=your-app-password
EMAIL_FROM=your-email@gmail.com
```

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:5001/api/v1
```

### 5. Database Setup
Make sure MongoDB is running locally or update MONGO_URI to point to MongoDB Atlas.

### 6. Run the Application

#### Start Backend (Terminal 1)
```bash
cd bug-tracking-system/backend
npm run dev
```
Backend will run on http://localhost:5001

#### Start Frontend (Terminal 2)
```bash
cd bug-tracking-system/frontend
npm run dev
```
Frontend will run on http://localhost:5173


## 🔐 User Roles

### Admin
- Create, edit, delete projects
- Manage all users and roles
- View and edit all tickets
- Access user management interface

### Employee
- View all projects
- Create tickets in any project
- Edit tickets assigned to them
- View dashboard statistics
