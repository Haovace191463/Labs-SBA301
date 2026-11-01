package fu.se.a3haova_se1910;

import fu.se.a3haova_se1910.dto.booking.BookingItemRequest;
import fu.se.a3haova_se1910.dto.booking.BookingReservationDto;
import fu.se.a3haova_se1910.dto.booking.CreateBookingRequest;
import fu.se.a3haova_se1910.entity.BookingDetail;
import fu.se.a3haova_se1910.entity.BookingReservation;
import fu.se.a3haova_se1910.entity.Customer;
import fu.se.a3haova_se1910.entity.RoomInformation;
import fu.se.a3haova_se1910.repository.BookingDetailRepository;
import fu.se.a3haova_se1910.repository.BookingReservationRepository;
import fu.se.a3haova_se1910.repository.CustomerRepository;
import fu.se.a3haova_se1910.repository.RoomInformationRepository;
import fu.se.a3haova_se1910.service.BookingService;
import jakarta.persistence.EntityManager;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class BookingPersistenceIntegrationTest {

    @Autowired
    private BookingService bookingService;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private RoomInformationRepository roomRepository;

    @Autowired
    private BookingReservationRepository reservationRepository;

    @Autowired
    private BookingDetailRepository detailRepository;

    @Autowired
    private EntityManager entityManager;

    @Test
    @Transactional
    void testCreateBooking_PersistsSuccessfullyToSqlServer_WithoutNonUniqueObjectException() {
        // Retrieve seeded customer
        Customer customer = customerRepository.findAll().stream()
                .filter(c -> c.getCustomerStatus() != null && c.getCustomerStatus() == 1)
                .findFirst()
                .orElseThrow(() -> new IllegalStateException("No active customer found in database"));

        // Retrieve at least two active rooms
        List<RoomInformation> activeRooms = roomRepository.findAll().stream()
                .filter(r -> r.getRoomStatus() != null && r.getRoomStatus() == 1)
                .toList();

        assertTrue(activeRooms.size() >= 2, "Expected at least 2 active rooms for multi-room integration test");
        RoomInformation room1 = activeRooms.get(0);
        RoomInformation room2 = activeRooms.get(1);

        // Future dates to guarantee no collision with existing reservations
        LocalDate startDate = LocalDate.of(2032, 8, 10);
        LocalDate endDate = LocalDate.of(2032, 8, 15);

        BookingItemRequest item1 = new BookingItemRequest(room1.getRoomId(), startDate, endDate);
        BookingItemRequest item2 = new BookingItemRequest(room2.getRoomId(), startDate, endDate);
        CreateBookingRequest request = new CreateBookingRequest(customer.getCustomerId(), Arrays.asList(item1, item2));

        // Execute createBooking
        BookingReservationDto resultDto = bookingService.createBooking(customer.getCustomerId(), request);

        assertNotNull(resultDto, "Booking result DTO must not be null");
        assertNotNull(resultDto.getBookingReservationId(), "BookingReservation ID must be generated");
        assertEquals(2, resultDto.getBookingDetails().size(), "DTO should contain 2 booking details");

        // Force Hibernate to flush the persistence context and execute SQL INSERTs against SQL Server
        // This is where NonUniqueObjectException / DuplicateKeyException would occur if cascade or key mapping were broken.
        assertDoesNotThrow(() -> entityManager.flush(), "Flushing persistence context must not throw DuplicateKeyException");

        // Clear session cache to verify real persistence in the database
        entityManager.clear();

        // Query database directly to confirm physical rows
        BookingReservation persistedReservation = reservationRepository.findById(resultDto.getBookingReservationId())
                .orElseThrow(() -> new AssertionError("BookingReservation was not found in SQL Server"));
        assertEquals((byte) 1, persistedReservation.getBookingStatus());

        List<BookingDetail> persistedDetails = detailRepository.findByBookingReservation_BookingReservationId(resultDto.getBookingReservationId());
        assertEquals(2, persistedDetails.size(), "SQL Server should have exactly 2 BookingDetail rows for this reservation");

        for (BookingDetail detail : persistedDetails) {
            assertNotNull(detail.getId(), "BookingDetailId composite key must not be null");
            assertEquals(resultDto.getBookingReservationId(), detail.getId().getBookingReservationId(),
                    "Composite key BookingReservationID must match the parent reservation ID");
            assertNotNull(detail.getId().getRoomId(), "Composite key RoomID must not be null");
            assertNotNull(detail.getActualPrice(), "ActualPrice must be calculated and stored");
            assertEquals(startDate, detail.getStartDate());
            assertEquals(endDate, detail.getEndDate());
        }
    }

    @Test
    void testCustomerBookingHistory_WithoutOpenSession_LoadsBookingDetailsWithoutLazyInitializationException() {
        // Retrieve seeded customer
        Customer customer = customerRepository.findAll().stream()
                .filter(c -> c.getCustomerStatus() != null && c.getCustomerStatus() == 1)
                .findFirst()
                .orElseThrow(() -> new IllegalStateException("No active customer found in database"));

        // Note: This test method does NOT have @Transactional, simulating a real Web HTTP request
        // where spring.jpa.open-in-view=false and the Hibernate Session is closed after the service method returns.
        List<BookingReservationDto> bookings = bookingService.getCustomerBookings(customer.getCustomerId());

        assertNotNull(bookings, "Booking list should not be null");

        // If the customer has existing reservations (e.g., reservation 19), verify details are loaded
        for (BookingReservationDto b : bookings) {
            assertNotNull(b.getBookingReservationId());
            assertNotNull(b.getBookingDetails(), "Booking details collection must be loaded and non-null");
            // If the booking has items, verify details are mapped without LazyInitializationException
            for (var detail : b.getBookingDetails()) {
                assertNotNull(detail.getRoomNumber());
                assertNotNull(detail.getActualPrice());
            }
        }

        // Test single booking detail retrieval if reservation 19 exists
        if (reservationRepository.existsById(19)) {
            BookingReservationDto res19 = bookingService.getCustomerBookingById(customer.getCustomerId(), 19);
            assertNotNull(res19);
            assertEquals(19, res19.getBookingReservationId());
            assertNotNull(res19.getBookingDetails());
            assertFalse(res19.getBookingDetails().isEmpty(), "Reservation 19 must have its booking details loaded");
            assertNotNull(res19.getBookingDetails().get(0).getRoomNumber());

            // Staff single booking retrieval
            BookingReservationDto staffRes = bookingService.getBookingByIdForStaff(19);
            assertNotNull(staffRes);
            assertFalse(staffRes.getBookingDetails().isEmpty());
        }

        // Staff all bookings retrieval without open session
        List<BookingReservationDto> staffAll = bookingService.getAllBookingsForStaff();
        assertNotNull(staffAll);

        // Non-existent customer receives empty list
        List<BookingReservationDto> emptyResult = bookingService.getCustomerBookings(999999);
        assertNotNull(emptyResult);
        assertTrue(emptyResult.isEmpty());
    }
}

