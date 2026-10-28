package com.orchidhouse.dto;

import com.orchidhouse.model.Category;

public record CategoryResponse(Long categoryId, String categoryName) {

    public static CategoryResponse from(Category category) {
        return new CategoryResponse(category.getCategoryId(), category.getCategoryName());
    }
}
