package com.orchidhouse.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.orchidhouse.model.Orchid;

public interface OrchidRepository extends JpaRepository<Orchid, Long> {
}
