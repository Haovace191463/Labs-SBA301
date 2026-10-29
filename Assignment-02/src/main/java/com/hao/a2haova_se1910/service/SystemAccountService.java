package com.hao.a2haova_se1910.service;

import com.hao.a2haova_se1910.dto.*;
import com.hao.a2haova_se1910.entity.SystemAccount;
import com.hao.a2haova_se1910.exception.ConflictException;
import com.hao.a2haova_se1910.exception.DuplicateResourceException;
import com.hao.a2haova_se1910.exception.ResourceNotFoundException;
import com.hao.a2haova_se1910.repository.NewsArticleRepository;
import com.hao.a2haova_se1910.repository.SystemAccountRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class SystemAccountService {

    private final SystemAccountRepository accountRepository;
    private final NewsArticleRepository newsArticleRepository;
    private final com.hao.a2haova_se1910.security.SessionTokenManager sessionTokenManager;

    public SystemAccountService(
            SystemAccountRepository accountRepository,
            NewsArticleRepository newsArticleRepository,
            com.hao.a2haova_se1910.security.SessionTokenManager sessionTokenManager) {
        this.accountRepository = accountRepository;
        this.newsArticleRepository = newsArticleRepository;
        this.sessionTokenManager = sessionTokenManager;
    }

    @Transactional(readOnly = true)
    public LoginResponse login(LoginRequest request) {
        if (request.email() == null || request.email().isBlank()
                || request.password() == null || request.password().isBlank()) {
            throw new IllegalArgumentException("Email and password are required");
        }

        SystemAccount account = accountRepository.findByAccountEmailIgnoreCase(request.email().trim())
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));

        if (!request.password().equals(account.getAccountPassword())) {
            throw new IllegalArgumentException("Invalid email or password");
        }

        String token = sessionTokenManager.createSession(
                account.getId(),
                account.getAccountEmail(),
                account.getAccountRole()
        );

        return new LoginResponse(
                account.getId(),
                account.getAccountName(),
                account.getAccountEmail(),
                account.getAccountRole(),
                token
        );
    }

    @Transactional(readOnly = true)
    public List<SystemAccountResponse> getAllAccounts() {
        return accountRepository.findAll()
                .stream()
                .map(SystemAccountResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public SystemAccountResponse getAccountById(Short id) {
        SystemAccount account = accountRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found with ID: " + id));
        return SystemAccountResponse.from(account);
    }

    @Transactional
    public SystemAccountResponse createAccount(SystemAccountRequest request) {
        if (request.accountEmail() == null || request.accountEmail().isBlank()) {
            throw new IllegalArgumentException("Account email is required");
        }

        String email = request.accountEmail().trim();
        if (accountRepository.existsByAccountEmailIgnoreCase(email)) {
            throw new DuplicateResourceException("Account email already exists: " + email);
        }

        SystemAccount account = new SystemAccount();
        Short id = request.id();
        if (id == null) {
            id = accountRepository.getNextAccountId();
        }
        account.setId(id);
        account.setAccountName(request.accountName() != null ? request.accountName().trim() : null);
        account.setAccountEmail(email);
        account.setAccountRole(request.accountRole() != null ? request.accountRole() : 2); // Default 2: Staff
        account.setAccountPassword(request.accountPassword() != null && !request.accountPassword().isBlank()
                ? request.accountPassword()
                : "@1"); // Default password

        return SystemAccountResponse.from(accountRepository.save(account));
    }

    @Transactional
    public SystemAccountResponse updateAccount(Short id, SystemAccountRequest request) {
        SystemAccount existing = accountRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found with ID: " + id));

        if (request.accountEmail() != null && !request.accountEmail().isBlank()) {
            String email = request.accountEmail().trim();
            if (accountRepository.existsByAccountEmailIgnoreCaseAndIdNot(email, id)) {
                throw new DuplicateResourceException("Account email already exists: " + email);
            }
            existing.setAccountEmail(email);
        }

        if (request.accountName() != null) {
            existing.setAccountName(request.accountName().trim());
        }

        if (request.accountRole() != null) {
            existing.setAccountRole(request.accountRole());
        }

        if (request.accountPassword() != null && !request.accountPassword().isBlank()) {
            existing.setAccountPassword(request.accountPassword());
        }

        return SystemAccountResponse.from(accountRepository.save(existing));
    }

    @Transactional
    public SystemAccountResponse updateProfile(Short id, ProfileUpdateRequest request) {
        SystemAccount existing = accountRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found with ID: " + id));

        if (request.accountEmail() != null && !request.accountEmail().isBlank()) {
            String email = request.accountEmail().trim();
            if (accountRepository.existsByAccountEmailIgnoreCaseAndIdNot(email, id)) {
                throw new DuplicateResourceException("Account email already exists: " + email);
            }
            existing.setAccountEmail(email);
        }

        if (request.accountName() != null) {
            existing.setAccountName(request.accountName().trim());
        }

        if (request.accountPassword() != null && !request.accountPassword().isBlank()) {
            existing.setAccountPassword(request.accountPassword());
        }

        return SystemAccountResponse.from(accountRepository.save(existing));
    }

    @Transactional
    public void deleteAccount(Short id) {
        SystemAccount existing = accountRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found with ID: " + id));

        if (newsArticleRepository.existsByCreatedByID(id)) {
            throw new ConflictException("Cannot delete account because it has created news articles.");
        }

        accountRepository.delete(existing);
    }
}

