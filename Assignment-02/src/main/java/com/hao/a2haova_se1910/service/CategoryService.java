package com.hao.a2haova_se1910.service;

import com.hao.a2haova_se1910.entity.Category;
import com.hao.a2haova_se1910.exception.ConflictException;
import com.hao.a2haova_se1910.exception.DuplicateResourceException;
import com.hao.a2haova_se1910.exception.ResourceNotFoundException;
import com.hao.a2haova_se1910.repository.CategoryRepository;
import com.hao.a2haova_se1910.repository.NewsArticleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final NewsArticleRepository newsArticleRepository;

    public CategoryService(CategoryRepository categoryRepository, NewsArticleRepository newsArticleRepository) {
        this.categoryRepository = categoryRepository;
        this.newsArticleRepository = newsArticleRepository;
    }

    @Transactional(readOnly = true)
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    @Transactional(readOnly = true)
    public List<Category> getActiveCategories() {
        return categoryRepository.findByIsActive(true);
    }

    @Transactional(readOnly = true)
    public Category getCategoryById(Short id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + id));
    }

    @Transactional
    public Category createCategory(Category category) {
        if (category.getCategoryName() == null || category.getCategoryName().isBlank()) {
            throw new IllegalArgumentException("Category name is required");
        }

        if (categoryRepository.existsByCategoryNameIgnoreCase(category.getCategoryName().trim())) {
            throw new DuplicateResourceException("Category name already exists: " + category.getCategoryName());
        }

        category.setId(null);
        category.setCategoryName(category.getCategoryName().trim());

        if (category.getIsActive() == null) {
            category.setIsActive(true);
        }

        Short parentId = category.getParentCategoryId();
        if (parentId == null && category.getParentCategoryID() != null) {
            parentId = category.getParentCategoryID().getId();
        }

        if (parentId != null) {
            Category parent = getCategoryById(parentId);
            category.setParentCategoryID(parent);
        } else {
            category.setParentCategoryID(null);
        }

        return categoryRepository.save(category);
    }

    @Transactional
    public Category updateCategory(Short id, Category updatedCategory) {
        Category existing = getCategoryById(id);

        if (updatedCategory.getCategoryName() == null || updatedCategory.getCategoryName().isBlank()) {
            throw new IllegalArgumentException("Category name is required");
        }

        String trimmedName = updatedCategory.getCategoryName().trim();
        if (categoryRepository.existsByCategoryNameIgnoreCaseAndIdNot(trimmedName, id)) {
            throw new DuplicateResourceException("Category name already exists: " + trimmedName);
        }

        Short parentId = updatedCategory.getParentCategoryId();
        if (parentId == null && updatedCategory.getParentCategoryID() != null) {
            parentId = updatedCategory.getParentCategoryID().getId();
        }

        if (parentId != null) {
            if (parentId.equals(id)) {
                throw new IllegalArgumentException("A category cannot be its own parent category");
            }
            Category parent = getCategoryById(parentId);
            existing.setParentCategoryID(parent);
            existing.setParentCategoryId(parent.getId());
        } else {
            existing.setParentCategoryID(null);
            existing.setParentCategoryId(null);
        }

        existing.setCategoryName(trimmedName);
        existing.setCategoryDesciption(updatedCategory.getCategoryDesciption());
        if (updatedCategory.getIsActive() != null) {
            existing.setIsActive(updatedCategory.getIsActive());
        }

        return categoryRepository.save(existing);
    }

    @Transactional
    public void deleteCategory(Short id) {
        Category category = getCategoryById(id);

        if (newsArticleRepository.existsByCategoryID_Id(id)) {
            throw new ConflictException("Cannot delete category because it is associated with existing news articles.");
        }

        if (categoryRepository.existsByParentCategoryID_Id(id)) {
            throw new ConflictException("Cannot delete category because it is set as a parent for other categories.");
        }

        categoryRepository.delete(category);
    }
}
