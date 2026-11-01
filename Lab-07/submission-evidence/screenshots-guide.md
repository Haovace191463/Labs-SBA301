# SBA301 Lab 07 - Manual Screenshot Capture Guide

Please capture the following screenshots during your manual testing session before submission:

| Screenshot # | Description | When / How to Capture |
| :--- | :--- | :--- |
| **SCREENSHOT_01** | IntelliJ Project Structure | Expand `src/main/java`, `src/main/resources`, and `pom.xml` in IntelliJ IDEA Project explorer window. |
| **SCREENSHOT_02** | Gluon Scene Builder - Login Screen | Open `src/main/resources/fxml/LoginGUI.fxml` in Gluon Scene Builder showing the card layout, `fx:id` properties, and controller binding. |
| **SCREENSHOT_03** | Gluon Scene Builder - Student Screen | Open `src/main/resources/fxml/student-view.fxml` in Gluon Scene Builder showing the left form layout and right TableView. |
| **SCREENSHOT_04** | Running Application - Login Screen | Run `com.library.Main` in IntelliJ. Capture the initial login window. |
| **SCREENSHOT_05** | Login Screen - Validation / Invalid Credentials | Type an invalid email/password and click "Sign In". Capture the red error message displayed in `lblError`. |
| **SCREENSHOT_06** | Student Management Screen - Initial Load | Enter valid credentials (`s29@fu.edu.vn` / `password123`) and click "Sign In". Capture the student view showing existing record (`Slot TwentyNine`, marks: `8.0`). |
| **SCREENSHOT_07** | Student Row Selection | Click on the row in `TableView`. Capture the form on the left populated automatically with the student's ID, email, name, and marks. |
| **SCREENSHOT_08** | Add New Student | Fill in new student details (e.g. `student1@fu.edu.vn`, `John`, `Doe`, marks `8.5`) and click "Add Student". Capture the success confirmation dialog and the new row in the TableView. |
| **SCREENSHOT_09** | Update Student | Select a student, modify marks (e.g. to `9.0`), and click "Update Student". Capture the success dialog and the updated record in the TableView. |
| **SCREENSHOT_10** | Validation Warning (Invalid Marks) | Enter invalid marks (e.g. `12.5` or `abc`) and click "Update Student" or "Add Student". Capture the warning alert. |
| **SCREENSHOT_11** | Delete Confirmation Dialog | Select the newly added student and click "Delete Student". Capture the confirmation alert asking whether to proceed with deletion. |
| **SCREENSHOT_12** | SQL Server Management Studio (SSMS) Verification | Run `SELECT * FROM STUDENTS;` in SSMS showing that changes were successfully committed to `LibraryDB`. |
