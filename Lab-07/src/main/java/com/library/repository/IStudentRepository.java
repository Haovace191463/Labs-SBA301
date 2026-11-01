package com.library.repository;

import com.library.entity.Student;
import java.util.List;

public interface IStudentRepository {
    Student save(Student student);
    List<Student> findAll();
    Student findById(Long id);
    Student findByEmail(String email);
    Student update(Student student);
    boolean deleteById(Long id);
}
