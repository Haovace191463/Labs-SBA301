# SBA301 – Slot 16 – Testing Strategy Worksheet

## Project
Employee Management API – Lab 03

## 1. Critical Behavior

| Behavior | What should be tested? |
|---|---|
| Employee CRUD | Create, read, update and delete employees |
| Get employee by ID | Existing employee returns 200; missing employee returns 404 |
| Validation | Invalid name, email, salary or required fields return 400 |
| Paging | `page` and `size` return correct data and metadata |
| Sorting | Employees are sorted correctly by selected field and direction |
| Error handling | API returns appropriate status and error response |

## 2. Unit Boundary

**Service layer**

The `EmployeeService` is tested independently using JUnit 5 and Mockito.

- Repository is mocked.
- Business behavior is tested without starting the Spring context.
- `verify()` is used to check repository interactions.
- Employee-not-found behavior is tested.

## 3. Web Slice

**EmployeeController**

Controller behavior is tested with:

- `@WebMvcTest`
- `MockMvc`
- Mocked `IEmployeeService`
- HTTP status assertions
- JSON/JSONPath assertions

Scenarios include:

- GET employee list
- GET employee by ID
- GET missing employee → 404
- POST employee → 201
- PUT employee
- DELETE employee
- Paging and error responses

## 4. Repository Boundary

The current repository is an **in-memory ArrayList repository**.

Therefore:

- Repository tests use plain JUnit 5.
- No `@DataJpaTest` is required.
- CRUD behavior is tested directly.
- Paging behavior is tested.
- Repository state is reset before each test.

## 5. Integration / Full Context

The project includes a Spring Boot application context test as a basic smoke test.

The main controller and service tests remain isolated so the test suite stays fast.

## 6. Regression

A deliberate regression was introduced into:

`EmployeeService.getEmployeeById()`

The method was temporarily changed to return `null`.

Expected result:

- Service tests became RED.
- 2 tests failed.
- The failure demonstrated that the tests could detect the broken behavior.

After restoring the correct implementation:

- Service tests became GREEN.
- `EmployeeServiceUnitTest` passed 10/10 tests.

## 7. Test Commands

Run all tests:

```powershell
.\mvnw.cmd test
```

Run controller tests:

```powershell
.\mvnw.cmd -Dtest=EmployeeControllerTest test
```

Run service tests:

```powershell
.\mvnw.cmd -Dtest=EmployeeServiceUnitTest test
```

Run repository tests:

```powershell
.\mvnw.cmd -Dtest=EmployeeRepositoryTest test
```

## 8. Final Verification

Final Maven test result:

- Tests run: 32
- Failures: 0
- Errors: 0
- Skipped: 0
- Build: SUCCESS

## 9. Known Limitation

The repository is currently in-memory and does not use JPA/database persistence.

Therefore, JPA-specific tests such as `@DataJpaTest` are not applicable to the current Lab 03 implementation.