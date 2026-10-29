package com.hao.a2haova_se1910.service;

import com.hao.a2haova_se1910.dto.NewsArticleRequest;
import com.hao.a2haova_se1910.dto.NewsArticleResponse;
import com.hao.a2haova_se1910.dto.TagResponse;
import com.hao.a2haova_se1910.entity.Category;
import com.hao.a2haova_se1910.entity.NewsArticle;
import com.hao.a2haova_se1910.entity.NewsTag;
import com.hao.a2haova_se1910.entity.NewsTagId;
import com.hao.a2haova_se1910.entity.SystemAccount;
import com.hao.a2haova_se1910.entity.Tag;
import com.hao.a2haova_se1910.exception.DuplicateResourceException;
import com.hao.a2haova_se1910.exception.ResourceNotFoundException;
import com.hao.a2haova_se1910.repository.CategoryRepository;
import com.hao.a2haova_se1910.repository.NewsArticleRepository;
import com.hao.a2haova_se1910.repository.NewsTagRepository;
import com.hao.a2haova_se1910.repository.SystemAccountRepository;
import com.hao.a2haova_se1910.repository.TagRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.*;

@Service
public class NewsArticleService {

    private final NewsArticleRepository newsArticleRepository;
    private final CategoryRepository categoryRepository;
    private final SystemAccountRepository accountRepository;
    private final NewsTagRepository newsTagRepository;
    private final TagRepository tagRepository;

    public NewsArticleService(
            NewsArticleRepository newsArticleRepository,
            CategoryRepository categoryRepository,
            SystemAccountRepository accountRepository,
            NewsTagRepository newsTagRepository,
            TagRepository tagRepository) {
        this.newsArticleRepository = newsArticleRepository;
        this.categoryRepository = categoryRepository;
        this.accountRepository = accountRepository;
        this.newsTagRepository = newsTagRepository;
        this.tagRepository = tagRepository;
    }

    @Transactional(readOnly = true)
    public List<NewsArticleResponse> getAllNewsArticles(Boolean activeOnly, Short createdById, String search) {
        List<NewsArticle> articles = newsArticleRepository.findAll();

        if (Boolean.TRUE.equals(activeOnly)) {
            articles = articles.stream()
                    .filter(a -> Boolean.TRUE.equals(a.getNewsStatus()))
                    .toList();
        }

        if (createdById != null) {
            articles = articles.stream()
                    .filter(a -> createdById.equals(a.getCreatedByID()))
                    .toList();
        }

        if (search != null && !search.isBlank()) {
            String lower = search.trim().toLowerCase();
            articles = articles.stream()
                    .filter(a -> (a.getNewsTitle() != null && a.getNewsTitle().toLowerCase().contains(lower))
                            || (a.getHeadline() != null && a.getHeadline().toLowerCase().contains(lower))
                            || (a.getNewsContent() != null && a.getNewsContent().toLowerCase().contains(lower)))
                    .toList();
        }

        return articles.stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public NewsArticleResponse getNewsArticleById(String id) {
        NewsArticle article = newsArticleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("News article not found with ID: " + id));
        return mapToResponse(article);
    }

    @Transactional
    public NewsArticleResponse createNewsArticle(NewsArticleRequest request) {
        String articleId = request.newsArticleID();
        if (articleId == null || articleId.isBlank()) {
            articleId = String.valueOf(System.currentTimeMillis() % 100000000);
        } else {
            articleId = articleId.trim();
        }

        if (newsArticleRepository.existsById(articleId)) {
            throw new DuplicateResourceException("News article with ID " + articleId + " already exists.");
        }

        if (request.headline() == null || request.headline().isBlank()) {
            throw new IllegalArgumentException("Headline is required");
        }

        Category category = null;
        if (request.categoryID() != null) {
            category = categoryRepository.findById(request.categoryID())
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + request.categoryID()));
        }

        if (request.createdByID() != null) {
            if (!accountRepository.existsById(request.createdByID())) {
                throw new ResourceNotFoundException("Creator account not found with ID: " + request.createdByID());
            }
        }

        NewsArticle article = new NewsArticle();
        article.setNewsArticleID(articleId);
        article.setNewsTitle(request.newsTitle());
        article.setHeadline(request.headline());
        article.setNewsContent(request.newsContent());
        article.setNewsSource(request.newsSource());
        article.setCategoryID(category);
        article.setNewsStatus(request.newsStatus() != null ? request.newsStatus() : true);
        article.setCreatedByID(request.createdByID());
        article.setUpdatedByID(request.updatedByID());
        article.setCreatedDate(Instant.now());
        article.setModifiedDate(Instant.now());

        NewsArticle saved = newsArticleRepository.save(article);

        if (request.tagIds() != null && !request.tagIds().isEmpty()) {
            for (Integer tagId : request.tagIds()) {
                if (tagRepository.existsById(tagId)) {
                    newsTagRepository.save(new NewsTag(new NewsTagId(saved.getNewsArticleID(), tagId)));
                }
            }
        }

        return mapToResponse(saved);
    }

    @Transactional
    public NewsArticleResponse updateNewsArticle(String id, NewsArticleRequest request) {
        NewsArticle existing = newsArticleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("News article not found with ID: " + id));

        if (request.headline() == null || request.headline().isBlank()) {
            throw new IllegalArgumentException("Headline is required");
        }

        if (request.categoryID() != null) {
            Category category = categoryRepository.findById(request.categoryID())
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + request.categoryID()));
            existing.setCategoryID(category);
        }

        if (request.newsTitle() != null) {
            existing.setNewsTitle(request.newsTitle());
        }
        existing.setHeadline(request.headline());
        if (request.newsContent() != null) {
            existing.setNewsContent(request.newsContent());
        }
        if (request.newsSource() != null) {
            existing.setNewsSource(request.newsSource());
        }
        if (request.newsStatus() != null) {
            existing.setNewsStatus(request.newsStatus());
        }
        if (request.updatedByID() != null) {
            existing.setUpdatedByID(request.updatedByID());
        }
        existing.setModifiedDate(Instant.now());

        NewsArticle saved = newsArticleRepository.save(existing);

        if (request.tagIds() != null) {
            newsTagRepository.deleteByIdNewsArticleID(id);
            for (Integer tagId : request.tagIds()) {
                if (tagRepository.existsById(tagId)) {
                    newsTagRepository.save(new NewsTag(new NewsTagId(id, tagId)));
                }
            }
        }

        return mapToResponse(saved);
    }

    @Transactional
    public void deleteNewsArticle(String id) {
        NewsArticle existing = newsArticleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("News article not found with ID: " + id));

        newsTagRepository.deleteByIdNewsArticleID(id);
        newsArticleRepository.delete(existing);
    }

    private NewsArticleResponse mapToResponse(NewsArticle article) {
        String categoryName = null;
        if (article.getCategoryID() != null) {
            categoryName = article.getCategoryID().getCategoryName();
        }

        String createdByName = null;
        if (article.getCreatedByID() != null) {
            createdByName = accountRepository.findById(article.getCreatedByID())
                    .map(SystemAccount::getAccountName)
                    .orElse(null);
        }

        List<NewsTag> newsTags = newsTagRepository.findByIdNewsArticleID(article.getNewsArticleID());
        List<Integer> tagIds = newsTags.stream().map(nt -> nt.getId().getTagID()).toList();

        List<TagResponse> tags = new ArrayList<>();
        if (!tagIds.isEmpty()) {
            List<Tag> tagEntities = tagRepository.findAllById(tagIds);
            tags = tagEntities.stream().map(TagResponse::from).toList();
        }

        return NewsArticleResponse.from(article, categoryName, createdByName, tagIds, tags);
    }
}
