package com.hao.a2haova_se1910.repository;

import com.hao.a2haova_se1910.entity.NewsTag;
import com.hao.a2haova_se1910.entity.NewsTagId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NewsTagRepository extends JpaRepository<NewsTag, NewsTagId> {
    List<NewsTag> findByIdNewsArticleID(String newsArticleID);
    void deleteByIdNewsArticleID(String newsArticleID);
    boolean existsByIdTagID(Integer tagID);
    void deleteByIdTagID(Integer tagID);
}

