package com.library.service;

import com.library.entity.Student;
import java.util.List;

public interface IStudentService {
    List<Student> getAllStudents();
    Student getStudentById(Long id);
    Student getStudentByEmail(String email);
    Student createStudent(Student student);
    Student updateStudent(Student student);
    boolean deleteStudent(Long id);
    Student authenticate(String email, String password);
    boolean setTestPasswordIfEmpty(String email, String defaultPassword);
}
