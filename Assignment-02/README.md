# FUNews Management System - Assignment 02 (SBA301)

## 1. Project Overview

FUNews Management System is a full-stack web application designed for university news operations in strict accordance with the SBA301 Assignment 02 specification. It features a 3-tier architecture with a RESTful Spring Boot backend, a Microsoft SQL Server database, and a ReactJS (Vite) single-page application frontend.

### Student & Course Information
- **Course**: SBA301
- **Assignment**: Assignment 02 - Implement CRUD Application with RESTful Web Service and ReactJS
- **Student Name**: Võ Anh Hào
- **Student ID / Class**: SE1910
- **Backend Package**: `com.hao.a2haova_se1910`
- **Database**: Microsoft SQL Server (`A2HaoVA_SE1910`)

---

## 2. Technology Stack

- **Backend**:
  - Java 21 LTS
  - Spring Boot 4.1.2
  - Spring Data JPA & Hibernate ORM
  - Spring Validation (`jakarta.validation`)
  - Microsoft JDBC Driver for SQL Server (`mssql-jdbc`)
  - Lombok
- **Database**:
  - Microsoft SQL Server 2022 / Express
  - Standard physical naming strategy (`PhysicalNamingStrategyStandardImpl`)
  - `spring.jpa.hibernate.ddl-auto=none`
- **Frontend**:
  - React 19
  - Vite 6
  - Axios 1.7.9
  - Modern Responsive CSS
- **Testing**:
  - JUnit 5 / Jupiter
  - Spring Boot Test & MockMvc
  - AssertJ & Hamcrest

---

## 3. Architecture & Functional Roles

### Role Permissions
1. **Public / Unauthenticated Visitors**:
   - Browse published news articles without authentication (`newsStatus = true`).
   - Keyword search across headlines, titles, and body content.
   - Filter news articles by category.
   - View complete article details in an interactive modal.
   - Backend enforces that unauthenticated callers cannot perform management operations (403 Forbidden) and cannot view inactive articles.
2. **Staff Members (Role = 2)**:
   - Authenticate via email and password.
   - **Category Management**: Read, Search, Create, and Update categories via popup dialogs. Delete with confirmation, strictly protected against deleting categories referenced by existing news articles.
   - **News Article Management**: Read, Search, Filter, Create, and Update articles via popup dialogs with Category selection and Tag multi-selection. Delete with confirmation.
   - **My News History**: Review all articles authored by the logged-in staff member.
   - **Profile Management**: Update personal name, email, and password.
3. **Administrators (Role = 1)**:
   - Authenticate via email and password.
   - **System Account Management**: Read, Search, Create, and Update accounts (Admin/Staff role assignment). Delete with confirmation, strictly protected against deleting accounts that have created news articles.
   - Backend strictly prevents non-admin users from accessing or managing accounts (403 Forbidden).

---

## 4. Prerequisites

- **Java**: JDK 21 (configured in `JAVA_HOME`)
- **Node.js**: v20+ or v24+ and npm v10+
- **Database**: Microsoft SQL Server running on port 1433 with database `A2HaoVA_SE1910`.

---

## 5. Database Configuration

The application connects to Microsoft SQL Server using environment variable overrides with secure local defaults in `src/main/resources/application.properties`:

```properties
spring.datasource.url=${DB_URL:jdbc:sqlserver://localhost:1433;instanceName=VOANHHAO;databaseName=A2HaoVA_SE1910;encrypt=true;trustServerCertificate=true}
spring.datasource.username=${DB_USERNAME:sa}
spring.datasource.password=${DB_PASSWORD}
spring.datasource.driver-class-name=com.microsoft.sqlserver.jdbc.SQLServerDriver
spring.jpa.hibernate.ddl-auto=none
spring.jpa.open-in-view=false
```

### Setting Database Credentials

Spring Boot reads environment variables directly at runtime. Before starting the backend or executing Maven test/package commands:

**PowerShell (Windows):**
```powershell
$env:DB_PASSWORD = "your_sql_server_password"

# Optional overrides (defaults to sa and localhost:1433/VOANHHAO/A2HaoVA_SE1910)
# $env:DB_USERNAME = "sa"
# $env:DB_URL = "jdbc:sqlserver://localhost:1433;instanceName=VOANHHAO;databaseName=A2HaoVA_SE1910;encrypt=true;trustServerCertificate=true"
```

**IntelliJ IDEA / Eclipse:**
1. Open **Run/Debug Configurations** -> select `A2HaoVaSe1910Application`.
2. Under **Environment variables**, add: `DB_PASSWORD=your_sql_server_password`.

*(Refer to `.env.example` for environment variable templates. Never commit real passwords).*

---

## 6. How to Run the Project

### A. Run Backend (Port 8080)

From the project root directory:

```powershell
# Using Maven Wrapper (Windows PowerShell)
.\mvnw.cmd spring-boot:run
```

Or run the packaged JAR file:

```powershell
java -jar target\A2HaoVA_SE1910-0.0.1-SNAPSHOT.jar
```

Backend will start at: `http://localhost:8080`

### B. Run Frontend (Port 5173)

From the `frontend` subdirectory:

```powershell
cd frontend
npm install
npm run dev
```

Frontend development server will start at: `http://localhost:5173`

---

## 7. Verified Demo Accounts

The database seed contains the following verified demo accounts for assignment evaluation (all initialized with demo password `@1`):

> **Note**: These demo credentials are for application frontend/API authentication only, completely distinct from database credentials (`DB_PASSWORD`).

| Email | Role | Name | Permissions |
|---|---|---|---|
| `SteveParis@FUNewsManagement.org` | 1 (Admin) | Steve Paris | Account Management, Profile |
| `EmmaWilliam@FUNewsManagement.org` | 2 (Staff) | Emma William | Categories, News Articles, My History, Profile |
| `OliviaJames@FUNewsManagement.org` | 2 (Staff) | Olivia James | Categories, News Articles, My History, Profile |

*Note: Guest visitors can click "Browse Public News" without logging in.*

---

## 8. RESTful API Endpoints

### Authentication
- `POST /api/auth/login`: Authenticate with email & password, returns safe user object with a 256-bit cryptographically secure session token (no password).
- `POST /api/auth/logout`: Revoke active session token on the backend.
- Protected requests require header: `Authorization: Bearer <token>`. Client-supplied role or ID headers are completely ignored.

### Category Management (Staff)
- `GET /api/categories`: Retrieve categories (returns active categories for public users; full list for staff).
- `GET /api/categories/{id}`: Retrieve a category by ID.
- `POST /api/categories`: Create category (popup modal, requires Staff role).
- `PUT /api/categories/{id}`: Update category (popup modal, requires Staff role).
- `DELETE /api/categories/{id}`: Delete category (blocked with `409 Conflict` if referenced by existing news articles; requires Staff role).

### News Article Management (Staff & Public)
- `GET /api/news-articles`: Retrieve articles (public sees only active articles; staff can filter by `?activeOnly=true`, `?createdById={id}`, `?search={term}`).
- `GET /api/news-articles/{id}`: Retrieve article with category name and tags (inactive articles forbidden to public).
- `POST /api/news-articles`: Create article with tag relationships (popup modal, requires Staff role).
- `PUT /api/news-articles/{id}`: Update article and tag relationships (popup modal, requires Staff role).
- `DELETE /api/news-articles/{id}`: Delete article and clean up `NewsTag` records (requires Staff role).

### System Account Management (Admin)
- `GET /api/accounts`: Retrieve all system accounts (requires Admin role; passwords never exposed).
- `GET /api/accounts/{id}`: Retrieve account by ID (requires Admin role).
- `POST /api/accounts`: Create account (popup modal, requires Admin role).
- `PUT /api/accounts/{id}`: Update account (popup modal, requires Admin role).
- `PUT /api/accounts/profile/{id}`: Profile update (allows staff members to manage their own profile).
- `DELETE /api/accounts/{id}`: Delete account (blocked with `409 Conflict` if account has created news articles; requires Admin role).

### Tag Endpoints (Technical Infrastructure)
- `GET /api/tags`: Retrieve all tags (used to populate tag selection chips in news management).
- `GET /api/tags/{id}`: Retrieve tag by ID.

---

## 9. Testing & Build Commands

### Backend Tests
```powershell
.\mvnw.cmd test
```
*Executes all 27 automated integration, security, and context tests against SQL Server, including token validation, role authorization, and referential integrity tests.*

### Backend Build
```powershell
.\mvnw.cmd package
```
*Builds production executable JAR in `target/`.*

### Frontend Production Build
```powershell
npm --prefix frontend run build
```
*Builds optimized production bundle in `frontend/dist/`.*
