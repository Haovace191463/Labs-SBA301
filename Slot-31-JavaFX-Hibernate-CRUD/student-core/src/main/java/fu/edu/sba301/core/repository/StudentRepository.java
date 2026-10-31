package fu.edu.sba301.core.repository;

import fu.edu.sba301.core.domain.Student;

import java.util.List;
import java.util.Optional;

public interface StudentRepository {
    List<Student> findAll();
    Optional<Student> findById(long id);
    Optional<Student> findByEmail(String email);
    Student save(Student student);
    Student update(long id, Student values);
    boolean deleteById(long id);
}
