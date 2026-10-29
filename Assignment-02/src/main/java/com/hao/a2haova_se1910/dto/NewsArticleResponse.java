package com.hao.a2haova_se1910.dto;

import com.hao.a2haova_se1910.entity.NewsArticle;

import java.time.Instant;
import java.util.Collections;
import java.util.List;

public record NewsArticleResponse(
        String newsArticleID,
        String newsTitle,
        String headline,
        Instant createdDate,
        String newsContent,
        String newsSource,
        Short categoryID,
        String categoryName,
        Boolean newsStatus,
        Short createdByID,
        String createdByName,
        Short updatedByID,
        Instant modifiedDate,
        List<Integer> tagIds,
        List<TagResponse> tags
) {
    public static NewsArticleResponse from(NewsArticle article) {
        return from(article, null, null, Collections.emptyList(), Collections.emptyList());
    }

    public static NewsArticleResponse from(
            NewsArticle article,
            String categoryName,
            String createdByName,
            List<Integer> tagIds,
            List<TagResponse> tags
    ) {
        Short catId = null;
        String catName = categoryName;
        if (article.getCategoryID() != null) {
            catId = article.getCategoryID().getId();
            if (catName == null) {
                catName = article.getCategoryID().getCategoryName();
            }
        }

        return new NewsArticleResponse(
                article.getNewsArticleID(),
                article.getNewsTitle(),
                article.getHeadline(),
                article.getCreatedDate(),
                article.getNewsContent(),
                article.getNewsSource(),
                catId,
                catName,
                article.getNewsStatus(),
                article.getCreatedByID(),
                createdByName,
                article.getUpdatedByID(),
                article.getModifiedDate(),
                tagIds != null ? tagIds : Collections.emptyList(),
                tags != null ? tags : Collections.emptyList()
        );
    }
}
