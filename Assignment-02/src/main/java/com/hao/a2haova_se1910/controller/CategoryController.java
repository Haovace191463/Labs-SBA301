package com.hao.a2haova_se1910.controller;

import com.hao.a2haova_se1910.entity.Category;
import com.hao.a2haova_se1910.security.SessionTokenManager;
import com.hao.a2haova_se1910.service.CategoryService;
import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@CrossOrigin(origins = {"http://localhost:5173", "http://127.0.0.1:5173"})
public class CategoryController {

    private final CategoryService categoryService;
    private final SessionTokenManager sessionTokenManager;

    public CategoryController(CategoryService categoryService, SessionTokenManager sessionTokenManager) {
        this.categoryService = categoryService;
        this.sessionTokenManager = sessionTokenManager;
    }

    private SessionTokenManager.UserSession requireStaff(String authHeader) {
        SessionTokenManager.UserSession session = sessionTokenManager.requireSession(authHeader);
        if (session.accountRole() == null || session.accountRole() != 2) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied: Staff role (2) is required for category management.");
        }
        return session;
    }

    @GetMapping
    public List<Category> getAllCategories(
            @RequestParam(required = false) Boolean activeOnly,
            @RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authHeader) {
        SessionTokenManager.UserSession session = sessionTokenManager.resolveOptionalSession(authHeader);

        // Public users or explicit activeOnly request returns active categories only
        if (session == null || Boolean.TRUE.equals(activeOnly) || session.accountRole() != 2) {
            return categoryService.getActiveCategories();
        }
        return categoryService.getAllCategories();
    }

    @GetMapping("/{id}")
    public Category getCategoryById(
            @PathVariable Short id,
            @RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authHeader) {
        sessionTokenManager.resolveOptionalSession(authHeader);
        return categoryService.getCategoryById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Category createCategory(
            @Valid @RequestBody Category category,
            @RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authHeader) {
        requireStaff(authHeader);
        return categoryService.createCategory(category);
    }

    @PutMapping("/{id}")
    public Category updateCategory(
            @PathVariable Short id,
            @Valid @RequestBody Category category,
            @RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authHeader) {
        requireStaff(authHeader);
        return categoryService.updateCategory(id, category);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteCategory(
            @PathVariable Short id,
            @RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authHeader) {
        requireStaff(authHeader);
        categoryService.deleteCategory(id);
    }
}
