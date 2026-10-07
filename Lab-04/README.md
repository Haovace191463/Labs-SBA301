# SBA301 Lab 04 — Orchid REST API & JPA Integration Kit

## 1. Project Overview

- **Project Name:** `Slot-18-Orchid-REST-JPA`
- **Course:** SBA301 – Integrate Single Page Application with Spring Boot (Slot 18 / Chapter 13 Part A & B)
- **Base Package:** `com.example.orchid`
- **Main Class:** `com.example.orchid.OrchidApplication`
- **Purpose:** Build a robust, end-to-end RESTful API for Orchid Management integrated with Microsoft SQL Server using Spring Boot 3.x/4.x and Spring Data JPA. Demonstrates entity mapping, bidirectional relationships (`Orchid` N–1 `OrchidCategory`), repository abstraction, service/transaction boundaries, derived queries, HTTP status code semantics, and malformed JSON error handling.

---

## 2. Technology Stack

- **Java Runtime:** JDK 21
- **Build Tool:** Apache Maven
- **Framework:** Spring Boot 4.1.1 (Spring Web MVC, Spring Data JPA, Hibernate ORM)
- **Database:** Microsoft SQL Server 2022 (`OrchidDB`)
- **Driver:** Microsoft JDBC Driver for SQL Server (`mssql-jdbc`)
- **Testing:** JUnit 5, Spring Boot Test, MockMvc
- **API Client:** Postman

---

## 3. Database & Entity Relationship Architecture

### Schema
- `dbo.orchid_categories` (Primary Key: `category_id`, Unique: `category_name`)
- `dbo.orchids` (Primary Key: `orchid_id`, Foreign Key: `category_id` references `orchid_categories.category_id`)

### Relationship Mapping
- **`Orchid` (Owning side):**
  ```java
  @ManyToOne(optional = false)
  @JoinColumn(name = "category_id", nullable = false)
  private OrchidCategory orchidCategory;
  ```
- **`OrchidCategory` (Inverse side):**
  ```java
  @OneToMany(mappedBy = "orchidCategory")
  @JsonIgnore
  private List<Orchid> orchids;
  ```
  *Note: `@JsonIgnore` prevents infinite JSON recursion during Jackson serialization.*

---

## 4. Configuration Instructions

### 4.1 SQL Server Setup
Ensure SQL Server is running and create the `OrchidDB` database and tables using `lab4Orchid.sql`:
```sql
USE [master];
CREATE DATABASE [OrchidDB];
GO
```
Seed the initial categories required for testing:
```sql
USE [OrchidDB];
INSERT INTO dbo.orchid_categories (category_name)
VALUES ('Cattleya'), ('Dendrobium');
GO
```

### 4.2 Application Properties (`src/main/resources/application.properties`)
Configure the datasource with local credentials (never commit real passwords to version control):
```properties
spring.application.name=slot18-orchid-lab

spring.datasource.url=jdbc:sqlserver://localhost:1433;databaseName=OrchidDB;encrypt=true;trustServerCertificate=true
spring.datasource.username=sa
spring.datasource.password=YOUR_PASSWORD

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true

server.port=8080
```

---

## 5. How to Build & Run

### 5.1 Run Automated Tests & Package
```powershell
# Run all unit and integration tests
.\mvnw clean test

# Build executable JAR package
.\mvnw clean package
```

### 5.2 Start the Application
```powershell
.\mvnw spring-boot:run
```
Or run `com.example.orchid.OrchidApplication` directly in IntelliJ IDEA.

The API will be available at `http://localhost:8080/api/orchids`.

---

## 6. API Endpoints Summary

| HTTP Verb | Endpoint | Description | Success Status | Error Status |
|---|---|---|---|---|
| `GET` | `/api/orchids` | List all orchids | `200 OK` | — |
| `GET` | `/api/orchids?name={keyword}` | Search orchids by name (case-insensitive substring) | `200 OK` | — |
| `GET` | `/api/orchids/{id}` | Get orchid detail by ID | `200 OK` | `404 Not Found` |
| `POST` | `/api/orchids` | Create a new orchid with category association | `201 Created` | `400 Bad Request` |
| `PUT` | `/api/orchids/{id}` | Fully update an existing orchid (including category) | `200 OK` | `400 Bad Request` / `404 Not Found` |
| `DELETE` | `/api/orchids/{id}` | Delete orchid by ID | `204 No Content` | `404 Not Found` |

### Error Response Format
All validation and syntax errors return JSON containing a descriptive `message`:
```json
{
  "message": "categoryId is required"
}
```

---

## 7. Testing Instructions (TC01 – TC18)

1. Start SQL Server service and verify `OrchidDB` contains seed categories `Cattleya` (ID 1) and `Dendrobium` (ID 2).
2. Launch the application: `.\mvnw spring-boot:run`.
3. Open Postman and execute the 18 test cases specified in `test-cases.md`:
   - **TC01–TC04:** GET list, search, empty result, missing ID.
   - **TC05–TC09:** Valid POST (capture returned `orchidID`), missing category, invalid category ID, blank name, malformed JSON (`{`).
   - **TC10–TC14:** Valid PUT (switch to category 2), GET verification, invalid category PUT (verifying no partial state changes), missing ID PUT, blank name PUT.
   - **TC15–TC17:** DELETE existing (204 No Content), GET after delete (404 Not Found), DELETE non-existent ID (404 Not Found).
   - **TC18:** Persistence verification across application restart.
4. Record observed results and screenshots into `docs/test-matrix.md` and `evidence/`.

---

## 8. Documentation Artifacts

- **[API Contract](file:///c:/SBA301/labs/Slot-18-Orchid-REST-JPA/docs/api-contract.md):** Complete HTTP request/response payloads, constraints, and status codes.
- **[Concept Trace](file:///c:/SBA301/labs/Slot-18-Orchid-REST-JPA/docs/concept-trace.md):** Architectural walkthrough of the request lifecycle from HTTP client through JPA/Hibernate to SQL Server.
- **[Test Matrix](file:///c:/SBA301/labs/Slot-18-Orchid-REST-JPA/docs/test-matrix.md):** Audit table covering all 18 test cases and SQL checkpoints.
