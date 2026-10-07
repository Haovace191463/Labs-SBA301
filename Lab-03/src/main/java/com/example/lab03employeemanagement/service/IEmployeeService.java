package com.example.lab03employeemanagement.service;

import com.example.lab03employeemanagement.dto.PagedResponse;
import com.example.lab03employeemanagement.model.Employee;

import java.util.List;

public interface IEmployeeService {
    List<Employee> getAllEmployees();
    PagedResponse<Employee> getAllEmployees(int page, int size, String sortBy, String direction);
    Employee getEmployeeById(Long id);
    Employee createEmployee(Employee employee);
    Employee updateEmployee(Long id, Employee employee);
    void deleteEmployee(Long id);
}
