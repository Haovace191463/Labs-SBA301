package com.hao.a2haova_se1910.repository;

import com.hao.a2haova_se1910.entity.NewsArticle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NewsArticleRepository extends JpaRepository<NewsArticle, String> {
    boolean existsByCategoryID_Id(Short categoryId);
    boolean existsByCreatedByID(Short createdById);
    List<NewsArticle> findByNewsStatus(Boolean newsStatus);
    List<NewsArticle> findByCreatedByID(Short createdByID);
    List<NewsArticle> findByNewsTitleContainingIgnoreCaseOrHeadlineContainingIgnoreCase(String title, String headline);
    List<NewsArticle> findByNewsStatusAndNewsTitleContainingIgnoreCase(Boolean newsStatus, String title);
    List<NewsArticle> findByCreatedByIDAndNewsTitleContainingIgnoreCase(Short createdByID, String title);
}
