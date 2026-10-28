package com.orchidhouse.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.orchidhouse.model.Category;

public interface CategoryRepository extends JpaRepository<Category, Long> {
}
