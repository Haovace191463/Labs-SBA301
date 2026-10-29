package com.hao.a2haova_se1910.repository;

import com.hao.a2haova_se1910.entity.SystemAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SystemAccountRepository extends JpaRepository<SystemAccount, Short> {
    Optional<SystemAccount> findByAccountEmailIgnoreCase(String accountEmail);
    Optional<SystemAccount> findByAccountEmail(String accountEmail);
    boolean existsByAccountEmailIgnoreCase(String accountEmail);
    boolean existsByAccountEmailIgnoreCaseAndIdNot(String accountEmail, Short id);
    @Query("SELECT COALESCE(MAX(a.id), 0) + 1 FROM SystemAccount a")
    Short getNextAccountId();
    List<SystemAccount> findByAccountNameContainingIgnoreCaseOrAccountEmailContainingIgnoreCase(String name, String email);
}
