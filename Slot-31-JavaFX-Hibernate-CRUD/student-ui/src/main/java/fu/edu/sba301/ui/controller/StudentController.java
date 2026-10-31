package fu.edu.sba301.ui.controller;

import fu.edu.sba301.core.domain.Student;
import fu.edu.sba301.core.service.IStudentService;
import fu.edu.sba301.core.service.StudentServiceException;
import javafx.beans.property.ReadOnlyObjectWrapper;
import javafx.beans.property.ReadOnlyStringWrapper;
import javafx.collections.FXCollections;
import javafx.collections.ObservableList;
import javafx.collections.transformation.FilteredList;
import javafx.concurrent.Task;
import javafx.fxml.FXML;
import javafx.scene.control.Alert;
import javafx.scene.control.Button;
import javafx.scene.control.ButtonType;
import javafx.scene.control.Label;
import javafx.scene.control.ProgressIndicator;
import javafx.scene.control.TableColumn;
import javafx.scene.control.TableView;
import javafx.scene.control.TextField;

import java.util.List;
import java.util.Locale;
import java.util.regex.Pattern;

public final class StudentController {
    private static final Pattern EMAIL = Pattern.compile("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$");

    @FXML private TextField txtEmail;
    @FXML private TextField txtFirstName;
    @FXML private TextField txtLastName;
    @FXML private TextField txtMarks;
    @FXML private TextField txtSearch;
    @FXML private TableView<Student> tblStudents;
    @FXML private TableColumn<Student, Long> colId;
    @FXML private TableColumn<Student, String> colEmail;
    @FXML private TableColumn<Student, String> colFirstName;
    @FXML private TableColumn<Student, String> colLastName;
    @FXML private TableColumn<Student, Double> colMarks;
    @FXML private Label lblStatus;
    @FXML private Label lblSelection;
    @FXML private ProgressIndicator progressLoading;
    @FXML private Button btnAsyncRefresh;

    private final ObservableList<Student> data = FXCollections.observableArrayList();
    private final FilteredList<Student> filteredData = new FilteredList<>(data, ignored -> true);
    private IStudentService studentService;
    private Long selectedStudentId;

    @FXML
    private void initialize() {
        // Explicit factories are type-safe and do not need reflective property lookup.
        colId.setCellValueFactory(cell -> new ReadOnlyObjectWrapper<>(cell.getValue().getId()));
        colEmail.setCellValueFactory(cell -> new ReadOnlyStringWrapper(cell.getValue().getEmail()));
        colFirstName.setCellValueFactory(cell -> new ReadOnlyStringWrapper(cell.getValue().getFirstName()));
        colLastName.setCellValueFactory(cell -> new ReadOnlyStringWrapper(cell.getValue().getLastName()));
        colMarks.setCellValueFactory(cell -> new ReadOnlyObjectWrapper<>(cell.getValue().getMarks()));
        tblStudents.setItems(filteredData);

        tblStudents.getSelectionModel().selectedItemProperty()
                .addListener((observable, oldValue, selected) -> populateForm(selected));
        txtSearch.textProperty().addListener((observable, oldValue, keyword) -> applyFilter(keyword));
        progressLoading.setVisible(false);
        updateStatus("Sẵn sàng");
    }

    /** Composition root calls this after FXMLLoader has injected every @FXML field. */
    public void setStudentService(IStudentService studentService) {
        if (studentService == null) throw new IllegalArgumentException("studentService is required");
        this.studentService = studentService;
        refreshTable();
    }

    @FXML
    private void handleCreate() {
        if (!ensureServiceReady()) return;
        try {
            Student created = studentService.create(readForm());
            refreshTable();
            clearForm();
            showInfo("Đã tạo sinh viên ID " + created.getId() + ".");
        } catch (IllegalArgumentException | StudentServiceException ex) {
            showError(ex.getMessage());
        } catch (RuntimeException ex) {
            reportUnexpected("Không thể tạo sinh viên.", ex);
        }
    }

    @FXML
    private void handleUpdate() {
        if (!ensureServiceReady() || !ensureSelected()) return;
        try {
            long id = selectedStudentId;
            studentService.update(id, readForm());
            refreshTable();
            clearForm();
            showInfo("Đã cập nhật sinh viên ID " + id + ".");
        } catch (IllegalArgumentException | StudentServiceException ex) {
            showError(ex.getMessage());
        } catch (RuntimeException ex) {
            reportUnexpected("Không thể cập nhật sinh viên.", ex);
        }
    }

    @FXML
    private void handleDelete() {
        if (!ensureServiceReady() || !ensureSelected()) return;
        Student selected = tblStudents.getSelectionModel().getSelectedItem();
        String description = selected == null ? "ID " + selectedStudentId : selected.getFullName();
        if (!confirm("Xóa sinh viên " + description + "?")) return;
        try {
            studentService.delete(selectedStudentId);
            refreshTable();
            clearForm();
            showInfo("Đã xóa sinh viên.");
        } catch (StudentServiceException ex) {
            showError(ex.getMessage());
        } catch (RuntimeException ex) {
            reportUnexpected("Không thể xóa sinh viên.", ex);
        }
    }

    @FXML
    private void handleClear() {
        clearForm();
        updateStatus("Đã làm trống biểu mẫu");
    }

    @FXML
    private void handleRefresh() {
        if (!ensureServiceReady()) return;
        refreshTable();
    }

    @FXML
    private void handleAsyncRefresh() {
        if (!ensureServiceReady()) return;
        setLoading(true);
        Task<List<Student>> task = new Task<>() {
            @Override
            protected List<Student> call() {
                return studentService.getAll();
            }
        };
        task.setOnSucceeded(event -> {
            data.setAll(task.getValue()); // Runs on JavaFX Application Thread.
            clearForm();
            setLoading(false);
            updateStatus("Tải nền hoàn tất: " + data.size() + " sinh viên");
        });
        task.setOnFailed(event -> {
            setLoading(false);
            reportUnexpected("Không thể tải danh sách sinh viên.", task.getException());
        });
        Thread worker = new Thread(task, "student-refresh-worker");
        worker.setDaemon(true);
        worker.start();
    }

    private void refreshTable() {
        try {
            data.setAll(studentService.getAll());
            updateStatus("Đã tải " + data.size() + " sinh viên");
        } catch (RuntimeException ex) {
            reportUnexpected("Không thể tải danh sách sinh viên.", ex);
        }
    }

    private Student readForm() {
        String email = txtEmail.getText().trim();
        String firstName = txtFirstName.getText().trim();
        String lastName = txtLastName.getText().trim();
        String marksText = txtMarks.getText().trim();
        if (email.isBlank() || firstName.isBlank() || lastName.isBlank() || marksText.isBlank()) {
            throw new IllegalArgumentException("Vui lòng nhập đầy đủ email, họ, tên và điểm.");
        }
        if (!EMAIL.matcher(email).matches()) throw new IllegalArgumentException("Email không đúng định dạng.");
        double marks;
        try {
            marks = Double.parseDouble(marksText);
        } catch (NumberFormatException ex) {
            throw new IllegalArgumentException("Điểm phải là một số.");
        }
        if (!Double.isFinite(marks) || marks < 0 || marks > 10) {
            throw new IllegalArgumentException("Điểm phải nằm trong khoảng 0 đến 10.");
        }
        return new Student(email, firstName, lastName, marks);
    }

    private void populateForm(Student student) {
        if (student == null) {
            selectedStudentId = null;
            lblSelection.setText("Chưa chọn dòng");
            return;
        }
        selectedStudentId = student.getId();
        txtEmail.setText(student.getEmail());
        txtFirstName.setText(student.getFirstName());
        txtLastName.setText(student.getLastName());
        txtMarks.setText(Double.toString(student.getMarks()));
        lblSelection.setText("Đang chọn ID: " + selectedStudentId);
    }

    private void clearForm() {
        selectedStudentId = null;
        txtEmail.clear();
        txtFirstName.clear();
        txtLastName.clear();
        txtMarks.clear();
        tblStudents.getSelectionModel().clearSelection();
        lblSelection.setText("Chưa chọn dòng");
        txtEmail.requestFocus();
    }

    private void applyFilter(String keyword) {
        String needle = keyword == null ? "" : keyword.trim().toLowerCase(Locale.ROOT);
        filteredData.setPredicate(student -> needle.isEmpty()
                || student.getEmail().toLowerCase(Locale.ROOT).contains(needle)
                || student.getFullName().toLowerCase(Locale.ROOT).contains(needle)
                || String.valueOf(student.getId()).contains(needle));
        updateStatus("Đang hiển thị " + filteredData.size() + "/" + data.size() + " sinh viên");
    }

    private boolean ensureSelected() {
        if (selectedStudentId != null) return true;
        showError("Hãy chọn một sinh viên trong bảng trước.");
        return false;
    }

    private boolean ensureServiceReady() {
        if (studentService != null) return true;
        showError("Service chưa được khởi tạo.");
        return false;
    }

    private void setLoading(boolean loading) {
        progressLoading.setVisible(loading);
        btnAsyncRefresh.setDisable(loading);
        updateStatus(loading ? "Đang tải dữ liệu ở background thread..." : "Sẵn sàng");
    }

    private void updateStatus(String message) {
        lblStatus.setText(message);
    }

    private void showInfo(String message) {
        showAlert(Alert.AlertType.INFORMATION, "Thành công", message);
    }

    private void showError(String message) {
        showAlert(Alert.AlertType.ERROR, "Thao tác thất bại", message);
    }

    private void showAlert(Alert.AlertType type, String title, String message) {
        Alert alert = new Alert(type);
        alert.setTitle(title);
        alert.setHeaderText(null);
        alert.setContentText(message);
        alert.showAndWait();
    }

    private boolean confirm(String message) {
        Alert alert = new Alert(Alert.AlertType.CONFIRMATION, message, ButtonType.YES, ButtonType.NO);
        alert.setTitle("Xác nhận xóa");
        alert.setHeaderText("Thao tác này không thể hoàn tác");
        return alert.showAndWait().orElse(ButtonType.NO) == ButtonType.YES;
    }

    private void reportUnexpected(String friendlyMessage, Throwable error) {
        error.printStackTrace(); // Diagnostic detail stays in the developer console, not the UI.
        updateStatus(friendlyMessage);
        showError(friendlyMessage);
    }
}
