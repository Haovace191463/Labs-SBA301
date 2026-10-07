package com.example.lab03employeemanagement.repository;

import com.example.lab03employeemanagement.model.Employee;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

class EmployeeRepositoryTest {

    private EmployeeRepository employeeRepository;

    @BeforeEach
    void setUp() {
        employeeRepository = new EmployeeRepository();
        employeeRepository.resetData();
    }

    @Test
    @DisplayName("findAll - returns all initial sample employees")
    void findAll_returnsInitialEmployees() {
        List<Employee> all = employeeRepository.findAll();
        assertEquals(5, all.size());
    }

    @Test
    @DisplayName("findById - when employee exists returns employee")
    void findById_whenEmployeeExists_returnsEmployee() {
        Optional<Employee> found = employeeRepository.findById(1L);

        assertTrue(found.isPresent());
        assertEquals(1L, found.get().getId());
        assertEquals("Alice Smith", found.get().getName());
    }

    @Test
    @DisplayName("findById - when employee does not exist returns empty Optional")
    void findById_whenEmployeeDoesNotExist_returnsEmpty() {
        Optional<Employee> found = employeeRepository.findById(999L);

        assertFalse(found.isPresent());
    }

    @Test
    @DisplayName("save - creates employee and auto-generates sequential ID")
    void save_whenNewEmployee_assignsGeneratedIdAndStores() {
        Employee newEmployee = new Employee("Frank Miller", "frank@example.com", "Sales", 62000.0);
        Employee saved = employeeRepository.save(newEmployee);

        assertNotNull(saved.getId());
        assertEquals(6L, saved.getId());
        assertEquals(6, employeeRepository.count());

        Optional<Employee> found = employeeRepository.findById(6L);
        assertTrue(found.isPresent());
        assertEquals("Frank Miller", found.get().getName());
    }

    @Test
    @DisplayName("update - when employee exists updates fields and returns updated employee")
    void update_whenEmployeeExists_updatesAndReturnsEmployee() {
        Employee updateData = new Employee("Alice Wonderland", "alice.w@example.com", "Design", 92000.0);
        Employee updated = employeeRepository.update(1L, updateData);

        assertNotNull(updated);
        assertEquals(1L, updated.getId());
        assertEquals("Alice Wonderland", updated.getName());
        assertEquals("alice.w@example.com", updated.getEmail());
        assertEquals("Design", updated.getDepartment());
        assertEquals(92000.0, updated.getSalary());

        Optional<Employee> fetched = employeeRepository.findById(1L);
        assertTrue(fetched.isPresent());
        assertEquals("Alice Wonderland", fetched.get().getName());
    }

    @Test
    @DisplayName("update - when employee does not exist returns null")
    void update_whenEmployeeDoesNotExist_returnsNull() {
        Employee updateData = new Employee("Non Existent", "none@example.com", "None", 10000.0);
        Employee updated = employeeRepository.update(999L, updateData);

        assertNull(updated);
    }

    @Test
    @DisplayName("delete - when employee exists removes from repository and returns true")
    void delete_whenEmployeeExists_removesEmployeeAndReturnsTrue() {
        boolean deleted = employeeRepository.delete(1L);

        assertTrue(deleted);
        assertEquals(4, employeeRepository.count());
        assertFalse(employeeRepository.findById(1L).isPresent());
    }

    @Test
    @DisplayName("delete - when employee does not exist returns false")
    void delete_whenEmployeeDoesNotExist_returnsFalse() {
        boolean deleted = employeeRepository.delete(999L);

        assertFalse(deleted);
        assertEquals(5, employeeRepository.count());
    }

    @Test
    @DisplayName("existsById - returns true if employee exists, false otherwise")
    void existsById_returnsCorrectBoolean() {
        assertTrue(employeeRepository.existsById(1L));
        assertFalse(employeeRepository.existsById(999L));
    }

    @Test
    @DisplayName("findWithPagination - slices ArrayList accurately according to page and size")
    void findWithPagination_slicesCorrectly() {
        // 5 initial employees: page 0 size 2 -> 2 employees (ids 1, 2)
        List<Employee> page0 = employeeRepository.findWithPagination(0, 2);
        assertEquals(2, page0.size());
        assertEquals(1L, page0.get(0).getId());
        assertEquals(2L, page0.get(1).getId());

        // page 1 size 2 -> 2 employees (ids 3, 4)
        List<Employee> page1 = employeeRepository.findWithPagination(1, 2);
        assertEquals(2, page1.size());
        assertEquals(3L, page1.get(0).getId());
        assertEquals(4L, page1.get(1).getId());

        // page 2 size 2 -> 1 employee (id 5)
        List<Employee> page2 = employeeRepository.findWithPagination(2, 2);
        assertEquals(1, page2.size());
        assertEquals(5L, page2.get(0).getId());

        // out of bounds page -> empty list
        List<Employee> page3 = employeeRepository.findWithPagination(3, 2);
        assertTrue(page3.isEmpty());
    }
}
