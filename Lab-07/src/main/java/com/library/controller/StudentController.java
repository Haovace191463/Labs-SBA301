package com.library.controller;

import com.library.entity.Student;
import com.library.service.IStudentService;
import com.library.service.StudentService;
import com.library.util.AlertUtil;
import javafx.beans.property.SimpleDoubleProperty;
import javafx.beans.property.SimpleLongProperty;
import javafx.beans.property.SimpleStringProperty;
import javafx.collections.FXCollections;
import javafx.collections.ObservableList;
import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.scene.control.*;
import javafx.scene.control.cell.PropertyValueFactory;
import javafx.stage.Stage;

import java.io.IOException;
import java.util.List;

public class StudentController {

    @FXML
    private TextField txtId;

    @FXML
    private TextField txtEmail;

    @FXML
    private PasswordField txtPassword;

    @FXML
    private TextField txtFirstName;

    @FXML
    private TextField txtLastName;

    @FXML
    private TextField txtMarks;

    @FXML
    private Button btnAdd;

    @FXML
    private Button btnUpdate;

    @FXML
    private Button btnDelete;

    @FXML
    private Button btnClear;

    @FXML
    private TableView<Student> tblStudents;

    @FXML
    private TableColumn<Student, Long> colId;

    @FXML
    private TableColumn<Student, String> colEmail;

    @FXML
    private TableColumn<Student, String> colFirst;

    @FXML
    private TableColumn<Student, String> colLast;

    @FXML
    private TableColumn<Student, Double> colMarks;

    private final IStudentService studentService;
    private final ObservableList<Student> studentList = FXCollections.observableArrayList();

    public StudentController() {
        this.studentService = new StudentService();
    }

    public StudentController(IStudentService studentService) {
        this.studentService = studentService;
    }

    @FXML
    public void initialize() {
        setupTableColumns();
        setupTableSelectionListener();
        loadStudents();
    }

    private void setupTableColumns() {
        colId.setCellValueFactory(new PropertyValueFactory<>("id"));
        colEmail.setCellValueFactory(new PropertyValueFactory<>("email"));
        colFirst.setCellValueFactory(new PropertyValueFactory<>("firstName"));
        colLast.setCellValueFactory(new PropertyValueFactory<>("lastName"));
        colMarks.setCellValueFactory(new PropertyValueFactory<>("marks"));

        tblStudents.setItems(studentList);
    }

    private void setupTableSelectionListener() {
        tblStudents.getSelectionModel().selectedItemProperty().addListener((obs, oldVal, newVal) -> {
            if (newVal != null) {
                populateForm(newVal);
            }
        });
    }

    public void loadStudents() {
        try {
            List<Student> students = studentService.getAllStudents();
            studentList.setAll(students);
        } catch (Exception e) {
            AlertUtil.showError("Database Error", "Failed to load students", e.getMessage());
        }
    }

    private void populateForm(Student student) {
        txtId.setText(student.getId() != null ? String.valueOf(student.getId()) : "");
        txtEmail.setText(student.getEmail() != null ? student.getEmail() : "");
        txtPassword.setText(student.getPassword() != null ? student.getPassword() : "");
        txtFirstName.setText(student.getFirstName() != null ? student.getFirstName() : "");
        txtLastName.setText(student.getLastName() != null ? student.getLastName() : "");
        txtMarks.setText(student.getMarks() != null ? String.valueOf(student.getMarks()) : "");
    }

    @FXML
    public void handleAddStudent(ActionEvent event) {
        try {
            Student student = parseFormData(false);
            Student saved = studentService.createStudent(student);
            AlertUtil.showInfo("Success", "Student Added", "Student " + saved.getEmail() + " successfully added.");
            loadStudents();
            handleClearForm(null);
        } catch (NumberFormatException e) {
            AlertUtil.showError("Input Error", "Invalid Marks", "Marks must be a valid number between 0.0 and 10.0.");
        } catch (IllegalArgumentException e) {
            AlertUtil.showWarning("Validation Error", "Cannot Add Student", e.getMessage());
        } catch (Exception e) {
            AlertUtil.showError("System Error", "Failed to add student", e.getMessage());
        }
    }

    @FXML
    public void handleUpdateStudent(ActionEvent event) {
        String idText = txtId.getText();
        if (idText == null || idText.isBlank()) {
            AlertUtil.showWarning("Selection Required", "No Student Selected", "Please select a student from the table to update.");
            return;
        }

        try {
            Student student = parseFormData(true);
            Student updated = studentService.updateStudent(student);
            AlertUtil.showInfo("Success", "Student Updated", "Student ID " + updated.getId() + " successfully updated.");
            loadStudents();
            // Reselect the updated student in the table
            selectStudentInTable(updated.getId());
        } catch (NumberFormatException e) {
            AlertUtil.showError("Input Error", "Invalid Marks", "Marks must be a valid number between 0.0 and 10.0.");
        } catch (IllegalArgumentException e) {
            AlertUtil.showWarning("Validation Error", "Cannot Update Student", e.getMessage());
        } catch (Exception e) {
            AlertUtil.showError("System Error", "Failed to update student", e.getMessage());
        }
    }

    @FXML
    public void handleDeleteStudent(ActionEvent event) {
        String idText = txtId.getText();
        if (idText == null || idText.isBlank()) {
            AlertUtil.showWarning("Selection Required", "No Student Selected", "Please select a student from the table to delete.");
            return;
        }

        try {
            Long studentId = Long.parseLong(idText.trim());
            boolean confirmed = AlertUtil.showConfirmation(
                    "Confirm Deletion",
                    "Delete Student ID: " + studentId,
                    "Are you sure you want to delete this student? This action cannot be undone."
            );

            if (confirmed) {
                studentService.deleteStudent(studentId);
                AlertUtil.showInfo("Deleted", "Student Removed", "Student ID " + studentId + " was deleted.");
                loadStudents();
                handleClearForm(null);
            }
        } catch (IllegalArgumentException e) {
            AlertUtil.showWarning("Delete Error", "Cannot Delete", e.getMessage());
        } catch (Exception e) {
            AlertUtil.showError("System Error", "Failed to delete student", e.getMessage());
        }
    }

    @FXML
    public void handleClearForm(ActionEvent event) {
        txtId.clear();
        txtEmail.clear();
        txtPassword.clear();
        txtFirstName.clear();
        txtLastName.clear();
        txtMarks.clear();
        tblStudents.getSelectionModel().clearSelection();
    }

    @FXML
    public void handleRefresh(ActionEvent event) {
        loadStudents();
    }

    @FXML
    public void handleLogout(ActionEvent event) {
        try {
            FXMLLoader loader = new FXMLLoader(getClass().getResource("/fxml/LoginGUI.fxml"));
            Parent root = loader.load();

            Stage stage = (Stage) tblStudents.getScene().getWindow();
            Scene scene = new Scene(root);
            stage.setTitle("Library Management System - Login");
            stage.setScene(scene);
            stage.centerOnScreen();
            stage.show();
        } catch (IOException e) {
            AlertUtil.showError("Navigation Error", "Could not return to Login", e.getMessage());
        }
    }

    private Student parseFormData(boolean isUpdate) {
        String email = txtEmail.getText() != null ? txtEmail.getText().trim() : "";
        String firstName = txtFirstName.getText() != null ? txtFirstName.getText().trim() : "";
        String lastName = txtLastName.getText() != null ? txtLastName.getText().trim() : "";
        String password = txtPassword.getText() != null ? txtPassword.getText().trim() : "";
        String marksText = txtMarks.getText() != null ? txtMarks.getText().trim() : "";

        if (marksText.isEmpty()) {
            throw new IllegalArgumentException("Marks cannot be empty.");
        }

        Double marks = Double.parseDouble(marksText);

        Student student = new Student();
        if (isUpdate) {
            student.setId(Long.parseLong(txtId.getText().trim()));
        }
        student.setEmail(email);
        student.setFirstName(firstName);
        student.setLastName(lastName);
        student.setPassword(password);
        student.setMarks(marks);

        return student;
    }

    private void selectStudentInTable(Long studentId) {
        for (Student s : tblStudents.getItems()) {
            if (s.getId().equals(studentId)) {
                tblStudents.getSelectionModel().select(s);
                tblStudents.scrollTo(s);
                break;
            }
        }
    }
}
