package com.library;

import com.library.controller.LoginController;
import com.library.controller.StudentController;
import com.library.dao.StudentDAO;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.io.InputStream;
import java.lang.reflect.Field;
import java.util.Arrays;

import static org.junit.jupiter.api.Assertions.*;

public class ArchitectureAndBootstrapTest {

    @Test
    @DisplayName("T17: Architecture audit - Controller does not access DAO/Hibernate directly")
    void testArchitectureBoundaries() {
        Class<?>[] controllers = {LoginController.class, StudentController.class};
        Class<?>[] forbiddenClasses = {StudentDAO.class, Session.class, SessionFactory.class};

        for (Class<?> controller : controllers) {
            Field[] fields = controller.getDeclaredFields();
            for (Field field : fields) {
                for (Class<?> forbidden : forbiddenClasses) {
                    assertFalse(
                            forbidden.isAssignableFrom(field.getType()),
                            "Architecture violation: " + controller.getSimpleName() +
                                    " must NOT have direct reference to " + forbidden.getSimpleName() +
                                    " (found field: " + field.getName() + ")"
                    );
                }
            }
        }
    }

    @Test
    @DisplayName("T08: FXML Resource Availability & Controller mapping")
    void testFxmlResourceIntegrity() {
        String[] fxmlPaths = {"/fxml/LoginGUI.fxml", "/fxml/student-view.fxml"};

        for (String path : fxmlPaths) {
            try (InputStream is = getClass().getResourceAsStream(path)) {
                assertNotNull(is, "FXML resource should exist at path: " + path);
                byte[] content = is.readAllBytes();
                String xml = new String(content);
                assertTrue(xml.contains("fx:controller="), "FXML should have fx:controller defined: " + path);
            } catch (Exception e) {
                fail("Failed to read FXML file " + path + ": " + e.getMessage());
            }
        }
    }

    @Test
    @DisplayName("T08b: Actual FXMLLoader load test for both FXML files")
    void testActualFxmlLoad() {
        try {
            javafx.application.Platform.startup(() -> {});
        } catch (IllegalStateException ignored) {
            // Already initialized
        }

        assertDoesNotThrow(() -> {
            javafx.fxml.FXMLLoader loginLoader = new javafx.fxml.FXMLLoader(getClass().getResource("/fxml/LoginGUI.fxml"));
            Object loginRoot = loginLoader.load();
            assertNotNull(loginRoot, "Login root element should not be null");

            javafx.fxml.FXMLLoader studentLoader = new javafx.fxml.FXMLLoader(getClass().getResource("/fxml/student-view.fxml"));
            Object studentRoot = studentLoader.load();
            assertNotNull(studentRoot, "Student root element should not be null");
        });
    }
}
