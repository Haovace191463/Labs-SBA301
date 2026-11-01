# SBA301 Lab 07 - Library Management System (JavaFX + Hibernate + SQL Server)

## 1. Project Introduction
This project is an enterprise-grade desktop Library Management application developed for **SBA301 Lab 07**. It demonstrates clean layered architecture, object-relational mapping with **Hibernate 6**, and an intuitive user interface built with **JavaFX** and **FXML** (compatible with Gluon Scene Builder), connected to a **Microsoft SQL Server** database (`LibraryDB`).

---

## 2. Technologies Used
- **Language / Runtime:** Java 21 (JDK 21 LTS)
- **UI Framework:** JavaFX 21.0.5 & FXML
- **Styling:** CSS3 & Scene Builder compatible FXML
- **ORM / Persistence:** Hibernate ORM 6.5.3.Final / Jakarta Persistence API 3.1
- **Database:** Microsoft SQL Server (LibraryDB)
- **Database Driver:** Microsoft JDBC Driver for SQL Server (`mssql-jdbc` 12.8.1.jre11)
- **Build System:** Apache Maven 3.9+
- **Unit Testing:** JUnit Jupiter 5.10.3

---

## 3. Architecture & Classpath Design
The application adheres strictly to the multi-tier enterprise design pattern:

```
[JavaFX UI / FXML]
        ↓
  [Controllers] (LoginController, StudentController)
        ↓
[Service Layer] (IStudentService / StudentService)
        ↓
[Repository Layer] (IStudentRepository / StudentRepository)
        ↓
  [DAO Layer] (StudentDAO)
        ↓
[Hibernate Session / Transaction Management]
        ↓
[SQL Server 2022 - LibraryDB]
```

### Separation of Concerns:
- **Controllers** only communicate with the **Service layer**. They contain zero direct references to DAOs, Hibernate Sessions, or raw database queries.
- **Service layer** enforces business validation rules (email format, marks ranges, uniqueness, and authentication).
- **Repository layer** abstracts data access operations.
- **DAO layer** handles Hibernate Session opening, explicit transaction commit/rollback, and proper resource closing.

### Classpath Approach vs Modular JavaFX (`module-info.java`):
This project uses the standard JavaFX classpath architecture with a bootstrap launcher (`com.library.Main` delegating to `com.library.App`).
- **Reason:** Combining Hibernate ORM 6, ByteBuddy dynamic bytecode generation, Jakarta Persistence annotations, and JavaFX reflection across strong module boundaries frequently leads to `IllegalAccessException` or package split issues unless numerous `--add-opens` and `--add-exports` flags are configured.
- The classpath bootstrap launcher ensures the project runs reliably in IntelliJ IDEA, Eclipse, NetBeans, and command-line Maven without requiring complicated JVM command-line arguments.

---

## 4. Database Configuration & Security

### Canonical Tables Mapped:
1. **`STUDENTS`**: Primary key `id` (BIGINT IDENTITY), `email` (UNIQUE), `first_name`, `last_name`, `marks` (FLOAT), `password` (VARCHAR).
2. **`BOOKS`**: Primary key `id` (BIGINT IDENTITY), `isbn` (UNIQUE), `title`, `author`.
3. **`students_books`**: Join table mapping `@ManyToMany` between students and books (`student_id`, `book_id`).

### Connection Settings:
Base connection templates are located in:
- `src/main/resources/db.properties`
- `src/main/resources/hibernate.cfg.xml`

Default template:
```properties
db.url=jdbc:sqlserver://localhost:1433;databaseName=LibraryDB;encrypt=true;trustServerCertificate=true;
db.user=sa
db.password=
```

### Supplying Database Credentials Safely:
Configuration precedence in `HibernateUtil` is strictly resolved in the following order:
1. **JVM System Properties:** Pass `-Ddb.url=...`, `-Ddb.user=...`, `-Ddb.password=...`.
2. **Environment Variables:** Set `DB_URL`, `DB_USER`, and `DB_PASSWORD`.
3. **Local Untracked File:** Create `db.local.properties` (or copy from `src/main/resources/db.properties.example`). This file is git-ignored and safe for local development passwords.
4. **Base Template:** `src/main/resources/db.properties`
5. **Hibernate Default XML:** `src/main/resources/hibernate.cfg.xml`

---

## 5. How to Run the Application

### Option A: From IntelliJ IDEA (Recommended)
1. Open the project folder `Lab-07` in IntelliJ IDEA.
2. Ensure Project SDK is set to **Java 21** (`File` -> `Project Structure` -> `Project` -> `SDK`).
3. Locate `src/main/java/com/library/Main.java`.
4. Right-click `Main.java` and select **Run 'Main.main()'**.

### Option B: From Command Line using Maven
Run the following command in the project root:
```powershell
mvn javafx:run
```
*(Or specify the full path to Maven if not in PATH)*

---

## 6. How to Test Login & Student Management

### A. Testing Login
1. On application launch, the **Login** window appears.
2. **Invalid Login Test:**
   - Enter `invalid@fu.edu.vn` and password `wrongpass`.
   - Click **Sign In**.
   - An error message will appear: *"Invalid email or password. Please try again."*
3. **Valid Login Test:**
   - Existing student in database:
     - **Email:** `s29@fu.edu.vn`
     - **Password:** `password123`
   - Click **Sign In**. The Student Management window will open.

### B. Testing Student CRUD Operations
1. **Read / Populate Table:**
   - The table immediately shows all students from `LibraryDB` (including `Slot TwentyNine`, marks: `8.0`).
2. **Select Row:**
   - Click the row in the table. The form on the left will automatically populate with the student's ID, Email, First Name, Last Name, and Marks.
3. **Add New Student:**
   - Click **Clear Form**.
   - Fill in:
     - Email: `alice.smith@fu.edu.vn`
     - Password: `alicePass123`
     - First Name: `Alice`
     - Last Name: `Smith`
     - Marks: `9.2`
   - Click **Add Student**. A confirmation alert will appear, and the new student will display in the table.
4. **Update Student:**
   - Click on `Alice Smith` in the table.
   - Change Marks from `9.2` to `9.8`.
   - Click **Update Student**. Verify the table updates.
5. **Delete Student:**
   - Select `Alice Smith` from the table.
   - Click **Delete Student**.
   - Confirm deletion when prompted. The student is removed from the table and database.
6. **Validation Error Test:**
   - Attempt to add or update a student with marks `15.0` or invalid email `alice.smith`.
   - The system displays a validation warning alert preventing invalid data from reaching the database.

---

## 7. Maven Commands

- **Run all automated tests:**
  ```powershell
  mvn test
  ```
- **Build application JAR package:**
  ```powershell
  mvn package
  ```
- **Clean build artifacts:**
  ```powershell
  mvn clean
  ```

---

## 8. Verification & Evidence
Pre-configured verification scripts and guides are available in `submission-evidence/`:
- `verify-librarydb.sql`: Verifies database tables, foreign keys, and rows.
- `init-test-password.sql`: Safe SQL query to initialize test password for `s29@fu.edu.vn`.
- `test-checklist.md`: Matrix of tests T01 through T17.
- `screenshots-guide.md`: Detailed list of screenshots to capture for submission.

---

## 9. Known Limitations
- The join table `students_books` contains book loan mappings for student `s29@fu.edu.vn`. Deleting existing student `id: 4` would cascade or detach relationships; therefore, testing uses isolated temporary records to preserve existing database data.
