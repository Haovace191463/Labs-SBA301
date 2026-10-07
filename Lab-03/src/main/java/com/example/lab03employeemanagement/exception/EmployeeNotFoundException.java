package com.example.lab03employeemanagement.exception;

public class EmployeeNotFoundException extends RuntimeException {

    public EmployeeNotFoundException(String message) {
        super(message);
    }

    public EmployeeNotFoundException(Long id) {
        super("Employee not found with id: " + id);
    }
}
