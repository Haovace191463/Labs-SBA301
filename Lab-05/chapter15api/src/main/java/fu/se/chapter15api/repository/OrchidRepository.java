package fu.se.chapter15api.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import fu.se.chapter15api.model.Orchid;

public interface OrchidRepository extends JpaRepository<Orchid, Integer> {
}
