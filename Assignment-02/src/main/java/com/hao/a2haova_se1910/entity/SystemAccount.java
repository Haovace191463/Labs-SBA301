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
@Table(name = "SystemAccount")
public class SystemAccount {
    @Id
    @Column(name = "AccountID", nullable = false)
    private Short id;

    @Size(max = 100)
    @Nationalized
    @Column(name = "AccountName", length = 100)
    private String accountName;

    @Size(max = 70)
    @Nationalized
    @Column(name = "AccountEmail", length = 70)
    private String accountEmail;

    @Column(name = "AccountRole")
    private Integer accountRole;

    @Size(max = 70)
    @Nationalized
    @Column(name = "AccountPassword", length = 70)
    private String accountPassword;


}