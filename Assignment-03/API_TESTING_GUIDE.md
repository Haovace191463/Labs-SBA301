# FUMiniHotelSystem API Testing Guide (Assignment 03)

**Project:** `A3HaoVA_SE1910`  
**Student:** HaoVA (SE1910)  
**Base URL:** `http://localhost:8080/api`  
**Postman Collection:** `postman_collection.json` (Included in project root)

---

## 1. Authentication Endpoints

### 1.1 Staff Login (Credentials loaded from `application.properties`)
- **Method:** `POST`
- **URL:** `http://localhost:8080/api/auth/staff/login`
- **Request Body:**
  ```json
  {
    "email": "staff@fuminihotel.com",
    "password": "Staff@123"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Staff authentication successful",
    "data": {
      "token": "eyJhbGciOiJIUzI1NiJ9...",
      "tokenType": "Bearer",
      "role": "ROLE_STAFF",
      "email": "staff@fuminihotel.com",
      "name": "Hotel Staff",
      "customerId": null
    }
  }
  ```

### 1.2 Customer Registration
- **Method:** `POST`
- **URL:** `http://localhost:8080/api/auth/customer/register`
- **Request Body:**
  ```json
  {
    "customerFullName": "Vo Anh Hao",
    "telephone": "0901234567",
    "emailAddress": "haova@fuminihotel.com",
    "customerBirthday": "2003-05-15",
    "password": "Customer@123"
  }
  ```
- **Response (201 Created):**
  ```json
  {
    "success": true,
    "message": "Customer registration successful",
    "data": {
      "customerId": 1,
      "customerFullName": "Vo Anh Hao",
      "telephone": "0901234567",
      "emailAddress": "haova@fuminihotel.com",
      "customerBirthday": "2003-05-15",
      "customerStatus": 1
    }
  }
  ```

### 1.3 Customer Login
- **Method:** `POST`
- **URL:** `http://localhost:8080/api/auth/customer/login`
- **Request Body:**
  ```json
  {
    "email": "haova@fuminihotel.com",
    "password": "Customer@123"
  }
  ```
- **Response (200 OK):** Returns JWT token with `role: "ROLE_CUSTOMER"`.

---

## 2. Public Room Information (No Authentication Required)

### 2.1 View All Active Rooms
- **Method:** `GET`
- **URL:** `http://localhost:8080/api/rooms`

### 2.2 Search & Filter Rooms
- **Method:** `GET`
- **URL:** `http://localhost:8080/api/rooms/search?roomNumber=101&maxCapacity=1&minPrice=40&maxPrice=100`

### 2.3 View Room Details
- **Method:** `GET`
- **URL:** `http://localhost:8080/api/rooms/1`

### 2.4 View Room Types
- **Method:** `GET`
- **URL:** `http://localhost:8080/api/room-types`

---

## 3. Customer Operations (Requires `Authorization: Bearer <Customer_Token>`)

### 3.1 View Own Profile
- **Method:** `GET`
- **URL:** `http://localhost:8080/api/customer/profile`

### 3.2 Update Own Profile
- **Method:** `PUT`
- **URL:** `http://localhost:8080/api/customer/profile`
- **Request Body:**
  ```json
  {
    "customerFullName": "Vo Anh Hao Updated",
    "telephone": "0909999999",
    "customerBirthday": "2003-05-15",
    "newPassword": "NewPassword@123"
  }
  ```

### 3.3 Create Online Booking (1 or Many Rooms)
- **Method:** `POST`
- **URL:** `http://localhost:8080/api/customer/bookings`
- **Request Body:**
  ```json
  {
    "items": [
      {
        "roomId": 1,
        "startDate": "2026-11-10",
        "endDate": "2026-11-13"
      },
      {
        "roomId": 2,
        "startDate": "2026-11-10",
        "endDate": "2026-11-12"
      }
    ]
  }
  ```
- **Response (201 Created):** Total price automatically computed from days × pricePerDay for all rooms.

### 3.4 View Own Booking History
- **Method:** `GET`
- **URL:** `http://localhost:8080/api/customer/bookings`

---

## 4. Staff Operations (Requires `Authorization: Bearer <Staff_Token>`)

### 4.1 Customer Management
- `GET /api/staff/customers` (Optional `?search=keyword`)
- `GET /api/staff/customers/{id}`
- `POST /api/staff/customers` (Create customer)
- `PUT /api/staff/customers/{id}` (Update customer)
- `DELETE /api/staff/customers/{id}` (Delete or soft-deactivate)

### 4.2 Room Management
- `GET /api/staff/rooms` (All rooms including inactive)
- `POST /api/staff/rooms` (Create new room)
- `PUT /api/staff/rooms/{id}` (Update room)
- `DELETE /api/staff/rooms/{id}`
  - **Assignment Rule Enforced:**
    - If room has no booking history: physically deleted from database.
    - If room is referenced in `BookingDetail`: soft-deleted by setting `RoomStatus = 0`.

### 4.3 Room Type Management
- `GET /api/staff/room-types`
- `POST /api/staff/room-types`
- `PUT /api/staff/room-types/{id}`
- `DELETE /api/staff/room-types/{id}`

### 4.4 Booking Reservation Management
- `GET /api/staff/bookings` (All reservations with details)
- `GET /api/staff/bookings/{id}`
- `POST /api/staff/bookings` (Create offline booking)
- `PUT /api/staff/bookings/{id}/status` (Update status: `1=Confirmed`, `2=Completed`, `0=Cancelled`)
- `DELETE /api/staff/bookings/{id}`

---

## 5. Security & Ownership Tests
1. **Unauthenticated access to `/api/staff/rooms`:** Returns `401 Unauthorized`.
2. **Customer token accessing `/api/staff/rooms`:** Returns `403 Forbidden`.
3. **Customer accessing another customer's booking:** Returns `401 Unauthorized` / Access Denied.

