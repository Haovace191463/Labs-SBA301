package com.hao.a2haova_se1910.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.Nationalized;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.Instant;

@Getter
@Setter
@Entity
@Table(name = "NewsArticle")
public class NewsArticle {
    @Id
    @Size(max = 20)
    @Nationalized
    @Column(name = "NewsArticleID", nullable = false, length = 20)
    private String newsArticleID;

    @Size(max = 400)
    @Nationalized
    @Column(name = "NewsTitle", length = 400)
    private String newsTitle;

    @Size(max = 150)
    @NotNull
    @Nationalized
    @Column(name = "Headline", nullable = false, length = 150)
    private String headline;

    @Column(name = "CreatedDate")
    private Instant createdDate;

    @Size(max = 4000)
    @Nationalized
    @Column(name = "NewsContent", length = 4000)
    private String newsContent;

    @Size(max = 400)
    @Nationalized
    @Column(name = "NewsSource", length = 400)
    private String newsSource;

    @ManyToOne(fetch = FetchType.LAZY)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "CategoryID")
    private Category categoryID;

    @Column(name = "NewsStatus")
    private Boolean newsStatus;

    @Column(name = "CreatedByID")
    private Short createdByID;

    @Column(name = "UpdatedByID")
    private Short updatedByID;

    @Column(name = "ModifiedDate")
    private Instant modifiedDate;


}