package com.hao.a2haova_se1910.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.List;

public record NewsArticleRequest(
        @Size(max = 20, message = "NewsArticleID must not exceed 20 characters")
        String newsArticleID,

        @Size(max = 400, message = "NewsTitle must not exceed 400 characters")
        String newsTitle,

        @NotBlank(message = "Headline is required")
        @Size(max = 150, message = "Headline must not exceed 150 characters")
        String headline,

        @Size(max = 4000, message = "NewsContent must not exceed 4000 characters")
        String newsContent,

        @Size(max = 400, message = "NewsSource must not exceed 400 characters")
        String newsSource,

        @NotNull(message = "CategoryID is required")
        Short categoryID,

        Boolean newsStatus,

        Short createdByID,

        Short updatedByID,

        List<Integer> tagIds
) {
}

