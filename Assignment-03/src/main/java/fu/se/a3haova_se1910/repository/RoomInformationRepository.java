package fu.se.a3haova_se1910.repository;

import fu.se.a3haova_se1910.entity.RoomInformation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface RoomInformationRepository extends JpaRepository<RoomInformation, Integer> {

    Optional<RoomInformation> findByRoomNumber(String roomNumber);

    boolean existsByRoomNumber(String roomNumber);

    boolean existsByRoomNumberAndRoomIdNot(String roomNumber, Integer roomId);

    List<RoomInformation> findByRoomStatus(Byte roomStatus);

    @Query("SELECT r FROM RoomInformation r WHERE " +
           "(:roomNumber IS NULL OR LOWER(r.roomNumber) LIKE LOWER(CONCAT('%', :roomNumber, '%'))) AND " +
           "(:roomTypeId IS NULL OR r.roomType.roomTypeId = :roomTypeId) AND " +
           "(:maxCapacity IS NULL OR r.roomMaxCapacity >= :maxCapacity) AND " +
           "(:minPrice IS NULL OR r.roomPricePerDay >= :minPrice) AND " +
           "(:maxPrice IS NULL OR r.roomPricePerDay <= :maxPrice) AND " +
           "(:roomStatus IS NULL OR r.roomStatus = :roomStatus)")
    List<RoomInformation> searchRooms(
            @Param("roomNumber") String roomNumber,
            @Param("roomTypeId") Integer roomTypeId,
            @Param("maxCapacity") Integer maxCapacity,
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice,
            @Param("roomStatus") Byte roomStatus
    );
}

