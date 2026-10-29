package com.hao.a2haova_se1910.controller;

import com.hao.a2haova_se1910.dto.NewsArticleRequest;
import com.hao.a2haova_se1910.dto.NewsArticleResponse;
import com.hao.a2haova_se1910.security.SessionTokenManager;
import com.hao.a2haova_se1910.service.NewsArticleService;
import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/news-articles")
@CrossOrigin(origins = {"http://localhost:5173", "http://127.0.0.1:5173"})
public class NewsArticleController {

    private final NewsArticleService newsArticleService;
    private final SessionTokenManager sessionTokenManager;

    public NewsArticleController(NewsArticleService newsArticleService, SessionTokenManager sessionTokenManager) {
        this.newsArticleService = newsArticleService;
        this.sessionTokenManager = sessionTokenManager;
    }

    private SessionTokenManager.UserSession requireStaff(String authHeader) {
        SessionTokenManager.UserSession session = sessionTokenManager.requireSession(authHeader);
        if (session.accountRole() == null || session.accountRole() != 2) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied: Staff role (2) is required for news management.");
        }
        return session;
    }

    @GetMapping
    public List<NewsArticleResponse> getAllNewsArticles(
            @RequestParam(required = false) Boolean activeOnly,
            @RequestParam(required = false) Short createdById,
            @RequestParam(required = false) String search,
            @RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authHeader) {
        SessionTokenManager.UserSession session = sessionTokenManager.resolveOptionalSession(authHeader);

        // Public users (no session token) can ONLY view active news articles
        if (session == null) {
            return newsArticleService.getAllNewsArticles(true, null, search);
        }

        // Authenticated Staff: cannot query another staff's private news history
        if (session.accountRole() != null && session.accountRole() == 2) {
            if (createdById != null && !createdById.equals(session.accountId())) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied: Staff members cannot access another staff member's news history.");
            }
            return newsArticleService.getAllNewsArticles(activeOnly, createdById, search);
        }

        // Non-staff users (e.g. Admin) see active news
        return newsArticleService.getAllNewsArticles(true, null, search);
    }

    @GetMapping("/{id}")
    public NewsArticleResponse getNewsArticleById(
            @PathVariable String id,
            @RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authHeader) {
        SessionTokenManager.UserSession session = sessionTokenManager.resolveOptionalSession(authHeader);
        NewsArticleResponse article = newsArticleService.getNewsArticleById(id);

        // Public users cannot view inactive news articles
        if (session == null && !Boolean.TRUE.equals(article.newsStatus())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied: Inactive news articles are not publicly visible.");
        }
        return article;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public NewsArticleResponse createNewsArticle(
            @Valid @RequestBody NewsArticleRequest request,
            @RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authHeader) {
        SessionTokenManager.UserSession session = requireStaff(authHeader);

        // Derive author from server-side session, ignoring any client-supplied author ID
        NewsArticleRequest articleWithAuthor = new NewsArticleRequest(
                request.newsArticleID(),
                request.newsTitle(),
                request.headline(),
                request.newsContent(),
                request.newsSource(),
                request.categoryID(),
                request.newsStatus(),
                session.accountId(), // Author derived from authenticated session
                session.accountId(), // Updated by authenticated session
                request.tagIds()
        );

        return newsArticleService.createNewsArticle(articleWithAuthor);
    }

    @PutMapping("/{id}")
    public NewsArticleResponse updateNewsArticle(
            @PathVariable String id,
            @Valid @RequestBody NewsArticleRequest request,
            @RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authHeader) {
        SessionTokenManager.UserSession session = requireStaff(authHeader);

        NewsArticleRequest articleWithUpdater = new NewsArticleRequest(
                request.newsArticleID(),
                request.newsTitle(),
                request.headline(),
                request.newsContent(),
                request.newsSource(),
                request.categoryID(),
                request.newsStatus(),
                request.createdByID(), // Preserves original author
                session.accountId(),   // Updated by authenticated staff
                request.tagIds()
        );

        return newsArticleService.updateNewsArticle(id, articleWithUpdater);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteNewsArticle(
            @PathVariable String id,
            @RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authHeader) {
        requireStaff(authHeader);
        newsArticleService.deleteNewsArticle(id);
    }
}
