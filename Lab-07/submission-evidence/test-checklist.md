# SBA301 Lab 07 - Test Checklist (T01 - T17)

| Test ID | Test Case | Expected Result | Verification Method | Status |
| :--- | :--- | :--- | :--- | :--- |
| **T01** | Hibernate bootstrap | `SessionFactory` initializes without error; schema validated against LibraryDB. | Automated test (`StudentServiceTest.testHibernateBootstrap`) | **PASS** |
| **T02** | Database connection | `LibraryDB` is accessible and metadata is verified. | Automated test (`StudentServiceTest.testGetAllStudentsPreservesExisting`) | **PASS** |
| **T03** | Get all students | Existing student `s29@fu.edu.vn` is returned with full profile preserved. | Automated test (`StudentServiceTest.testGetAllStudentsPreservesExisting`) | **PASS** |
| **T04** | Find student by ID | Correct student record is retrieved by primary key `id`. | Automated test (`StudentServiceTest.testFindStudent`) | **PASS** |
| **T05** | Create student | New student record is persisted into SQL Server `STUDENTS` table with auto-generated ID. | Automated test (`StudentServiceTest.testStudentCrudLifecycle`) | **PASS** |
| **T06** | Update student | Updated fields (`firstName`, `marks`) are modified in `STUDENTS` table. | Automated test (`StudentServiceTest.testStudentCrudLifecycle`) | **PASS** |
| **T07** | Delete test student | Test record is removed cleanly from `STUDENTS` table without affecting existing records. | Automated test (`StudentServiceTest.testStudentCrudLifecycle`) | **PASS** |
| **T08** | Load JavaFX FXML | `LoginGUI.fxml` and `student-view.fxml` are parsed successfully without `FXMLLoader` exceptions. | Automated test (`ArchitectureAndBootstrapTest.testFxmlResourceIntegrity`) & manual launch | **PASS** |
| **T09** | Display TableView | All student records from `STUDENTS` table are shown in `tblStudents`. | Application launch & UI test | **PASS** |
| **T10** | Select student row | Selecting a row in `tblStudents` automatically populates form fields and preserves `txtId`. | Interactive UI verification | **PASS** |
| **T11** | Create from UI | Clicking "Add Student" validates form, saves record to SQL Server, refreshes table, and clears form. | Interactive UI verification | **PASS** |
| **T12** | Update from UI | Clicking "Update Student" updates selected student in SQL Server and refreshes table. | Interactive UI verification | **PASS** |
| **T13** | Delete from UI | Clicking "Delete Student" shows confirmation popup, deletes student from SQL Server upon OK, and refreshes table. | Interactive UI verification | **PASS** |
| **T14** | Invalid marks / fields | Entering marks < 0, marks > 10, non-numeric values, or invalid email triggers validation warnings without crash. | Automated test (`StudentServiceTest.testValidationErrors`) & UI test | **PASS** |
| **T15** | Invalid login | Entering non-existent email or wrong password displays clear error in `lblError` without crashing. | Automated test (`StudentServiceTest.testAuthentication`) & UI test | **PASS** |
| **T16** | Valid login | Entering `s29@fu.edu.vn` and password opens `student-view.fxml`. | Automated test (`StudentServiceTest.testAuthentication`) & UI test | **PASS** |
| **T17** | Architecture audit | `LoginController` and `StudentController` communicate strictly through `IStudentService`. No direct DAO or Hibernate Session access. | Automated test (`ArchitectureAndBootstrapTest.testArchitectureBoundaries`) | **PASS** |
