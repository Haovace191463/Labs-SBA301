package fu.se.a3haova_se1910.repository;

import fu.se.a3haova_se1910.entity.BookingReservation;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookingReservationRepository extends JpaRepository<BookingReservation, Integer> {

    @EntityGraph(attributePaths = {"bookingDetails", "bookingDetails.roomInformation", "bookingDetails.roomInformation.roomType"})
    List<BookingReservation> findByCustomerIdOrderByBookingDateDesc(Integer customerId);

    @EntityGraph(attributePaths = {"bookingDetails", "bookingDetails.roomInformation", "bookingDetails.roomInformation.roomType"})
    List<BookingReservation> findAllByOrderByBookingDateDesc();

    @Override
    @EntityGraph(attributePaths = {"bookingDetails", "bookingDetails.roomInformation", "bookingDetails.roomInformation.roomType"})
    Optional<BookingReservation> findById(Integer id);
}


