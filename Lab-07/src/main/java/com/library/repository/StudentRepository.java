package com.library.repository;

import com.library.dao.StudentDAO;
import com.library.entity.Student;

import java.util.List;

public class StudentRepository implements IStudentRepository {

    private final StudentDAO studentDAO;

    public StudentRepository() {
        this.studentDAO = new StudentDAO();
    }

    public StudentRepository(StudentDAO studentDAO) {
        this.studentDAO = studentDAO;
    }

    @Override
    public Student save(Student student) {
        return studentDAO.save(student);
    }

    @Override
    public List<Student> findAll() {
        return studentDAO.findAll();
    }

    @Override
    public Student findById(Long id) {
        return studentDAO.findById(id);
    }

    @Override
    public Student findByEmail(String email) {
        return studentDAO.findByEmail(email);
    }

    @Override
    public Student update(Student student) {
        return studentDAO.update(student);
    }

    @Override
    public boolean deleteById(Long id) {
        return studentDAO.delete(id);
    }
}
