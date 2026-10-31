package fu.edu.sba301.core.service;

import fu.edu.sba301.core.domain.Student;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

class StudentServiceIntegrationTest {
    private StudentServiceProvider provider;
    private IStudentService service;

    @BeforeEach
    void setUp() {
        // A unique database keeps test order from leaking state across cases.
        provider = StudentServiceProvider.create("jdbc:h2:mem:slot31_" + System.nanoTime());
        service = provider.service();
    }

    @AfterEach
    void tearDown() {
        provider.close();
    }

    @Test
    void fullCrudRoundTrip() {
        Student created = service.create(new Student(" Lan@Example.com ", " Lan ", " Nguyen ", 8.25));
        assertTrue(created.getId() > 0);
        assertEquals("lan@example.com", created.getEmail());

        service.update(created.getId(), new Student("lan@example.com", "Lan", "Trần", 9.0));
        Student updated = service.getById(created.getId()).orElseThrow();
        assertEquals("Trần", updated.getLastName());
        assertEquals(9.0, updated.getMarks());

        service.delete(created.getId());
        assertTrue(service.getById(created.getId()).isEmpty());
    }

    @Test
    void duplicateEmailIsBusinessError() {
        service.create(new Student("same@example.com", "A", "One", 7));
        StudentServiceException error = assertThrows(StudentServiceException.class,
                () -> service.create(new Student("SAME@example.com", "B", "Two", 8)));
        assertTrue(error.getMessage().contains("Email đã tồn tại"));
    }

    @Test
    void invalidMarksNeverReachPersistence() {
        assertThrows(StudentServiceException.class,
                () -> service.create(new Student("valid@example.com", "A", "One", 11)));
        assertTrue(service.getAll().isEmpty());
    }
}
