package com.example.lab03employeemanagement.service;

import com.example.lab03employeemanagement.dto.PagedResponse;
import com.example.lab03employeemanagement.exception.EmployeeNotFoundException;
import com.example.lab03employeemanagement.model.Employee;
import com.example.lab03employeemanagement.repository.IEmployeeRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

@Service
public class EmployeeService implements IEmployeeService {

    private final IEmployeeRepository employeeRepository;

    public EmployeeService(IEmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    @Override
    public List<Employee> getAllEmployees() {
        return employeeRepository.findAll();
    }

    @Override
    public PagedResponse<Employee> getAllEmployees(int page, int size, String sortBy, String direction) {
        if (page < 0) {
            page = 0;
        }
        if (size <= 0) {
            size = 10;
        }

        List<Employee> allEmployees = new ArrayList<>(employeeRepository.findAll());

        Comparator<Employee> comparator = resolveComparator(sortBy);
        if ("desc".equalsIgnoreCase(direction)) {
            comparator = comparator.reversed();
        }
        allEmployees.sort(comparator);

        long totalElements = allEmployees.size();
        int totalPages = totalElements == 0 ? 0 : (int) Math.ceil((double) totalElements / size);

        int fromIndex = page * size;
        List<Employee> content;
        if (fromIndex >= totalElements) {
            content = Collections.emptyList();
        } else {
            int toIndex = (int) Math.min(fromIndex + size, totalElements);
            content = new ArrayList<>(allEmployees.subList(fromIndex, toIndex));
        }

        return new PagedResponse<>(content, page, size, totalElements, totalPages);
    }

    @Override
    public Employee getEmployeeById(Long id) {
        return employeeRepository.findById(id)
                .orElseThrow(() -> new EmployeeNotFoundException(id));
    }

    @Override
    public Employee createEmployee(Employee employee) {
        return employeeRepository.save(employee);
    }

    @Override
    public Employee updateEmployee(Long id, Employee employee) {
        if (!employeeRepository.existsById(id)) {
            throw new EmployeeNotFoundException(id);
        }
        return employeeRepository.update(id, employee);
    }

    @Override
    public void deleteEmployee(Long id) {
        if (!employeeRepository.existsById(id)) {
            throw new EmployeeNotFoundException(id);
        }
        employeeRepository.delete(id);
    }

    private Comparator<Employee> resolveComparator(String sortBy) {
        String normalized = (sortBy != null) ? sortBy.trim().toLowerCase() : "id";
        return switch (normalized) {
            case "name" -> Comparator.comparing(Employee::getName, Comparator.nullsLast(String.CASE_INSENSITIVE_ORDER));
            case "email" -> Comparator.comparing(Employee::getEmail, Comparator.nullsLast(String.CASE_INSENSITIVE_ORDER));
            case "department" -> Comparator.comparing(Employee::getDepartment, Comparator.nullsLast(String.CASE_INSENSITIVE_ORDER));
            case "salary" -> Comparator.comparing(Employee::getSalary, Comparator.nullsLast(Double::compareTo));
            default -> Comparator.comparing(Employee::getId, Comparator.nullsLast(Long::compareTo));
        };
    }
}
