package com.library.service;

import com.library.entity.Student;
import com.library.repository.IStudentRepository;
import com.library.repository.StudentRepository;

import java.util.List;
import java.util.regex.Pattern;

public class StudentService implements IStudentService {

    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$");
    private final IStudentRepository studentRepository;

    public StudentService() {
        this.studentRepository = new StudentRepository();
    }

    public StudentService(IStudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    @Override
    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    @Override
    public Student getStudentById(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("Student ID cannot be null.");
        }
        return studentRepository.findById(id);
    }

    @Override
    public Student getStudentByEmail(String email) {
        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException("Email cannot be empty.");
        }
        return studentRepository.findByEmail(email.trim());
    }

    @Override
    public Student createStudent(Student student) {
        validateStudent(student);

        // Check unique email
        Student existing = studentRepository.findByEmail(student.getEmail().trim());
        if (existing != null) {
            throw new IllegalArgumentException("A student with email '" + student.getEmail() + "' already exists.");
        }

        return studentRepository.save(student);
    }

    @Override
    public Student updateStudent(Student student) {
        if (student == null || student.getId() == null) {
            throw new IllegalArgumentException("Cannot update: Student ID must not be null.");
        }

        Student existingById = studentRepository.findById(student.getId());
        if (existingById == null) {
            throw new IllegalArgumentException("Student with ID " + student.getId() + " not found.");
        }

        validateStudent(student);

        // Check if email belongs to another student
        Student existingByEmail = studentRepository.findByEmail(student.getEmail().trim());
        if (existingByEmail != null && !existingByEmail.getId().equals(student.getId())) {
            throw new IllegalArgumentException("Email '" + student.getEmail() + "' is already in use by another student.");
        }

        // If password is blank in update, preserve existing password if needed
        if (student.getPassword() == null || student.getPassword().isBlank()) {
            student.setPassword(existingById.getPassword());
        }

        return studentRepository.update(student);
    }

    @Override
    public boolean deleteStudent(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("Cannot delete: Student ID cannot be null.");
        }
        Student existing = studentRepository.findById(id);
        if (existing == null) {
            throw new IllegalArgumentException("Student with ID " + id + " does not exist.");
        }
        return studentRepository.deleteById(id);
    }

    @Override
    public Student authenticate(String email, String password) {
        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException("Email cannot be empty.");
        }
        if (password == null || password.isBlank()) {
            throw new IllegalArgumentException("Password cannot be empty.");
        }

        Student student = studentRepository.findByEmail(email.trim());
        if (student == null) {
            return null; // Student not found
        }

        // If student exists but has no password yet (e.g. initial DB state), initialize with entered password
        String storedPassword = student.getPassword();
        if (storedPassword == null || storedPassword.isBlank()) {
            student.setPassword(password);
            studentRepository.update(student);
            return student;
        }

        // Verify existing password
        if (storedPassword.equals(password)) {
            return student;
        }

        return null; // Invalid password
    }

    @Override
    public boolean setTestPasswordIfEmpty(String email, String defaultPassword) {
        if (email == null || email.isBlank() || defaultPassword == null || defaultPassword.isBlank()) {
            return false;
        }
        Student student = studentRepository.findByEmail(email.trim());
        if (student != null && (student.getPassword() == null || student.getPassword().isBlank())) {
            student.setPassword(defaultPassword);
            studentRepository.update(student);
            return true;
        }
        return false;
    }

    private void validateStudent(Student student) {
        if (student == null) {
            throw new IllegalArgumentException("Student data cannot be null.");
        }
        if (student.getEmail() == null || student.getEmail().trim().isEmpty()) {
            throw new IllegalArgumentException("Email is required.");
        }
        if (!EMAIL_PATTERN.matcher(student.getEmail().trim()).matches()) {
            throw new IllegalArgumentException("Invalid email format. Example: student@fu.edu.vn");
        }
        if (student.getFirstName() == null || student.getFirstName().trim().isEmpty()) {
            throw new IllegalArgumentException("First name is required.");
        }
        if (student.getLastName() == null || student.getLastName().trim().isEmpty()) {
            throw new IllegalArgumentException("Last name is required.");
        }
        if (student.getMarks() == null) {
            throw new IllegalArgumentException("Marks are required.");
        }
        if (student.getMarks() < 0.0 || student.getMarks() > 10.0) {
            throw new IllegalArgumentException("Marks must be between 0.0 and 10.0.");
        }
    }
}
