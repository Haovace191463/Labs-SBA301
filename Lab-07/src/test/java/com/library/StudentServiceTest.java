package com.library;

import com.library.config.HibernateUtil;
import com.library.entity.Student;
import com.library.service.IStudentService;
import com.library.service.StudentService;
import org.hibernate.SessionFactory;
import org.junit.jupiter.api.*;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class StudentServiceTest {

    private static IStudentService studentService;

    @BeforeAll
    static void setUpAll() {
        studentService = new StudentService();
    }

    @AfterAll
    static void tearDownAll() {
        HibernateUtil.shutdown();
    }

    @Test
    @Order(1)
    @DisplayName("T01: Hibernate bootstrap - SessionFactory initializes")
    void testHibernateBootstrap() {
        SessionFactory sessionFactory = HibernateUtil.getSessionFactory();
        assertNotNull(sessionFactory, "SessionFactory should be successfully initialized");
        assertFalse(sessionFactory.isClosed(), "SessionFactory should be open");
    }

    @Test
    @Order(2)
    @DisplayName("T02 & T03: Database connection and Get All Students - Existing student returned")
    void testGetAllStudentsPreservesExisting() {
        List<Student> students = studentService.getAllStudents();
        assertNotNull(students, "Student list should not be null");
        assertFalse(students.isEmpty(), "LibraryDB should contain existing students");

        // Verify existing student s29@fu.edu.vn is preserved
        boolean foundExisting = students.stream()
                .anyMatch(s -> "s29@fu.edu.vn".equalsIgnoreCase(s.getEmail()));
        assertTrue(foundExisting, "Existing student 's29@fu.edu.vn' must be present in database");
    }

    @Test
    @Order(3)
    @DisplayName("T04: Find student by ID or Email - Correct student returned")
    void testFindStudent() {
        Student student = studentService.getStudentByEmail("s29@fu.edu.vn");
        assertNotNull(student, "Should find student by email 's29@fu.edu.vn'");
        assertEquals("Slot", student.getFirstName(), "First name should match database record");
        assertEquals("TwentyNine", student.getLastName(), "Last name should match database record");
        assertEquals(8.0, student.getMarks(), 0.01, "Marks should match database record");

        Student byId = studentService.getStudentById(student.getId());
        assertNotNull(byId, "Should find student by ID " + student.getId());
        assertEquals(student.getEmail(), byId.getEmail());
    }

    @Test
    @Order(4)
    @DisplayName("T05, T06, T07: Create, Update, and Delete temporary test student (isolated cleanup)")
    void testStudentCrudLifecycle() {
        String testEmail = "test_lifecycle_" + System.currentTimeMillis() + "@fu.edu.vn";
        Student tempStudent = new Student(testEmail, "Unit", "Tester", 9.0, "tempPass123");

        Student created = null;
        try {
            // T05: Create
            created = studentService.createStudent(tempStudent);
            assertNotNull(created.getId(), "Created student should receive an auto-generated ID");
            assertEquals(testEmail, created.getEmail());

            // T06: Update
            created.setFirstName("UpdatedUnit");
            created.setMarks(9.5);
            Student updated = studentService.updateStudent(created);
            assertEquals("UpdatedUnit", updated.getFirstName());
            assertEquals(9.5, updated.getMarks(), 0.01);

            // Verify fetched from DB
            Student fetched = studentService.getStudentById(created.getId());
            assertEquals("UpdatedUnit", fetched.getFirstName());
            assertEquals(9.5, fetched.getMarks(), 0.01);

        } finally {
            // T07: Delete (clean up temporary test record only)
            if (created != null && created.getId() != null) {
                boolean deleted = studentService.deleteStudent(created.getId());
                assertTrue(deleted, "Temporary test student should be cleanly deleted");
                assertNull(studentService.getStudentById(created.getId()), "Deleted student should no longer exist");
            }
        }
    }

    @Test
    @Order(5)
    @DisplayName("T14: Invalid marks & fields - Validation errors thrown")
    void testValidationErrors() {
        // Marks out of bounds (> 10)
        Student invalidMarksHigh = new Student("valid1@fu.edu.vn", "A", "B", 10.5, "pass");
        assertThrows(IllegalArgumentException.class, () -> studentService.createStudent(invalidMarksHigh));

        // Marks out of bounds (< 0)
        Student invalidMarksLow = new Student("valid2@fu.edu.vn", "A", "B", -1.0, "pass");
        assertThrows(IllegalArgumentException.class, () -> studentService.createStudent(invalidMarksLow));

        // Invalid email format
        Student invalidEmail = new Student("notanemail", "A", "B", 8.0, "pass");
        assertThrows(IllegalArgumentException.class, () -> studentService.createStudent(invalidEmail));

        // Missing required fields
        Student missingFirst = new Student("valid3@fu.edu.vn", "", "B", 8.0, "pass");
        assertThrows(IllegalArgumentException.class, () -> studentService.createStudent(missingFirst));
    }

    @Test
    @Order(6)
    @DisplayName("T15 & T16: Authentication test")
    void testAuthentication() {
        // T15: Invalid login
        Student nonExistent = studentService.authenticate("nonexistent@fu.edu.vn", "wrongpass");
        assertNull(nonExistent, "Non-existent user should fail authentication");

        assertThrows(IllegalArgumentException.class, () -> studentService.authenticate("", "pass"));
        assertThrows(IllegalArgumentException.class, () -> studentService.authenticate("s29@fu.edu.vn", ""));

        // T16: Valid login for s29@fu.edu.vn
        // If password was null in DB, authenticate initializes it with the test password safely
        Student authStudent = studentService.authenticate("s29@fu.edu.vn", "password123");
        assertNotNull(authStudent, "Existing student should be authenticated");
        assertEquals("s29@fu.edu.vn", authStudent.getEmail());
    }
}
