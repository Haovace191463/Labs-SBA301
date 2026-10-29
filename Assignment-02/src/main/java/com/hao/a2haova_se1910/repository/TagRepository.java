package com.hao.a2haova_se1910.repository;

import com.hao.a2haova_se1910.entity.Tag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TagRepository extends JpaRepository<Tag, Integer> {
    @Query("SELECT COALESCE(MAX(t.id), 0) + 1 FROM Tag t")
    Integer getNextTagId();

    boolean existsByTagNameIgnoreCase(String tagName);
    boolean existsByTagNameIgnoreCaseAndIdNot(String tagName, Integer id);
    Optional<Tag> findByTagName(String tagName);
    List<Tag> findByTagNameContainingIgnoreCase(String keyword);
}
