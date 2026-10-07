package com.example.lab03employeemanagement.service;

import com.example.lab03employeemanagement.dto.PagedResponse;
import com.example.lab03employeemanagement.exception.EmployeeNotFoundException;
import com.example.lab03employeemanagement.model.Employee;
import com.example.lab03employeemanagement.repository.IEmployeeRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EmployeeServiceUnitTest {

    @Mock
    private IEmployeeRepository employeeRepository;

    @InjectMocks
    private EmployeeService employeeService;

    @Test
    @DisplayName("getEmployeeById - when employee exists returns employee")
    void getEmployeeById_whenEmployeeExists_returnsEmployee() {
        Employee employee = new Employee(1L, "Alice Smith", "alice.smith@example.com", "Engineering", 75000.0);
        when(employeeRepository.findById(1L)).thenReturn(Optional.of(employee));

        Employee result = employeeService.getEmployeeById(1L);

        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("Alice Smith", result.getName());
        assertEquals("alice.smith@example.com", result.getEmail());
        assertEquals("Engineering", result.getDepartment());
        assertEquals(75000.0, result.getSalary());
        verify(employeeRepository).findById(1L);
    }

    @Test
    @DisplayName("getEmployeeById - when employee does not exist throws EmployeeNotFoundException")
    void getEmployeeById_whenEmployeeDoesNotExist_throwsException() {
        when(employeeRepository.findById(999L)).thenReturn(Optional.empty());

        EmployeeNotFoundException exception = assertThrows(
                EmployeeNotFoundException.class,
                () -> employeeService.getEmployeeById(999L)
        );

        assertEquals("Employee not found with id: 999", exception.getMessage());
        verify(employeeRepository).findById(999L);
    }

    @Test
    @DisplayName("createEmployee - saves and returns created employee")
    void createEmployee_whenValidRequest_returnsCreatedEmployee() {
        Employee input = new Employee(null, "Charlie Brown", "charlie@example.com", "HR", 60000.0);
        Employee saved = new Employee(3L, "Charlie Brown", "charlie@example.com", "HR", 60000.0);

        when(employeeRepository.save(any(Employee.class))).thenReturn(saved);

        Employee result = employeeService.createEmployee(input);

        assertNotNull(result);
        assertEquals(3L, result.getId());
        assertEquals("Charlie Brown", result.getName());
        verify(employeeRepository).save(input);
    }

    @Test
    @DisplayName("updateEmployee - when employee exists updates and returns employee")
    void updateEmployee_whenEmployeeExists_returnsUpdatedEmployee() {
        Employee updatePayload = new Employee(null, "Alice Renamed", "alice.renamed@example.com", "Engineering", 80000.0);
        Employee updatedEmployee = new Employee(1L, "Alice Renamed", "alice.renamed@example.com", "Engineering", 80000.0);

        when(employeeRepository.existsById(1L)).thenReturn(true);
        when(employeeRepository.update(1L, updatePayload)).thenReturn(updatedEmployee);

        Employee result = employeeService.updateEmployee(1L, updatePayload);

        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("Alice Renamed", result.getName());
        assertEquals(80000.0, result.getSalary());
        verify(employeeRepository).existsById(1L);
        verify(employeeRepository).update(1L, updatePayload);
    }

    @Test
    @DisplayName("updateEmployee - when employee does not exist throws EmployeeNotFoundException")
    void updateEmployee_whenEmployeeDoesNotExist_throwsException() {
        Employee updatePayload = new Employee(null, "Ghost", "ghost@example.com", "Finance", 50000.0);
        when(employeeRepository.existsById(999L)).thenReturn(false);

        EmployeeNotFoundException exception = assertThrows(
                EmployeeNotFoundException.class,
                () -> employeeService.updateEmployee(999L, updatePayload)
        );

        assertEquals("Employee not found with id: 999", exception.getMessage());
        verify(employeeRepository).existsById(999L);
        verify(employeeRepository, never()).update(anyLong(), any());
    }

    @Test
    @DisplayName("deleteEmployee - when employee exists calls repository delete")
    void deleteEmployee_whenEmployeeExists_deletesEmployee() {
        when(employeeRepository.existsById(1L)).thenReturn(true);

        employeeService.deleteEmployee(1L);

        verify(employeeRepository).existsById(1L);
        verify(employeeRepository).delete(1L);
    }

    @Test
    @DisplayName("deleteEmployee - when employee does not exist throws EmployeeNotFoundException")
    void deleteEmployee_whenEmployeeDoesNotExist_throwsException() {
        when(employeeRepository.existsById(999L)).thenReturn(false);

        EmployeeNotFoundException exception = assertThrows(
                EmployeeNotFoundException.class,
                () -> employeeService.deleteEmployee(999L)
        );

        assertEquals("Employee not found with id: 999", exception.getMessage());
        verify(employeeRepository).existsById(999L);
        verify(employeeRepository, never()).delete(anyLong());
    }

    @Test
    @DisplayName("getAllEmployees - paginates correctly with metadata")
    void getAllEmployees_withPagination_calculatesMetadataCorrectly() {
        List<Employee> employeeList = List.of(
                new Employee(1L, "Alice Smith", "alice@example.com", "IT", 70000.0),
                new Employee(2L, "Bob Jones", "bob@example.com", "IT", 60000.0),
                new Employee(3L, "Charlie Brown", "charlie@example.com", "HR", 55000.0),
                new Employee(4L, "Diana Prince", "diana@example.com", "Marketing", 80000.0),
                new Employee(5L, "Evan Wright", "evan@example.com", "Finance", 65000.0)
        );

        when(employeeRepository.findAll()).thenReturn(employeeList);

        PagedResponse<Employee> page0 = employeeService.getAllEmployees(0, 2, "id", "asc");
        assertEquals(0, page0.getPage());
        assertEquals(2, page0.getSize());
        assertEquals(5, page0.getTotalElements());
        assertEquals(3, page0.getTotalPages());
        assertEquals(2, page0.getContent().size());
        assertEquals(1L, page0.getContent().get(0).getId());
        assertEquals(2L, page0.getContent().get(1).getId());

        PagedResponse<Employee> page2 = employeeService.getAllEmployees(2, 2, "id", "asc");
        assertEquals(1, page2.getContent().size());
        assertEquals(5L, page2.getContent().get(0).getId());

        PagedResponse<Employee> pageOutOfRange = employeeService.getAllEmployees(5, 2, "id", "asc");
        assertTrue(pageOutOfRange.getContent().isEmpty());
    }

    @Test
    @DisplayName("getAllEmployees - sorts by name ascending and descending")
    void getAllEmployees_withSorting_sortsCorrectly() {
        List<Employee> employeeList = List.of(
                new Employee(1L, "Charlie Brown", "charlie@example.com", "HR", 55000.0),
                new Employee(2L, "Alice Smith", "alice@example.com", "IT", 70000.0),
                new Employee(3L, "Bob Jones", "bob@example.com", "IT", 60000.0)
        );

        when(employeeRepository.findAll()).thenReturn(employeeList);

        PagedResponse<Employee> ascResponse = employeeService.getAllEmployees(0, 10, "name", "asc");
        assertEquals("Alice Smith", ascResponse.getContent().get(0).getName());
        assertEquals("Bob Jones", ascResponse.getContent().get(1).getName());
        assertEquals("Charlie Brown", ascResponse.getContent().get(2).getName());

        PagedResponse<Employee> descResponse = employeeService.getAllEmployees(0, 10, "name", "desc");
        assertEquals("Charlie Brown", descResponse.getContent().get(0).getName());
        assertEquals("Bob Jones", descResponse.getContent().get(1).getName());
        assertEquals("Alice Smith", descResponse.getContent().get(2).getName());
    }

    @Test
    @DisplayName("getAllEmployees - invalid sort field safely defaults to id asc")
    void getAllEmployees_withInvalidSortField_fallsBackToIdAsc() {
        List<Employee> employeeList = List.of(
                new Employee(3L, "Charlie Brown", "charlie@example.com", "HR", 55000.0),
                new Employee(1L, "Alice Smith", "alice@example.com", "IT", 70000.0),
                new Employee(2L, "Bob Jones", "bob@example.com", "IT", 60000.0)
        );

        when(employeeRepository.findAll()).thenReturn(employeeList);

        PagedResponse<Employee> response = employeeService.getAllEmployees(0, 10, "unknownField", "asc");
        assertEquals(1L, response.getContent().get(0).getId());
        assertEquals(2L, response.getContent().get(1).getId());
        assertEquals(3L, response.getContent().get(2).getId());
    }
}
