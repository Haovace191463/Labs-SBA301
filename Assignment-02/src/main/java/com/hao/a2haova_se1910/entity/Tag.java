package com.hao.a2haova_se1910.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.Nationalized;

@Getter
@Setter
@Entity
@Table(name = "Tag")
public class Tag {
    @Id
    @Column(name = "TagID", nullable = false)
    private Integer id;

    @Size(max = 50)
    @Nationalized
    @Column(name = "TagName", length = 50)
    private String tagName;

    @Size(max = 400)
    @Nationalized
    @Column(name = "Note", length = 400)
    private String note;


}