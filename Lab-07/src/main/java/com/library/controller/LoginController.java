package com.library.controller;

import com.library.entity.Student;
import com.library.service.IStudentService;
import com.library.service.StudentService;
import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.scene.control.Button;
import javafx.scene.control.Label;
import javafx.scene.control.PasswordField;
import javafx.scene.control.TextField;
import javafx.stage.Stage;

import java.io.IOException;

public class LoginController {

    @FXML
    private TextField txtEmail;

    @FXML
    private PasswordField txtPassword;

    @FXML
    private Label lblError;

    @FXML
    private Button btnLogin;

    private final IStudentService studentService;

    public LoginController() {
        this.studentService = new StudentService();
    }

    public LoginController(IStudentService studentService) {
        this.studentService = studentService;
    }

    @FXML
    public void initialize() {
        if (lblError != null) {
            lblError.setText("");
        }
    }

    @FXML
    public void handleLogin(ActionEvent event) {
        String email = txtEmail.getText() != null ? txtEmail.getText().trim() : "";
        String password = txtPassword.getText() != null ? txtPassword.getText().trim() : "";

        if (email.isEmpty() || password.isEmpty()) {
            showError("Please enter both email and password.");
            return;
        }

        try {
            Student authenticated = studentService.authenticate(email, password);
            if (authenticated != null) {
                navigateToStudentView();
            } else {
                showError("Invalid email or password. Please try again.");
            }
        } catch (Exception e) {
            showError("Authentication error: " + e.getMessage());
        }
    }

    private void showError(String message) {
        if (lblError != null) {
            lblError.setText(message);
        }
    }

    private void navigateToStudentView() {
        try {
            FXMLLoader loader = new FXMLLoader(getClass().getResource("/fxml/student-view.fxml"));
            Parent root = loader.load();

            Stage stage = (Stage) btnLogin.getScene().getWindow();
            Scene scene = new Scene(root);
            stage.setTitle("Library Management System - Student Management");
            stage.setScene(scene);
            stage.centerOnScreen();
            stage.show();
        } catch (IOException e) {
            showError("Failed to open Student Management: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
