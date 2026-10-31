package fu.edu.sba301.core.service;

import fu.edu.sba301.core.domain.Student;
import fu.edu.sba301.core.repository.StudentRepository;

import java.util.List;
import java.util.Locale;
import java.util.Optional;
import java.util.regex.Pattern;

public final class StudentService implements IStudentService {
    private static final Pattern EMAIL = Pattern.compile("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$");
    private final StudentRepository repository;

    public StudentService(StudentRepository repository) {
        this.repository = repository;
    }

    @Override
    public List<Student> getAll() {
        return repository.findAll();
    }

    @Override
    public Optional<Student> getById(long id) {
        if (id <= 0) return Optional.empty();
        return repository.findById(id);
    }

    @Override
    public Student create(Student student) {
        Student normalized = validateAndNormalize(student);
        rejectDuplicateEmail(normalized.getEmail(), null);
        try {
            return repository.save(normalized);
        } catch (RuntimeException ex) {
            throw new StudentServiceException("Không thể tạo sinh viên. Vui lòng thử lại.", ex);
        }
    }

    @Override
    public Student update(long id, Student student) {
        if (id <= 0) throw new StudentServiceException("Mã sinh viên không hợp lệ.");
        Student normalized = validateAndNormalize(student);
        rejectDuplicateEmail(normalized.getEmail(), id);
        try {
            Student updated = repository.update(id, normalized);
            if (updated == null) throw new StudentServiceException("Không tìm thấy sinh viên có ID " + id + ".");
            return updated;
        } catch (StudentServiceException ex) {
            throw ex;
        } catch (RuntimeException ex) {
            throw new StudentServiceException("Không thể cập nhật sinh viên. Vui lòng thử lại.", ex);
        }
    }

    @Override
    public void delete(long id) {
        if (id <= 0) throw new StudentServiceException("Mã sinh viên không hợp lệ.");
        try {
            if (!repository.deleteById(id)) {
                throw new StudentServiceException("Không tìm thấy sinh viên có ID " + id + ".");
            }
        } catch (StudentServiceException ex) {
            throw ex;
        } catch (RuntimeException ex) {
            throw new StudentServiceException("Không thể xóa sinh viên. Vui lòng thử lại.", ex);
        }
    }

    private Student validateAndNormalize(Student student) {
        if (student == null) throw new StudentServiceException("Dữ liệu sinh viên không được để trống.");
        String email = clean(student.getEmail()).toLowerCase(Locale.ROOT);
        String firstName = clean(student.getFirstName());
        String lastName = clean(student.getLastName());
        if (!EMAIL.matcher(email).matches()) throw new StudentServiceException("Email không đúng định dạng.");
        if (firstName.isBlank() || lastName.isBlank()) throw new StudentServiceException("Họ và tên không được để trống.");
        if (firstName.length() > 80 || lastName.length() > 80) throw new StudentServiceException("Mỗi phần họ tên tối đa 80 ký tự.");
        if (!Double.isFinite(student.getMarks()) || student.getMarks() < 0 || student.getMarks() > 10) {
            throw new StudentServiceException("Điểm phải nằm trong khoảng 0 đến 10.");
        }
        return new Student(email, firstName, lastName, student.getMarks());
    }

    private void rejectDuplicateEmail(String email, Long currentId) {
        repository.findByEmail(email).ifPresent(existing -> {
            if (currentId == null || !currentId.equals(existing.getId())) {
                throw new StudentServiceException("Email đã tồn tại: " + email);
            }
        });
    }

    private String clean(String value) {
        return value == null ? "" : value.trim().replaceAll("\\s+", " ");
    }
}
