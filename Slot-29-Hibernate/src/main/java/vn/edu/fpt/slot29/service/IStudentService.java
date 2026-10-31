package vn.edu.fpt.slot29.service;

import vn.edu.fpt.slot29.domain.Student;
import java.util.List;
import java.util.Optional;

public interface IStudentService {
    List<Student> getStudents();
    Student getStudent(Long id);
    Optional<Student> findStudentByEmail(String email);
    Student createStudent(Student student);
    Student updateStudent(Student student);
    void deleteStudent(Long id);
    void borrowBook(Long studentId, Long bookId);
    void returnBook(Long studentId, Long bookId);
    List<Student> findStudentsByBook(Long bookId);
    void borrowBooksAtomically(Long studentId, List<Long> bookIds);
}
