# Slot 26 – Basic Frontend for Spring Security JWT

## 1. Project Introduction

This project is the completed assignment for **SBA301 – Slot 26**. It connects a modern, responsive **React + Vite** single-page frontend application with the completed Spring Boot Backend implementing **Spring Security and JWT Authentication** (from Slot 25, enhanced with Chapter 16 Part C security consolidation).

The application demonstrates the complete lifecycle of stateless JWT-based authentication and authorization:
- **User Registration (Signup)**: Creates a new user with BCrypt hashed password and `USER` role.
- **User Authentication (Login)**: Authenticates credentials against the backend `DaoAuthenticationProvider` and returns a signed JJWT access token.
- **Client-Side Token Management**: Stores the JWT token securely in browser storage (`localStorage`) and injects it into every outgoing request via Axios interceptors.
- **Protected Endpoint Access**: Demonstrates calling protected REST endpoints (`/users/me` and `/users`) using `Authorization: Bearer <token>`.
- **User Profile & Authorization Inspection**: Displays the current user's identity and authorities (`ROLE_USER`).
- **Live Security Testing**: Demonstrates real-time verification of valid tokens, anonymous 401 rejections, tampered/invalid token rejections, and automatic session cleanup.
- **User Logout**: Clears client storage, resets application state, and redirects to login.

---

## 2. Technologies Used

### Backend
- **Java**: 21 (LTS)
- **Spring Boot**: 3.4.5
- **Spring Security**: Stateless session management, BCrypt password hashing, JWT authentication filter
- **JJWT (io.jsonwebtoken)**: 0.12.6 for token generation and signature verification
- **Spring Data JPA / Hibernate**: Database persistence and entity mapping
- **Microsoft SQL Server**: Production-grade relational database (`OrchidManagementDB`)
- **Maven**: 3.10.0 build tool and dependency manager

### Frontend
- **React**: 19 (Functional components and Hooks: `useState`, `useEffect`, `useContext`, `useCallback`)
- **Vite**: 6.2+ lightning-fast development build tool and bundling
- **React Router DOM**: 7.x client-side routing and protected routes
- **Axios**: HTTP client with global request/response interceptors
- **CSS**: Pure custom CSS with responsive card layout, badges, alert banners, and accessible forms

---

## 3. Project Structure

```text
slot26/
├── slot 25/                              # Official Enhanced Spring Boot Backend
│   ├── database/
│   │   ├── 01-create-database.sql        # Database initialization script
│   │   └── 02-verify-app-user.sql        # Table verification script
│   ├── scripts/
│   │   └── run-local.ps1                 # Local run script with secure sa password prompt
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/edu/slot25/security/
│   │   │   │   ├── auth/                 # Authentication controller, service & DTOs
│   │   │   │   ├── error/                # Global exception handling & error models
│   │   │   │   ├── jwt/                  # JwtService & JwtAuthenticationFilter
│   │   │   │   ├── security/             # SecurityConfiguration, EntryPoint & AccessDeniedHandler
│   │   │   │   └── user/                 # AppUser entity, repository & controllers
│   │   │   └── resources/
│   │   │       └── application.properties# Backend configuration with CORS allowlist
│   │   └── test/                         # 17 comprehensive integration & negative tests
│   ├── pom.xml
│   ├── README.md
│   └── SECURITY_WORKBOOK.md              # Chapter 16 Part C security consolidation workbook
│
├── frontend/                             # React + Vite Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── AlertBanner.jsx           # Reusable feedback notifications
│   │   │   ├── Navbar.jsx                # Responsive navigation with user badge & logout
│   │   │   └── ProtectedRoute.jsx        # Route guard redirecting unauthenticated users
│   │   ├── context/
│   │   │   └── AuthContext.jsx           # React Context for authentication state & tokens
│   │   ├── pages/
│   │   │   ├── DashboardPage.jsx         # User profile, live JWT testing & database table
│   │   │   ├── LoginPage.jsx             # User login form with validation & error handling
│   │   │   └── SignupPage.jsx            # User registration form with validation
│   │   ├── services/
│   │   │   ├── api.js                    # Axios instance with request/response interceptors
│   │   │   └── authService.js            # API methods: signup, login, getMe, getAllUsers
│   │   ├── App.jsx                       # Main application shell and route configuration
│   │   ├── App.css                       # Application layout, cards, and UI styles
│   │   ├── index.css                     # Global reset and CSS variables
│   │   └── main.jsx                      # Vite React entry point
│   ├── .env                              # Local frontend environment variables
│   ├── .env.example                      # Template environment configuration
│   ├── package.json                      # Frontend dependencies & scripts
│   └── vite.config.js                    # Vite configuration with port 5173
│
├── .gitignore                            # Workspace gitignore (protecting target, node_modules, .env)
└── README.md                             # This documentation file
```

---

## 4. Prerequisites

Before running the project, ensure you have installed:

1. **Java Development Kit (JDK)**: Version 21 or higher.
   ```bash
   java -version
   ```
2. **Apache Maven**: Version 3.9+ or 3.10+.
   ```bash
   mvn -version
   ```
3. **Node.js**: Version 20.x, 22.x, or 24.x and `npm`.
   ```bash
   node -v
   npm -v
   ```
4. **Microsoft SQL Server**: Local instance running on port `1433` with database `OrchidManagementDB`.

---

## 5. Backend Setup Instructions

1. Ensure SQL Server is running and the database `OrchidManagementDB` is created:
   ```sql
   -- Run in SQL Server Management Studio or sqlcmd
   IF DB_ID(N'OrchidManagementDB') IS NULL
       CREATE DATABASE [OrchidManagementDB];
   ```

2. Navigate to the backend directory:
   ```powershell
   cd "C:\SBA301\labs\slot26\slot 25"
   ```

3. Run the backend tests to verify everything passes:
   ```powershell
   mvn test
   ```
   *Expected outcome: 17 tests run, 0 failures, 0 errors.*

4. Start the Spring Boot backend application:
   ```powershell
   # Option A: Run using the provided script (prompts for SQL Server sa password):
   .\scripts\run-local.ps1

   # Option B: Run directly with Maven (uses default local password or environment variables):
   $env:DB_PASSWORD = "your_sa_password"
   mvn spring-boot:run
   ```
   *The backend will start and listen on `http://localhost:8080`.*

---

## 6. Frontend Setup Instructions

1. Navigate to the frontend directory:
   ```powershell
   cd "C:\SBA301\labs\slot26\frontend"
   ```

2. Install npm dependencies:
   ```powershell
   npm install
   ```

3. Configure environment variables:
   Copy `.env.example` to `.env` (if not already present):
   ```powershell
   Copy-Item .env.example .env
   ```
   Content of `.env`:
   ```properties
   VITE_API_BASE_URL=http://localhost:8080
   ```

4. Build or test the production build:
   ```powershell
   npm run build
   ```

5. Start the Vite development server:
   ```powershell
   npm run dev
   ```
   *The frontend will run on `http://localhost:5173`.*

---

## 7. How to Run the Application

| Service | Working Directory | Command | URL |
|---|---|---|---|
| **Spring Boot Backend** | `slot26/slot 25` | `mvn spring-boot:run` | `http://localhost:8080` |
| **React Frontend Client** | `slot26/frontend` | `npm run dev` | `http://localhost:5173` |

Open your browser at `http://localhost:5173`.

---

## 8. Available API Endpoints

| Method | Endpoint | Access Level | Description | Request Body | Response Format |
|---|---|---|---|---|---|
| `POST` | `/auth/signup` | Public | Register a new user | `{"email": "...", "password": "..."}` | `{"id": 1, "email": "...", "role": "USER"}` (201 Created) |
| `POST` | `/auth/login` | Public | Authenticate user & get JWT | `{"email": "...", "password": "..."}` | `{"accessToken": "...", "tokenType": "Bearer", "expiresIn": 900}` (200 OK) |
| `GET` | `/users/me` | Bearer Token | Get current user identity & roles | None | `{"username": "...", "authorities": [{"authority": "ROLE_USER"}]}` (200 OK) |
| `GET` | `/users` | Bearer Token | Get all users in system | None | `[{"id": 1, "email": "...", "role": "USER"}, ...]` (200 OK) |
| `OPTIONS`| `/**` | Public (CORS) | Preflight checks from `http://localhost:5173` | None | CORS Headers (200 OK) |

---

## 9. Authentication Flow

```text
[ React Frontend ]                                 [ Spring Boot Backend ]
        │                                                     │
        │ 1. POST /auth/signup (email, password)              │
        ├────────────────────────────────────────────────────>│ (BCrypt Hash -> DB)
        │<────────────────────────────────────────────────────┤ 201 Created
        │                                                     │
        │ 2. POST /auth/login (email, password)               │
        ├────────────────────────────────────────────────────>│ (Verify BCrypt -> Sign JWT)
        │<────────────────────────────────────────────────────┤ 200 OK { accessToken, 900s }
        │                                                     │
        │ 3. Save accessToken to localStorage                 │
        │                                                     │
        │ 4. GET /users/me (Header: Bearer <accessToken>)     │
        ├────────────────────────────────────────────────────>│ (JwtFilter -> SecurityContext)
        │<────────────────────────────────────────────────────┤ 200 OK { username, authorities }
        │                                                     │
        │ 5. Display Dashboard & Protected Data               │
        │                                                     │
        │ 6. Logout / Token Expiry                            │
        │    - Clear localStorage                             │
        │    - Reset AuthContext                              │
        │    - Redirect to /login                             │
```

---

## 10. Verification & Testing Checklist

The following tests were executed and verified:

1. **Backend Unit & Integration Tests**:
   - `mvn test` runs 17 integration tests covering:
     - End-to-end signup, login, and protected calls.
     - Anonymous access to `/users/me` returning `401 UNAUTHORIZED`.
     - Malformed / tampered JWT returning `401 UNAUTHORIZED`.
     - Token expiration returning `401 UNAUTHORIZED`.
     - Duplicate registration returning `409 EMAIL_EXISTS`.
     - Wrong password returning `401 UNAUTHORIZED`.
     - Preflight `OPTIONS` for origin `http://localhost:5173` returning 200 OK with allowed methods and headers.
     - Disallowed origin rejection.

2. **Frontend End-to-End Tests**:
   - **User Registration**:
     - Tested submitting valid registration: successfully creates user and redirects to login with flash banner.
     - Tested submitting duplicate email: properly shows `409 EMAIL_EXISTS` alert banner.
     - Tested password confirmation mismatch: caught client-side before network dispatch.
     - Tested password shorter than 8 characters: caught client-side with validation message.
   - **User Login**:
     - Tested valid credentials: successfully returns JWT, updates state, and navigates to `/dashboard`.
     - Tested invalid credentials: returns `401 UNAUTHORIZED` with friendly error banner.
   - **Dashboard & Protected Routes**:
     - Loads current user email and roles directly from `GET /users/me`.
     - Clicking **"GET /users"** retrieves and renders the registered users table.
     - Clicking **"Test Missing Token"** proves anonymous requests receive HTTP 401.
     - Clicking **"Test Tampered Token"** proves Spring Security rejects invalid signatures with HTTP 401.
   - **Logout**:
     - Clicking **"Logout"** clears `jwt_token` from `localStorage`, clears user state, and redirects to `/login`.
     - Directly accessing `http://localhost:5173/dashboard` while logged out is blocked by `ProtectedRoute` and redirects to `/login`.

---

## 11. Security Highlights & Submission Safety

- **No Secrets in Source Control**: Passwords and secrets are managed through environment variables with safe defaults for local development. `.env` and `*.log` files are ignored by `.gitignore`.
- **Stateless JWT**: No server session is created (`SessionCreationPolicy.STATELESS`).
- **Strict CORS Policy**: Only the authorized React origin `http://localhost:5173` is granted CORS headers with explicit methods (`GET`, `POST`, `PUT`, `DELETE`, `OPTIONS`) and headers (`Authorization`, `Content-Type`).
