# Task Manager App (Frontend)
A responsive task management app built with Angular and PrimeNG, featuring JWT-based authentication, role-based access (Admin/User), and CRUD operations for 

## ✅ Tech Stack
- Angular 16+
- PrimeNG + PrimeFlex + PrimeIcons
- JWT-Decode
- Visual Studio Code
- Node.js v20
- Angular CLI v19.2.0

## 🚀 Setup Instructions

1. **Clone the Repository**
   ```bash
   git clone <your-repo-url>
   git checkout development
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Run the App**
   ```bash
   ng serve
   ```
   - App runs on: `http://localhost:4200`

4. **Ensure API is running on:**  
   `https://localhost:7121`

## 🔐 Login Credentials

| Username | Password | Role  |
|----------|----------|-------|
| admin    | admin123 | Admin |
| user1    | user123  | User  |
| user2    | user123  | User  |

## 🧭 App Routes

- `/login` – Login screen
- `/dashboard` – Task dashboard

## ⚙️ Features Implemented

- Login with JWT (stored in localStorage)
- Role-based dashboard (Admin vs User)
- Task CRUD operations
- Dynamic UI using PrimeNG components
- Token & Error Interceptors
- Auth Guard to protect routes

## 📦 Modules Used

- `jwt-decode` – JWT parsing
- `primeng`, `primeicons`, `primeflex` – UI components

