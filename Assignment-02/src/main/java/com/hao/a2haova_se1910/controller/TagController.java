package com.hao.a2haova_se1910.controller;

import com.hao.a2haova_se1910.dto.TagRequest;
import com.hao.a2haova_se1910.dto.TagResponse;
import com.hao.a2haova_se1910.security.SessionTokenManager;
import com.hao.a2haova_se1910.service.TagService;
import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/tags")
@CrossOrigin(origins = {"http://localhost:5173", "http://127.0.0.1:5173"})
public class TagController {

    private final TagService tagService;
    private final SessionTokenManager sessionTokenManager;

    public TagController(TagService tagService, SessionTokenManager sessionTokenManager) {
        this.tagService = tagService;
        this.sessionTokenManager = sessionTokenManager;
    }

    private SessionTokenManager.UserSession requireStaff(String authHeader) {
        SessionTokenManager.UserSession session = sessionTokenManager.requireSession(authHeader);
        if (session.accountRole() == null || session.accountRole() != 2) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied: Staff role (2) is required for tag management.");
        }
        return session;
    }

    @GetMapping
    public List<TagResponse> getAllTags() {
        return tagService.getAllTags();
    }

    @GetMapping("/{id}")
    public TagResponse getTagById(@PathVariable Integer id) {
        return tagService.getTagById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public TagResponse createTag(
            @Valid @RequestBody TagRequest request,
            @RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authHeader) {
        requireStaff(authHeader);
        return tagService.createTag(request);
    }

    @PutMapping("/{id}")
    public TagResponse updateTag(
            @PathVariable Integer id,
            @Valid @RequestBody TagRequest request,
            @RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authHeader) {
        requireStaff(authHeader);
        return tagService.updateTag(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteTag(
            @PathVariable Integer id,
            @RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authHeader) {
        requireStaff(authHeader);
        tagService.deleteTag(id);
    }
}
