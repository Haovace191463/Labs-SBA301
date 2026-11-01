package fu.se.a3haova_se1910.repository;

import fu.se.a3haova_se1910.entity.RoomType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoomTypeRepository extends JpaRepository<RoomType, Integer> {
    Optional<RoomType> findByRoomTypeName(String roomTypeName);
}

