package com.hao.a2haova_se1910.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.Nationalized;

@Getter
@Setter
@Entity
@Table(name = "Category")
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "CategoryID", nullable = false)
    private Short id;

    @NotBlank(message = "Category name is required")
    @Size(max = 100, message = "Category name must not exceed 100 characters")
    @Nationalized
    @Column(name = "CategoryName", nullable = false, length = 100)
    private String categoryName;

    @NotBlank(message = "Category description is required")
    @Size(max = 250, message = "Category description must not exceed 250 characters")
    @Nationalized
    @Column(name = "CategoryDesciption", nullable = false, length = 250)
    private String categoryDesciption;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ParentCategoryID")
    private Category parentCategoryID;

    @Column(name = "IsActive")
    private Boolean isActive;

    @Transient
    private Short parentCategoryId;

    public Category getParentCategoryID() {
        return parentCategoryID;
    }

    public void setParentCategoryID(Category parentCategoryID) {
        this.parentCategoryID = parentCategoryID;
    }

    @JsonProperty("parentCategoryId")
    public Short getParentCategoryId() {
        if (parentCategoryId != null) {
            return parentCategoryId;
        }
        return parentCategoryID != null ? parentCategoryID.getId() : null;
    }

    @JsonProperty("parentCategoryId")
    public void setParentCategoryId(Short parentCategoryId) {
        this.parentCategoryId = parentCategoryId;
    }
}
