package com.hao.a2haova_se1910.repository;

import com.hao.a2haova_se1910.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Short> {
    boolean existsByCategoryNameIgnoreCase(String categoryName);
    boolean existsByCategoryNameIgnoreCaseAndIdNot(String categoryName, Short id);
    boolean existsByParentCategoryID_Id(Short parentId);
    List<Category> findByIsActive(Boolean isActive);
    List<Category> findByCategoryNameContainingIgnoreCase(String keyword);
}
