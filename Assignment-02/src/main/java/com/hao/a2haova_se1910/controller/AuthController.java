package com.hao.a2haova_se1910.controller;

import com.hao.a2haova_se1910.dto.LoginRequest;
import com.hao.a2haova_se1910.dto.LoginResponse;
import com.hao.a2haova_se1910.security.SessionTokenManager;
import com.hao.a2haova_se1910.service.SystemAccountService;
import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:5173", "http://127.0.0.1:5173"})
public class AuthController {

    private final SystemAccountService accountService;
    private final SessionTokenManager sessionTokenManager;

    public AuthController(SystemAccountService accountService, SessionTokenManager sessionTokenManager) {
        this.accountService = accountService;
        this.sessionTokenManager = sessionTokenManager;
    }

    @PostMapping("/login")
    public LoginResponse login(@Valid @RequestBody LoginRequest request) {
        return accountService.login(request);
    }

    @PostMapping("/logout")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void logout(@RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authHeader) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            sessionTokenManager.revokeSession(authHeader.substring(7).trim());
        }
    }
}
