package com.hao.a2haova_se1910.controller;

import com.hao.a2haova_se1910.dto.ProfileUpdateRequest;
import com.hao.a2haova_se1910.dto.SystemAccountRequest;
import com.hao.a2haova_se1910.dto.SystemAccountResponse;
import com.hao.a2haova_se1910.security.SessionTokenManager;
import com.hao.a2haova_se1910.service.SystemAccountService;
import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/accounts")
@CrossOrigin(origins = {"http://localhost:5173", "http://127.0.0.1:5173"})
public class SystemAccountController {

    private final SystemAccountService accountService;
    private final SessionTokenManager sessionTokenManager;

    public SystemAccountController(SystemAccountService accountService, SessionTokenManager sessionTokenManager) {
        this.accountService = accountService;
        this.sessionTokenManager = sessionTokenManager;
    }

    private SessionTokenManager.UserSession requireAdmin(String authHeader) {
        SessionTokenManager.UserSession session = sessionTokenManager.requireSession(authHeader);
        if (session.accountRole() == null || session.accountRole() != 1) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied: Administrator role (1) is required for account management.");
        }
        return session;
    }

    @GetMapping
    public List<SystemAccountResponse> getAllAccounts(
            @RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authHeader) {
        requireAdmin(authHeader);
        return accountService.getAllAccounts();
    }

    @GetMapping("/{id}")
    public SystemAccountResponse getAccountById(
            @PathVariable Short id,
            @RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authHeader) {
        requireAdmin(authHeader);
        return accountService.getAccountById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public SystemAccountResponse createAccount(
            @Valid @RequestBody SystemAccountRequest request,
            @RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authHeader) {
        requireAdmin(authHeader);
        return accountService.createAccount(request);
    }

    @PutMapping("/{id}")
    public SystemAccountResponse updateAccount(
            @PathVariable Short id,
            @Valid @RequestBody SystemAccountRequest request,
            @RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authHeader) {
        requireAdmin(authHeader);
        return accountService.updateAccount(id, request);
    }

    @PutMapping("/profile/{id}")
    public SystemAccountResponse updateProfile(
            @PathVariable Short id,
            @Valid @RequestBody ProfileUpdateRequest request,
            @RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authHeader) {
        SessionTokenManager.UserSession session = sessionTokenManager.requireSession(authHeader);

        // Staff members can only update their own profile; attempting to update another ID is 403 Forbidden
        if (session.accountRole() != null && session.accountRole() == 2) {
            if (!session.accountId().equals(id)) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied: Staff members can only manage their own profile.");
            }
        } else if (session.accountRole() == null || session.accountRole() != 1) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied: Invalid account role.");
        }

        return accountService.updateProfile(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteAccount(
            @PathVariable Short id,
            @RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authHeader) {
        requireAdmin(authHeader);
        accountService.deleteAccount(id);
    }
}
