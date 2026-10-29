package com.hao.a2haova_se1910.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.hibernate.annotations.Nationalized;

import java.io.Serializable;

@Getter
@Setter
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
@Embeddable
public class NewsTagId implements Serializable {
    private static final long serialVersionUID = -5458072850211369633L;

    @Size(max = 20)
    @NotNull
    @Nationalized
    @Column(name = "NewsArticleID", nullable = false, length = 20)
    private String newsArticleID;

    @NotNull
    @Column(name = "TagID", nullable = false)
    private Integer tagID;
}
