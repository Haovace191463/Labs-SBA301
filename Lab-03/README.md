# Lab 03 - Employee Management

Employee Management RESTful API with layered architecture and multi-tier automated test suite.

## Technology Stack

- **Java**: 21
- **Spring Boot**: 4.1.1
- **Build Tool**: Maven
- **Testing**:
  - Controller Layer: MockMvc (`@WebMvcTest`) with `@MockitoBean`
  - Service Layer: JUnit 5 + Mockito (`@ExtendWith(MockitoExtension.class)`)
  - Repository Layer: Plain JUnit 5 (Unit testing in-memory ArrayList without Spring context)
- **JSON Serialization**: Jackson 3 (`tools.jackson.databind`)
- **Validation**: Jakarta Bean Validation (`spring-boot-starter-validation`)

---

## Architecture

The project strictly follows layered architecture principles:

```text
HTTP Request
     ↓
Controller (EmployeeController)
     ↓
Service (EmployeeService)
     ↓
Repository (EmployeeRepository)
     ↓
In-Memory Storage (ArrayList<Employee>)
```

- **Controller**: Handles HTTP requests, query parameters, path variables, request validation, and HTTP response statuses.
- **Service**: Implements business rules, exception throwing, pagination slicing, and sorting logic.
- **Repository**: Manages in-memory `ArrayList<Employee>` data access, auto-generating IDs and resetting state.
- **In-Memory Store**: Pure in-memory `ArrayList` with initial sample data. No JPA, no Hibernate, no database.

---

## API Endpoints

Base URL: `/api/employees`

| Method | Endpoint | Description | Success Status | Failure Status |
|---|---|---|---|---|
| `GET` | `/api/employees` | Retrieve all employees (supports pagination & sorting) | `200 OK` | `400 BAD REQUEST` |
| `GET` | `/api/employees/{id}` | Retrieve single employee by ID | `200 OK` | `404 NOT FOUND` |
| `POST` | `/api/employees` | Create a new employee | `201 CREATED` | `400 BAD REQUEST` |
| `PUT` | `/api/employees/{id}` | Update an existing employee | `200 OK` | `404 NOT FOUND` / `400 BAD REQUEST` |
| `DELETE` | `/api/employees/{id}` | Delete an employee by ID | `204 NO CONTENT` | `404 NOT FOUND` |

---

## Pagination and Sorting

### Supported Query Parameters

| Parameter | Type | Default | Description |
|---|---|---|---|
| `page` | `int` | `0` | Zero-based page index. Invalid or negative values safely default to `0`. |
| `size` | `int` | `10` | Page size. Invalid or non-positive values safely default to `10`. |
| `sortBy` | `String` | `id` | Field name to sort by: `id`, `name`, `email`, `department`, `salary`. Unrecognized fields safely fall back to `id`. |
| `direction` | `String` | `asc` | Sorting direction: `asc` (ascending) or `desc` (descending). |

### Example Pagination Request

```http
GET /api/employees?page=0&size=3
```

Response format:

```json
{
  "content": [
    {
      "id": 1,
      "name": "Alice Smith",
      "email": "alice.smith@example.com",
      "department": "Engineering",
      "salary": 75000.0
    },
    {
      "id": 2,
      "name": "Bob Jones",
      "email": "bob.jones@example.com",
      "department": "Marketing",
      "salary": 55000.0
    },
    {
      "id": 3,
      "name": "Charlie Brown",
      "email": "charlie.brown@example.com",
      "department": "Human Resources",
      "salary": 60000.0
    }
  ],
  "page": 0,
  "size": 3,
  "totalElements": 5,
  "totalPages": 2
}
```

### Example Sorting Request

```http
GET /api/employees?sortBy=salary&direction=desc
```

---

## Validation and Error Handling

### Validation Rules

- `name`: Required (cannot be blank)
- `email`: Required + must be valid email format
- `department`: Required (cannot be blank)
- `salary`: Required + must not be negative (`>= 0.0`)

### Error Responses

Formatted JSON error responses returned by `GlobalExceptionHandler`:

```json
{
  "status": 404,
  "message": "Employee not found with id: 999",
  "timestamp": "2026-10-06T21:55:00"
}
```

```json
{
  "status": 400,
  "message": "name: Name is required; email: Invalid email format",
  "timestamp": "2026-10-06T21:55:00"
}
```

---

## Testing Strategy

The test suite covers all tiers of the application with 32 automated tests across 4 test classes:

### 1. Controller Tests (`EmployeeControllerTest`)
- Uses Spring Boot 4 `@WebMvcTest(EmployeeController.class)`
- `MockMvc` simulates HTTP requests
- Service dependency is mocked via `@MockitoBean private IEmployeeService employeeService;`
- Tests GET list, GET by ID, 404 handling, POST 201, PUT 200/404, DELETE 204/404, pagination metadata, sorting parameters, and 400 validation error handling.
- Verifies Mockito interactions (`verify(employeeService)...`).

### 2. Service Unit Tests (`EmployeeServiceUnitTest`)
- Pure JUnit 5 + Mockito using `@ExtendWith(MockitoExtension.class)`
- No Spring application context loaded (fast execution).
- `@Mock private IEmployeeRepository employeeRepository;` and `@InjectMocks private EmployeeService employeeService;`
- Tests success and failure scenarios for find, create, update, delete, pagination math, and sorting directions/fallbacks.

### 3. Repository Unit Tests (`EmployeeRepositoryTest`)
- Plain JUnit 5 unit tests for the in-memory `ArrayList` data access layer.
- `@BeforeEach` resets the repository state using `resetData()` before each test.
- Tests CRUD operations, sequence ID generation, list retrieval, existence checks, and array slicing pagination.

---

## Running the Application & Tests

### Run Tests

```powershell
.\mvnw.cmd test
```

Or on Unix/Linux/macOS:

```bash
./mvnw test
```

### Clean Test Run

```powershell
.\mvnw.cmd clean test
```

### Build & Package JAR

```powershell
.\mvnw.cmd clean package
```

### Run Application

```powershell
.\mvnw.cmd spring-boot:run
```
## Known Limitations

- The current repository uses an in-memory `ArrayList<Employee>` instead of JPA/database persistence.
- Repository tests therefore use plain JUnit 5 and do not use `@DataJpaTest`.
- Data is reset when the application/repository state is recreated; it is not persistent across application restarts.
- The test suite focuses on the current Lab 03 API contract and does not cover production database integration.