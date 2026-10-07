package com.example.lab03employeemanagement.repository;

import com.example.lab03employeemanagement.model.Employee;
import java.util.List;
import java.util.Optional;

public interface IEmployeeRepository {
    List<Employee> findAll();
    Optional<Employee> findById(Long id);
    Employee save(Employee employee);
    Employee update(Long id, Employee employee);
    boolean delete(Long id);
    boolean existsById(Long id);
    List<Employee> findWithPagination(int page, int size);
    int count();
    void resetData();
}
