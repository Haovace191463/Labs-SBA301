package fu.se.a3haova_se1910.repository;

import fu.se.a3haova_se1910.entity.BookingDetail;
import fu.se.a3haova_se1910.entity.BookingDetailId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface BookingDetailRepository extends JpaRepository<BookingDetail, BookingDetailId> {

    boolean existsByRoomInformation_RoomId(Integer roomId);

    List<BookingDetail> findByBookingReservation_BookingReservationId(Integer bookingReservationId);

    @Query("SELECT CASE WHEN COUNT(bd) > 0 THEN true ELSE false END FROM BookingDetail bd " +
           "WHERE bd.roomInformation.roomId = :roomId " +
           "AND bd.bookingReservation.bookingStatus = :activeStatus " +
           "AND bd.startDate < :requestedEndDate " +
           "AND bd.endDate > :requestedStartDate")
    boolean hasOverlappingBooking(
            @Param("roomId") Integer roomId,
            @Param("requestedStartDate") LocalDate requestedStartDate,
            @Param("requestedEndDate") LocalDate requestedEndDate,
            @Param("activeStatus") Byte activeStatus
    );
}


