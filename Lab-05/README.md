# Orchid_Mgnt_V5 — SBA301 Lab 05 Single Page Application

Full-stack Single Page Application (SPA) for Orchid Management built with **Spring Boot 4 / Java 21 RESTful API**, **Microsoft SQL Server**, and **React 19 / Vite 8**.

---

## 1. Project Overview & Architecture

- **Project Name**: `Orchid_Mgnt_V5`
- **Course**: SBA301 (Full-Stack Software Architecture & Web Services)
- **Architecture**: Decoupled Client-Server SPA Architecture
  ```
  [ React 19 / Vite SPA @ http://localhost:5173 ]
          │
          │ Axios (HTTP / JSON / CORS)
          ▼
  [ Spring Boot 4.1.1 REST API @ http://localhost:8080 ]
          │
          │ Spring Data JPA / Hibernate 7
          ▼
  [ Microsoft SQL Server @ localhost:1433 ]
          │
          └── Table: dbo.Orchid (7 columns)
  ```

---

## 2. Technology Stack

| Layer | Technologies & Versions |
| :--- | :--- |
| **Backend** | Java 21, Spring Boot 4.1.1, Spring Data JPA, Hibernate 7, Jakarta Validation 3.1, Microsoft JDBC Driver 13.4 |
| **Frontend** | React 19.1.0, React-DOM 19.1.0, Vite 8.3.3, Axios 1.11.0, Vanilla Modern CSS |
| **Database** | Microsoft SQL Server (target table: `dbo.Orchid`) |
| **Testing** | JUnit 5, Spring WebMvc Test, MockMvc, Mockito |

---

## 3. Folder Structure

```
SBA301-Lab05/
├── .gitignore                      # Comprehensive Git ignore rules (node_modules, dist, target, IDEs)
├── README.md                       # This comprehensive documentation and run guide
├── docs/
│   └── Break_It_Diagnose_Fix_Report.md  # Workshop documentation for Section 20 defects
├── chapter15api/                   # Spring Boot Backend Project
│   ├── pom.xml                     # Maven project configuration (Orchid_Mgnt_V5)
│   ├── mvnw, mvnw.cmd, .mvn/       # Maven Wrapper
│   └── src/
│       ├── main/java/fu/se/chapter15api/
│       │   ├── Chapter15apiApplication.java
│       │   ├── config/WebConfig.java             # CORS allowing http://localhost:5173
│       │   ├── controller/OrchidController.java  # REST Endpoints (/orchids/ & /orchids)
│       │   ├── dto/OrchidRequest.java            # Request DTO + Validation + Jackson Aliases
│       │   ├── dto/OrchidResponse.java           # Response DTO + Dual Boolean Properties
│       │   ├── exception/ApiError.java           # Structured error response record
│       │   ├── exception/ApiExceptionHandler.java# Global @RestControllerAdvice
│       │   ├── exception/ResourceNotFoundException.java
│       │   ├── model/Orchid.java                 # JPA Entity mapped to dbo.Orchid (7 columns)
│       │   ├── repository/OrchidRepository.java  # Spring Data JpaRepository
│       │   └── service/OrchidService.java        # Business logic & transactional CRUD
│       └── test/java/fu/se/chapter15api/
│           ├── Chapter15apiApplicationTests.java # Spring Boot context loading test
│           └── controller/OrchidControllerTest.java # 14 MockMvc controller unit tests
└── chapter15reactjs/               # React 19 + Vite 8 Frontend Project
    ├── package.json                # "orchid-mgnt-v5", dependencies, scripts
    ├── vite.config.js              # Vite server & /api proxy configuration
    ├── index.html                  # Orchid_Mgnt_V5 HTML entry point
    ├── .env.development            # VITE_API_BASE_URL=http://localhost:8080
    ├── .env.production             # VITE_API_BASE_URL=/api
    └── src/
        ├── main.jsx                # React root mount
        ├── App.jsx                 # Main SPA component (State, Search, Filter, Modal)
        ├── style.css               # Design system with Table View and Card Grid
        ├── api/httpClient.js       # Centralized Axios client with error interceptor
        ├── api/orchidApi.js        # API service methods (get, create, update, delete)
        └── components/
            ├── ListOfOrchids.jsx   # Orchid list with Table View / Card Grid toggle
            └── EditOrchid.jsx      # Create/Edit modal with datalist autocomplete
```

---

## 4. Database Schema and Configuration

### Target Table Schema (`dbo.Orchid`)
```sql
CREATE TABLE Orchid (
    OrchidID INT IDENTITY(1,1) PRIMARY KEY,
    OrchidName NVARCHAR(100) NOT NULL,
    IsNatural BIT NOT NULL,
    OrchidDescription NVARCHAR(500),
    OrchidCategory NVARCHAR(100),
    IsAttractive BIT NOT NULL,
    OrchidURL NVARCHAR(500)
);
```

> **Database Configuration Status Note**:
> The teacher's provided scripts present an inconsistency: `SQLQuery1.sql` conditionally creates `SBA301_OrchidDB`, while both `SQLQuery1.sql` and `SQLQuery2.sql` create the table and insert 13 records into **`OrchidManagementDB`**.
> In accordance with safety rules, existing database configurations are preserved pending your final database selection confirmation.
>
> **Recommended Database Setup**:
> Target database: **`OrchidManagementDB`**
> Connection string: `jdbc:sqlserver://localhost:1433;databaseName=OrchidManagementDB;encrypt=true;trustServerCertificate=true`

---

## 5. REST API Endpoints

Base URL: `http://localhost:8080`

| Method | Endpoint | Description | Request Body | Success Status | Error Status |
| :---: | :--- | :--- | :---: | :---: | :---: |
| `GET` | `/orchids` or `/orchids/` | Retrieve all orchids | None | `200 OK` | `500` |
| `GET` | `/orchids/{id}` | Retrieve orchid by ID | None | `200 OK` | `404 Not Found` |
| `POST` | `/orchids` or `/orchids/` | Create a new orchid | `OrchidRequest` (JSON) | `201 Created` | `400 Bad Request` |
| `PUT` | `/orchids/{id}` | Update an existing orchid | `OrchidRequest` (JSON) | `200 OK` | `400` / `404` |
| `DELETE` | `/orchids/{id}` | Delete an orchid | None | `204 No Content` | `404 Not Found` |

### JSON Payload Specifications

#### Request Body (`POST` / `PUT`)
```json
{
  "orchidName": "Taichung Beauty",
  "isNatural": true,
  "orchidDescription": "Popular Cattleya orchid with vibrant color.",
  "orchidCategory": "Cattleya",
  "isAttractive": true,
  "orchidURL": "https://example.com/orchid1.jpg"
}
```
*Note: Due to `@JsonAlias`, the backend also accepts `"natural"`, `"attractive"`, and `"orchidUrl"`.*

#### Response Body (`GET` / `POST` / `PUT`)
```json
{
  "orchidId": 1,
  "orchidName": "Taichung Beauty",
  "isNatural": true,
  "natural": true,
  "orchidDescription": "Popular Cattleya orchid with vibrant color.",
  "orchidCategory": "Cattleya",
  "isAttractive": true,
  "attractive": true,
  "orchidURL": "https://example.com/orchid1.jpg",
  "orchidUrl": "https://example.com/orchid1.jpg"
}
```

---

## 6. How to Run the Application

### Prerequisites
1. JDK 21 installed (`java -version`).
2. Node.js & npm installed (`node -v`, `npm -v`).
3. Microsoft SQL Server running on `localhost:1433`.

### Step 1: Start Backend (Spring Boot)
Open a terminal in `chapter15api`:
```powershell
# Set database password environment variable if required
$env:DB_PASSWORD = "<YOUR_PASSWORD>"

# Run Spring Boot
.\mvnw.cmd spring-boot:run
```
*Backend will start on port `8080`. Verify by opening `http://localhost:8080/orchids/` in browser or Postman.*

### Step 2: Start Frontend (React / Vite)
Open a second terminal in `chapter15reactjs`:
```powershell
npm run dev
```
*Frontend dev server starts on `http://localhost:5173`. Open in your browser.*

---

## 7. Build and Test Commands

### Backend Verification
From `chapter15api`:
```powershell
# Run the complete test suite (15 tests: unit, MockMvc, and context load)
.\mvnw.cmd clean test

# Build production JAR package
.\mvnw.cmd package -DskipTests
```
**Current Test Result**: `Tests run: 15, Failures: 0, Errors: 0, Skipped: 0` (100% Pass).

### Frontend Verification
From `chapter15reactjs`:
```powershell
# Compile production bundle
npm run build
```
**Current Build Result**: `built in ~350ms, 0 errors, 0 warnings`.

---

## 8. Teacher Demonstration Checklist

Use this structured checklist during individual teacher evaluation:

| # | Demonstration Action | How to Execute | Expected Result | Evidence to Present |
| :---: | :--- | :--- | :--- | :--- |
| **1** | **Backend Build & Tests** | Run `.\mvnw.cmd clean test` in `chapter15api`. | All 15 tests pass with `BUILD SUCCESS`. MockMvc asserts 200, 201, 204, 400, 404. | Terminal output showing `Tests run: 15, Failures: 0`. |
| **2** | **Frontend Production Build** | Run `npm run build` in `chapter15reactjs`. | Vite builds production assets in `dist/` with exit code 0. | Terminal showing clean build without errors. |
| **3** | **Display Orchid List** | Open `http://localhost:5173`. | Table view displays columns: ID, Thumbnail, Name, Category, Natural (`Yes`/`No`), Attractive (`Yes`/`No`), Actions. | Browser DevTools Network tab showing `GET /orchids/` returning `HTTP 200`. |
| **4** | **View Mode Toggle (Extension)** | Click the `🎴 Thẻ (Cards)` button. | UI transitions smoothly from Table View to Card Grid with badges for Natural and Attractive. | UI responsive grid cards. |
| **5** | **Filter & Search (Extension)** | 1. Click category tab (e.g. `Cattleya`).<br>2. Type keyword in search box. | Table filters instantly without full-page reload or extra server request. | Filtered orchid count updates in toolbar. |
| **6** | **Create Orchid** | Click `+ Thêm hoa lan mới`, fill all 6 inputs, check `Natural` & `Attractive`, click `Thêm vào bộ sưu tập`. | Dialog closes, `POST /orchids/` returns `HTTP 201 Created`, new orchid appears at end of table. | DevTools Network showing POST 201 + Location header. |
| **7** | **Edit Orchid** | Click `Sửa` on any orchid, modify category/name, click `Lưu thay đổi`. | `PUT /orchids/{id}` returns `HTTP 200 OK`, table reflects updated values immediately. | DevTools Network showing PUT 200. |
| **8** | **Delete Orchid** | Click `Xóa` on an orchid, click OK on confirmation dialog. | `DELETE /orchids/{id}` returns `HTTP 204 No Content`, row is removed from table. | DevTools Network showing DELETE 204. |
| **9** | **Validation Error (Extension)** | Try saving with an empty name. | Form prevents submission, shows inline error: *"Vui lòng nhập tên hoa lan."* | Form inline error message. |
| **10** | **Break/Fix Workshop (Part 2)** | Explain Section 20 scenarios from `docs/Break_It_Diagnose_Fix_Report.md`. | Demonstrates clear understanding of CORS, 405, 415, port mismatch, and boolean property naming fixes. | [docs/Break_It_Diagnose_Fix_Report.md](file:///C:/SBA301/labs/SBA301-Lab05/docs/Break_It_Diagnose_Fix_Report.md). |

---

## 9. Known Limitations & Approval Gates

- **Database Initialization Gate**: Neither database was altered during implementation. Once target database (`OrchidManagementDB`) is approved, executing `SQLQuery1.sql` and `SQLQuery2.sql` will populate the 13 live rows for runtime inspection.
- **Git State**: Git initialization and commit operations remain pending explicit user authorization.
