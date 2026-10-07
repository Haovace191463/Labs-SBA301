package com.example.lab03employeemanagement.repository;

import com.example.lab03employeemanagement.model.Employee;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicLong;

@Repository
public class EmployeeRepository implements IEmployeeRepository {

    private final List<Employee> employees = new ArrayList<>();
    private final AtomicLong idSequence = new AtomicLong(0);

    public EmployeeRepository() {
        initSampleData();
    }

    private void initSampleData() {
        employees.clear();
        idSequence.set(0);

        save(new Employee("Alice Smith", "alice.smith@example.com", "Engineering", 75000.0));
        save(new Employee("Bob Jones", "bob.jones@example.com", "Marketing", 55000.0));
        save(new Employee("Charlie Brown", "charlie.brown@example.com", "Human Resources", 60000.0));
        save(new Employee("Diana Prince", "diana.prince@example.com", "Engineering", 85000.0));
        save(new Employee("Evan Wright", "evan.wright@example.com", "Finance", 68000.0));
    }

    @Override
    public List<Employee> findAll() {
        return new ArrayList<>(employees);
    }

    @Override
    public Optional<Employee> findById(Long id) {
        if (id == null) {
            return Optional.empty();
        }
        return employees.stream()
                .filter(emp -> id.equals(emp.getId()))
                .findFirst();
    }

    @Override
    public Employee save(Employee employee) {
        if (employee.getId() == null) {
            employee.setId(idSequence.incrementAndGet());
        } else {
            if (employee.getId() > idSequence.get()) {
                idSequence.set(employee.getId());
            }
            employees.removeIf(emp -> employee.getId().equals(emp.getId()));
        }
        employees.add(employee);
        return employee;
    }

    @Override
    public Employee update(Long id, Employee employee) {
        Optional<Employee> existingOpt = findById(id);
        if (existingOpt.isPresent()) {
            Employee existing = existingOpt.get();
            existing.setName(employee.getName());
            existing.setEmail(employee.getEmail());
            existing.setDepartment(employee.getDepartment());
            existing.setSalary(employee.getSalary());
            return existing;
        }
        return null;
    }

    @Override
    public boolean delete(Long id) {
        if (id == null) {
            return false;
        }
        return employees.removeIf(emp -> id.equals(emp.getId()));
    }

    @Override
    public boolean existsById(Long id) {
        if (id == null) {
            return false;
        }
        return employees.stream().anyMatch(emp -> id.equals(emp.getId()));
    }

    @Override
    public List<Employee> findWithPagination(int page, int size) {
        if (page < 0) {
            page = 0;
        }
        if (size <= 0) {
            size = 10;
        }
        int fromIndex = page * size;
        if (fromIndex >= employees.size()) {
            return Collections.emptyList();
        }
        int toIndex = Math.min(fromIndex + size, employees.size());
        return new ArrayList<>(employees.subList(fromIndex, toIndex));
    }

    @Override
    public int count() {
        return employees.size();
    }

    @Override
    public void resetData() {
        initSampleData();
    }
}
