package fu.edu.sba301.core.service;

import fu.edu.sba301.core.domain.Student;

import java.util.List;
import java.util.Optional;

public interface IStudentService {
    List<Student> getAll();
    Optional<Student> getById(long id);
    Student create(Student student);
    Student update(long id, Student student);
    void delete(long id);
}
