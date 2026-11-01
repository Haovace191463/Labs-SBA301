# FU Mini Hotel Management System (FUMiniHotelSystem)
## SBA301 - Assignment 03: Securing REST Services with Spring Boot & ReactJS

### Student Information
- **Student Name:** Vo Anh Hao (HaoVA)
- **Class Code:** SE1910
- **Project Name:** `A3HaoVA_SE1910`
- **Database Name:** `A3HaoVA_SE1910` (Microsoft SQL Server on port 1433)
- **Backend Package:** `fu.se.a3haova_se1910`
- **Frontend App:** `A3HaoVA_SE1910` (ReactJS + Vite in `/frontend`)

---

## 1. Project Overview & Architecture

The **FU Mini Hotel Management System** is a full-stack enterprise web application built strictly according to the SBA301 Assignment 03 specification. It features:
- A **3-Tier Architecture** (Controller → Service → Repository).
- **Spring Boot 3 / Java 21** RESTful API with Jakarta Bean Validation.
- **Spring Data JPA** with Microsoft SQL Server persistence.
- **Spring Security** with **JSON Web Token (JWT)** stateless authentication and role-based authorization.
- **ReactJS (Vite)** single-page frontend with **Axios** HTTP client.

---

## 2. Database Design & Entity Mapping

The database schema directly implements the Assignment 03 diagram with exact table names, column names, primary keys, and foreign keys:

```
+--------------------+        +--------------------+
| BookingReservation | 1 -- * |   BookingDetail    |
+--------------------+        +--------------------+
          |                              |
          *                              *
          1                              1
+--------------------+        +--------------------+
|      Customer      |        |  RoomInformation   |
+--------------------+        +--------------------+
                                         |
                                         *
                                         1
                              +--------------------+
                              |      RoomType      |
                              +--------------------+
```

### Table & Column Details:
1. **`RoomType`**: `RoomTypeID` (PK), `RoomTypeName`, `TypeDescription`, `TypeNote`
2. **`RoomInformation`**: `RoomID` (PK), `RoomNumber`, `RoomDetailDescription`, `RoomMaxCapacity`, `RoomTypeID` (FK), `RoomStatus`, `RoomPricePerDay`
3. **`Customer`**: `CustomerID` (PK), `CustomerFullName`, `Telephone`, `EmailAddress` (Unique), `CustomerBirthday`, `CustomerStatus`, `Password` (BCrypt encoded)
4. **`BookingReservation`**: `BookingReservationID` (PK), `BookingDate`, `TotalPrice`, `CustomerID` (FK), `BookingStatus`
5. **`BookingDetail`**: Composite PK `(BookingReservationID, RoomID)`, `StartDate`, `EndDate`, `ActualPrice`

---

## 3. Security Roles & Business Rules

### A. Public Access
- Anyone can view room information (`/api/rooms`) and room types (`/api/room-types`) without authentication.
- Keyword and multi-criteria room search/filter.

### B. Customer Role (`ROLE_CUSTOMER`)
- Register with email and password (`POST /api/auth/customer/register`).
- Secure login returning JWT (`POST /api/auth/customer/login`).
- View and update own profile (`GET /api/customer/profile`, `PUT /api/customer/profile`).
- Create an online reservation with one or multiple rooms (`POST /api/customer/bookings`).
- View own reservation history and room details (`GET /api/customer/bookings`).
- **Ownership Protection**: Customers cannot access other customers' private profiles or booking history.

### C. Staff Role (`ROLE_STAFF`)
- **Credentials loaded from `application.properties`**:
  ```properties
  hotel.staff.email=staff@fuminihotel.com
  hotel.staff.password=Staff@123
  ```
  *(No hardcoded staff credentials in Java code).*
- Manage Customers: View, search, create, update, delete/deactivate.
- Manage Rooms: Create, update, and delete.
  - **Critical Room Deletion Rule**:
    - If a room is not associated with any booking detail, it is physically deleted.
    - If a room is already stored in a booking detail, it is soft-deleted by setting `RoomStatus = 0`.
- Manage Room Types: CRUD operations.
- Manage Booking Reservations: View all reservations with details, update status (`1=Confirmed`, `2=Completed`, `0=Cancelled`), create offline reservations.

---

## 4. Running the Application

### Prerequisites
- JDK 21
- Node.js v20+ or v24+
- Microsoft SQL Server running on port 1433 with database `A3HaoVA_SE1910`

### Step 1: Run Backend (Port 8080)
Open PowerShell in the project root:
```powershell
cd C:\SBA301\labs\A3HaoVA_SE1910
.\mvnw.cmd spring-boot:run
```
*(The database tables and initial demo data are automatically initialized on startup).*

### Step 2: Run Frontend (Port 5173)
Open a second PowerShell window:
```powershell
cd C:\SBA301\labs\A3HaoVA_SE1910\frontend
npm run dev
```
Open your browser at `http://localhost:5173`.

---

## 5. Testing & Verification

### Running Automated Maven Tests
```powershell
.\mvnw.cmd test
```
**Test Results:**
- `fu.se.a3haova_se1910.service.AuthServiceTest`: 4 tests passed.
- `fu.se.a3haova_se1910.service.RoomServiceTest`: 2 tests passed (including room deletion rule).
- `fu.se.a3haova_se1910.service.BookingServiceTest`: 2 tests passed (including customer ownership).
- `fu.se.a3haova_se1910.A3HaoVaSe1910ApplicationTests`: 1 context load passed.
- **Total: 9 tests run, 0 failures, 0 errors, 0 skipped.**

### Postman API Testing
Import `postman_collection.json` into Postman. Refer to `API_TESTING_GUIDE.md` for full request/response examples.

