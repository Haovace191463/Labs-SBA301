package com.example.lab03employeemanagement.controller;

import com.example.lab03employeemanagement.dto.PagedResponse;
import com.example.lab03employeemanagement.exception.EmployeeNotFoundException;
import com.example.lab03employeemanagement.model.Employee;
import com.example.lab03employeemanagement.service.IEmployeeService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import tools.jackson.databind.ObjectMapper;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(EmployeeController.class)
class EmployeeControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private IEmployeeService employeeService;

    @Test
    @DisplayName("GET /api/employees - returns 200 OK and employee list")
    void getAllEmployees_whenEmployeesExist_returns200AndPagedList() throws Exception {
        Employee emp1 = new Employee(1L, "Alice Smith", "alice.smith@example.com", "Engineering", 75000.0);
        Employee emp2 = new Employee(2L, "Bob Jones", "bob.jones@example.com", "Marketing", 55000.0);
        PagedResponse<Employee> pagedResponse = new PagedResponse<>(List.of(emp1, emp2), 0, 10, 2, 1);

        when(employeeService.getAllEmployees(0, 10, "id", "asc")).thenReturn(pagedResponse);

        mockMvc.perform(get("/api/employees"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.page").value(0))
                .andExpect(jsonPath("$.size").value(10))
                .andExpect(jsonPath("$.totalElements").value(2))
                .andExpect(jsonPath("$.totalPages").value(1))
                .andExpect(jsonPath("$.content[0].id").value(1))
                .andExpect(jsonPath("$.content[0].name").value("Alice Smith"))
                .andExpect(jsonPath("$.content[1].id").value(2))
                .andExpect(jsonPath("$.content[1].name").value("Bob Jones"));

        verify(employeeService).getAllEmployees(0, 10, "id", "asc");
    }

    @Test
    @DisplayName("GET /api/employees/{id} - existing employee returns 200 OK")
    void getEmployeeById_whenEmployeeExists_returns200AndEmployee() throws Exception {
        Employee employee = new Employee(1L, "Alice Smith", "alice.smith@example.com", "Engineering", 75000.0);
        when(employeeService.getEmployeeById(1L)).thenReturn(employee);

        mockMvc.perform(get("/api/employees/1"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("Alice Smith"))
                .andExpect(jsonPath("$.email").value("alice.smith@example.com"))
                .andExpect(jsonPath("$.department").value("Engineering"))
                .andExpect(jsonPath("$.salary").value(75000.0));

        verify(employeeService).getEmployeeById(1L);
    }

    @Test
    @DisplayName("GET /api/employees/{id} - missing employee returns 404 NOT FOUND")
    void getEmployeeById_whenEmployeeDoesNotExist_returns404NotFound() throws Exception {
        when(employeeService.getEmployeeById(999L)).thenThrow(new EmployeeNotFoundException(999L));

        mockMvc.perform(get("/api/employees/999"))
                .andExpect(status().isNotFound())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.message").value("Employee not found with id: 999"));

        verify(employeeService).getEmployeeById(999L);
    }

    @Test
    @DisplayName("POST /api/employees - valid employee returns 201 CREATED")
    void createEmployee_whenValidRequest_returns201Created() throws Exception {
        Employee newEmployee = new Employee(null, "Charlie Brown", "charlie@example.com", "Human Resources", 60000.0);
        Employee savedEmployee = new Employee(3L, "Charlie Brown", "charlie@example.com", "Human Resources", 60000.0);

        when(employeeService.createEmployee(any(Employee.class))).thenReturn(savedEmployee);

        mockMvc.perform(post("/api/employees")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(newEmployee)))
                .andExpect(status().isCreated())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value(3))
                .andExpect(jsonPath("$.name").value("Charlie Brown"))
                .andExpect(jsonPath("$.email").value("charlie@example.com"))
                .andExpect(jsonPath("$.department").value("Human Resources"))
                .andExpect(jsonPath("$.salary").value(60000.0));

        verify(employeeService).createEmployee(any(Employee.class));
    }

    @Test
    @DisplayName("PUT /api/employees/{id} - existing employee returns 200 OK")
    void updateEmployee_whenEmployeeExists_returns200Ok() throws Exception {
        Employee updatePayload = new Employee(null, "Alice Updated", "alice.updated@example.com", "Engineering", 80000.0);
        Employee updatedEmployee = new Employee(1L, "Alice Updated", "alice.updated@example.com", "Engineering", 80000.0);

        when(employeeService.updateEmployee(eq(1L), any(Employee.class))).thenReturn(updatedEmployee);

        mockMvc.perform(put("/api/employees/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updatePayload)))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("Alice Updated"))
                .andExpect(jsonPath("$.email").value("alice.updated@example.com"))
                .andExpect(jsonPath("$.salary").value(80000.0));

        verify(employeeService).updateEmployee(eq(1L), any(Employee.class));
    }

    @Test
    @DisplayName("PUT /api/employees/{id} - missing employee returns 404 NOT FOUND")
    void updateEmployee_whenEmployeeDoesNotExist_returns404NotFound() throws Exception {
        Employee updatePayload = new Employee(null, "Ghost", "ghost@example.com", "Finance", 50000.0);
        when(employeeService.updateEmployee(eq(999L), any(Employee.class)))
                .thenThrow(new EmployeeNotFoundException(999L));

        mockMvc.perform(put("/api/employees/999")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updatePayload)))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.message").value("Employee not found with id: 999"));

        verify(employeeService).updateEmployee(eq(999L), any(Employee.class));
    }

    @Test
    @DisplayName("DELETE /api/employees/{id} - existing employee returns 204 NO CONTENT")
    void deleteEmployee_whenEmployeeExists_returns204NoContent() throws Exception {
        mockMvc.perform(delete("/api/employees/1"))
                .andExpect(status().isNoContent());

        verify(employeeService).deleteEmployee(1L);
    }

    @Test
    @DisplayName("DELETE /api/employees/{id} - missing employee returns 404 NOT FOUND")
    void deleteEmployee_whenEmployeeDoesNotExist_returns404NotFound() throws Exception {
        org.mockito.Mockito.doThrow(new EmployeeNotFoundException(999L))
                .when(employeeService).deleteEmployee(999L);

        mockMvc.perform(delete("/api/employees/999"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.message").value("Employee not found with id: 999"));

        verify(employeeService).deleteEmployee(999L);
    }

    @Test
    @DisplayName("GET /api/employees with pagination parameters returns correct page metadata")
    void getAllEmployees_withPagination_returnsPagedEmployees() throws Exception {
        Employee emp = new Employee(1L, "Alice Smith", "alice.smith@example.com", "Engineering", 75000.0);
        PagedResponse<Employee> pagedResponse = new PagedResponse<>(List.of(emp), 0, 3, 10, 4);

        when(employeeService.getAllEmployees(0, 3, "id", "asc")).thenReturn(pagedResponse);

        mockMvc.perform(get("/api/employees")
                        .param("page", "0")
                        .param("size", "3"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.page").value(0))
                .andExpect(jsonPath("$.size").value(3))
                .andExpect(jsonPath("$.totalElements").value(10))
                .andExpect(jsonPath("$.totalPages").value(4))
                .andExpect(jsonPath("$.content.length()").value(1));

        verify(employeeService).getAllEmployees(0, 3, "id", "asc");
    }

    @Test
    @DisplayName("GET /api/employees with sorting parameters delegates to service with correct sort arguments")
    void getAllEmployees_withSorting_returnsSortedEmployees() throws Exception {
        Employee emp1 = new Employee(1L, "Alice Smith", "alice.smith@example.com", "Engineering", 75000.0);
        Employee emp2 = new Employee(2L, "Bob Jones", "bob.jones@example.com", "Marketing", 55000.0);
        PagedResponse<Employee> pagedResponse = new PagedResponse<>(List.of(emp1, emp2), 0, 10, 2, 1);

        when(employeeService.getAllEmployees(0, 10, "name", "asc")).thenReturn(pagedResponse);

        mockMvc.perform(get("/api/employees")
                        .param("sortBy", "name")
                        .param("direction", "asc"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].name").value("Alice Smith"))
                .andExpect(jsonPath("$.content[1].name").value("Bob Jones"));

        verify(employeeService).getAllEmployees(0, 10, "name", "asc");
    }

    @Test
    @DisplayName("POST /api/employees - invalid request returns 400 BAD REQUEST")
    void createEmployee_whenInvalidRequest_returns400BadRequest() throws Exception {
        Employee invalidEmployee = new Employee(null, "", "invalid-email-format", "", -500.0);

        mockMvc.perform(post("/api/employees")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidEmployee)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.message").exists());
    }
}
