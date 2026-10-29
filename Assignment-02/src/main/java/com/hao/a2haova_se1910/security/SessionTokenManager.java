package com.hao.a2haova_se1910.security;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

import java.security.SecureRandom;
import java.util.Base64;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class SessionTokenManager {

    public record UserSession(
            Short accountId,
            String accountEmail,
            Integer accountRole,
            long createdAt
    ) {}

    private final Map<String, UserSession> sessions = new ConcurrentHashMap<>();
    private final SecureRandom secureRandom = new SecureRandom();

    /**
     * Creates a new session with a cryptographically unpredictable token (256-bit entropy).
     */
    public String createSession(Short accountId, String accountEmail, Integer accountRole) {
        byte[] randomBytes = new byte[32]; // 256 bits of entropy
        secureRandom.nextBytes(randomBytes);
        String token = Base64.getUrlEncoder().withoutPadding().encodeToString(randomBytes);
        sessions.put(token, new UserSession(accountId, accountEmail, accountRole, System.currentTimeMillis()));
        return token;
    }

    /**
     * Retrieves an active session by token.
     */
    public UserSession getSession(String token) {
        if (token == null || token.isBlank()) {
            return null;
        }
        return sessions.get(token);
    }

    /**
     * Revokes an existing session.
     */
    public void revokeSession(String token) {
        if (token != null && !token.isBlank()) {
            sessions.remove(token);
        }
    }

    /**
     * Clears all sessions (useful during tests or system restart).
     */
    public void clearAll() {
        sessions.clear();
    }

    /**
     * Enforces that the request has a valid session token; returns 401 if missing, invalid, or revoked.
     */
    public UserSession requireSession(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Missing or invalid Authorization header");
        }
        String token = authHeader.substring(7).trim();
        UserSession session = getSession(token);
        if (session == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid, expired, or revoked session token");
        }
        return session;
    }

    /**
     * Resolves session if Authorization header is provided.
     * Note: If header is present with Bearer, it MUST be valid (otherwise returns 401).
     * If header is absent, returns null for public access.
     */
    public UserSession resolveOptionalSession(String authHeader) {
        if (authHeader == null || authHeader.isBlank()) {
            return null;
        }
        if (!authHeader.startsWith("Bearer ")) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid Authorization header format");
        }
        String token = authHeader.substring(7).trim();
        UserSession session = getSession(token);
        if (session == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid, expired, or revoked session token");
        }
        return session;
    }
}

