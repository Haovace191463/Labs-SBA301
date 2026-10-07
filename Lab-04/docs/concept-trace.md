# Concept Trace — SBA301 Lab 04 Orchid REST API & JPA Integration Kit

## 1. End-to-End Request Lifecycle Architecture

This lab illustrates how a modern Spring Boot application orchestrates a complete 3-tier REST + JPA architecture from HTTP client to relational database and back:

```text
HTTP Request (Client / Postman)
    │
    ▼
REST Controller (@RestController, @RequestMapping("/api/orchids"))
    │  - Binds HTTP method (GET, POST, PUT, DELETE)
    │  - Deserializes JSON payload (@RequestBody)
    │  - Translates validation/business exceptions to HTTP status codes (200, 201, 204, 400, 404)
    ▼
Service Layer (IOrchidService / OrchidService)
    │  - Enforces domain validation rules (blank name checks, category requirement)
    │  - Defines Transaction Boundaries (@Transactional)
    │  - Looks up and attaches managed OrchidCategory entity
    ▼
Repository Layer (IOrchidRepository, IOrchidCategoryRepository)
    │  - Spring Data JPA dynamically generates proxy implementations
    │  - Executes standard CRUD (findAll, findById, save, deleteById)
    │  - Executes derived query methods (findByOrchidNameContainingIgnoreCase)
    ▼
JPA & Hibernate (ORM Engine)
    │  - Manages Persistence Context (First-level cache, dirty checking)
    │  - Translates Entity Object Graph operations into ANSI SQL
    ▼
Microsoft SQL Server (Database Engine)
    │  - Executes relational DDL / DML (SELECT, INSERT, UPDATE, DELETE)
    │  - Enforces Primary Key, Foreign Key (orchids.category_id -> orchid_categories.category_id)
    ▼
Entity / Java Object Graph
    │  - Hydrates Orchid & OrchidCategory POJOs from JDBC ResultSets
    ▼
HTTP Response
       - Jackson serializes Orchid entity into JSON (preventing circular recursion via @JsonIgnore)
       - Controller returns final ResponseEntity (Status code + JSON headers + payload)
```

---

## 2. End-to-End Traces

### Trace 1: `POST /api/orchids` (Create Orchid)
1. **HTTP Request:** Postman sends `POST http://localhost:8080/api/orchids` with JSON body:
   ```json
   {
     "orchidName": "Cattleya Queen",
     "orchidCategory": { "categoryId": 1 }
   }
   ```
2. **Controller (`OrchidController.create`):**
   - `@RequestBody` binds JSON to `Orchid` instance.
   - Passes the instance to `orchidService.create(orchid)`.
3. **Service & Transaction (`OrchidService.create`):**
   - Begins a write transaction (`@Transactional`).
   - Validates `orchidName` (throws `IllegalArgumentException` if blank).
   - Validates category ID presence, calls `categoryRepository.findById(1)`.
   - Found managed `OrchidCategory` entity is attached to `orchid.setOrchidCategory(...)`.
   - Clears `orchidID` (`setOrchidID(null)`) so database generates IDENTITY.
4. **Repository & Hibernate:**
   - Calls `orchidRepository.save(orchid)`.
   - Hibernate transitions entity to *Managed* state.
   - Generates SQL: `INSERT INTO orchids (orchid_name, category_id, ...) VALUES (?, ?, ...)`.
5. **SQL Server:**
   - Inserts row into `dbo.orchids`. Checks foreign key constraint against `dbo.orchid_categories(category_id)`.
   - Returns generated IDENTITY value (e.g., `1`).
6. **HTTP Response:**
   - Controller returns `ResponseEntity.status(HttpStatus.CREATED).body(created)`.
   - Status: `201 Created` with JSON payload containing generated `orchidID`.

---

### Trace 2: `GET /api/orchids?name=CATTLEYA` (Derived Query Search)
1. **HTTP Request:** Postman sends `GET http://localhost:8080/api/orchids?name=CATTLEYA`.
2. **Controller:** `@RequestParam` extracts `name = "CATTLEYA"`. Calls `orchidService.searchByName("CATTLEYA")`.
3. **Service & Repository:**
   - Executes `orchidRepository.findByOrchidNameContainingIgnoreCase("CATTLEYA")`.
4. **Hibernate & SQL Server:**
   - Spring Data parses the method name:
     - `findBy` -> `SELECT ... FROM orchids`
     - `OrchidName` -> property `orchid_name`
     - `Containing` -> SQL `LIKE %...%`
     - `IgnoreCase` -> `UPPER(o.orchid_name) LIKE UPPER(?)`
   - Executes SQL:
     ```sql
     SELECT o.* FROM orchids o WHERE UPPER(o.orchid_name) LIKE UPPER(?) ESCAPE '\'
     ```
5. **Serialization:**
   - Result list is returned to Controller.
   - Jackson serializes array of `Orchid` objects to JSON array.
   - Status: `200 OK`.

---

## 3. Core Spring Data JPA & Persistence Concepts

### `@Entity`
Marks a Java class as a JPA persistent entity, meaning each instance corresponds to a row in the associated database table.

### `@Id` & `@GeneratedValue`
- `@Id`: Designates the primary key property of the entity.
- `@GeneratedValue(strategy = GenerationType.IDENTITY)`: Instructs JPA to rely on SQL Server's auto-incrementing `IDENTITY(1,1)` column to generate IDs upon insertion.

### `@ManyToOne` vs `@OneToMany` & Owning Side vs Inverse Side
- **Owning Side (`Orchid.orchidCategory`):**
  - Annotated with `@ManyToOne(optional = false)`.
  - Annotated with `@JoinColumn(name = "category_id", nullable = false)`.
  - The owning side physically maps to the foreign key column (`category_id`) in the database table `orchids`. Any change to this relationship is persisted when the owning entity is saved.
- **Inverse Side (`OrchidCategory.orchids`):**
  - Annotated with `@OneToMany(mappedBy = "orchidCategory")`.
  - The `mappedBy` element MUST point to the **Java field name** in the owning entity (`orchidCategory`), NOT the database column name (`category_id`).
  - The inverse side is read-only from Hibernate's foreign key management perspective.

### Infinite JSON Recursion & `@JsonIgnore`
- In a bidirectional relationship (`Orchid` -> `OrchidCategory` -> `orchids` -> `Orchid`), serializing either object causes an infinite loop: `Orchid` references `OrchidCategory`, which references `List<Orchid>`, which references `OrchidCategory`, leading to `StackOverflowError`.
- By adding `@JsonIgnore` to `OrchidCategory.getOrchids()`, Jackson omits the back-reference when converting `OrchidCategory` to JSON.

### `JpaRepository` & Derived Query Methods
- `JpaRepository<T, ID>` provides complete out-of-the-box CRUD operations (`findAll()`, `findById()`, `save()`, `deleteById()`, etc.) without writing any DAO implementation classes.
- Derived Queries (e.g. `findByOrchidNameContainingIgnoreCase(String name)`): Spring Data inspects the method name at runtime and translates the keywords (`findBy`, `Containing`, `IgnoreCase`) directly into SQL query statements.

### Transaction Management (`@Transactional`)
- Class-level `@Transactional(readOnly = true)` optimizes read operations (disabling Hibernate dirty checks).
- Method-level `@Transactional` on `create`, `update`, and `delete` defines an atomic boundary. If any exception occurs (e.g. category ID not found), the entire transaction rolls back, preventing partial or corrupt database states.

### HTTP Status Code Semantics
| Status | Meaning | When Used in Lab 04 |
|---|---|---|
| `200 OK` | Successful operation returning content | `GET` list, `GET` by existing ID, successful `PUT` update |
| `201 Created` | Successful creation of a new resource | Successful `POST /api/orchids` |
| `204 No Content` | Successful operation with no return body | Successful `DELETE /api/orchids/{id}` |
| `400 Bad Request` | Client-side semantic or syntax violation | Blank name, missing category, category not found, malformed JSON `{` |
| `404 Not Found` | The requested resource URI does not exist | `GET`, `PUT`, or `DELETE` with non-existent ID (`99999999`) |
