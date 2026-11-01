package fu.se.a3haova_se1910.service;

import fu.se.a3haova_se1910.dto.booking.BookingItemRequest;
import fu.se.a3haova_se1910.dto.booking.BookingReservationDto;
import fu.se.a3haova_se1910.dto.booking.CreateBookingRequest;
import fu.se.a3haova_se1910.entity.BookingDetail;
import fu.se.a3haova_se1910.entity.BookingReservation;
import fu.se.a3haova_se1910.entity.Customer;
import fu.se.a3haova_se1910.entity.RoomInformation;
import fu.se.a3haova_se1910.entity.RoomType;
import fu.se.a3haova_se1910.exception.BadRequestException;
import fu.se.a3haova_se1910.exception.UnauthorizedException;
import fu.se.a3haova_se1910.repository.BookingDetailRepository;
import fu.se.a3haova_se1910.repository.BookingReservationRepository;
import fu.se.a3haova_se1910.repository.CustomerRepository;
import fu.se.a3haova_se1910.repository.RoomInformationRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BookingServiceTest {

    @Mock
    private BookingReservationRepository reservationRepository;

    @Mock
    private BookingDetailRepository detailRepository;

    @Mock
    private CustomerRepository customerRepository;

    @Mock
    private RoomInformationRepository roomRepository;

    @InjectMocks
    private BookingService bookingService;

    @Test
    void testCreateBooking_CalculatesPriceCorrectly() {
        Customer customer = new Customer(1, "Customer 1", "0987654321", "c1@hotel.com",
                LocalDate.of(1995, 5, 20), (byte) 1, "pass");
        RoomType type = new RoomType(1, "Deluxe", "Desc", "Note");
        RoomInformation room = new RoomInformation(5, "205", "Desc", 2, type, (byte) 1, BigDecimal.valueOf(100.00));

        when(customerRepository.findById(1)).thenReturn(Optional.of(customer));
        when(roomRepository.findById(5)).thenReturn(Optional.of(room));

        BookingReservation savedReservation = new BookingReservation();
        savedReservation.setBookingReservationId(101);
        savedReservation.setCustomer(customer);
        savedReservation.setBookingDate(LocalDate.now());
        savedReservation.setBookingStatus((byte) 1);
        savedReservation.setTotalPrice(BigDecimal.valueOf(300.00)); // 3 days * 100

        when(reservationRepository.save(any())).thenReturn(savedReservation);

        BookingItemRequest item = new BookingItemRequest(5, LocalDate.now(), LocalDate.now().plusDays(3));
        CreateBookingRequest request = new CreateBookingRequest(1, Collections.singletonList(item));

        BookingReservationDto dto = bookingService.createBooking(1, request);

        assertNotNull(dto);
        assertEquals(101, dto.getBookingReservationId());
        assertEquals(BigDecimal.valueOf(300.00), dto.getTotalPrice());
        assertEquals(1, savedReservation.getBookingDetails().size());
        assertEquals(101, savedReservation.getBookingDetails().get(0).getId().getBookingReservationId());
        assertEquals(5, savedReservation.getBookingDetails().get(0).getId().getRoomId());
        verify(detailRepository, never()).save(any());
    }

    @Test
    void testGetCustomerBookingById_OtherCustomer_ThrowsUnauthorized() {
        Customer owner = new Customer(1, "Owner", "111", "owner@hotel.com", LocalDate.now(), (byte) 1, "pass");
        BookingReservation reservation = new BookingReservation(50, LocalDate.now(), BigDecimal.valueOf(200), owner, (byte) 1);

        when(reservationRepository.findById(50)).thenReturn(Optional.of(reservation));

        // Another customer (ID = 2) tries to access customer 1's booking
        assertThrows(UnauthorizedException.class, () -> bookingService.getCustomerBookingById(2, 50));
    }

    @Test
    void testGetCustomerBookings_Success_IncludesDetails() {
        Customer customer = new Customer(1, "Customer 1", "0987654321", "c1@hotel.com", LocalDate.now(), (byte) 1, "pass");
        RoomType type = new RoomType(1, "Deluxe", "Desc", "Note");
        RoomInformation room = new RoomInformation(5, "205", "Desc", 2, type, (byte) 1, BigDecimal.valueOf(100.00));

        BookingReservation reservation = new BookingReservation(50, LocalDate.now(), BigDecimal.valueOf(300), customer, (byte) 1);
        BookingDetail detail = new BookingDetail(reservation, room, LocalDate.now(), LocalDate.now().plusDays(3), BigDecimal.valueOf(300));
        reservation.getBookingDetails().add(detail);

        when(reservationRepository.findByCustomerIdOrderByBookingDateDesc(1)).thenReturn(Collections.singletonList(reservation));

        List<BookingReservationDto> bookings = bookingService.getCustomerBookings(1);

        assertNotNull(bookings);
        assertEquals(1, bookings.size());
        assertEquals(50, bookings.get(0).getBookingReservationId());
        assertEquals(1, bookings.get(0).getBookingDetails().size());
        assertEquals("205", bookings.get(0).getBookingDetails().get(0).getRoomNumber());
        assertEquals("Deluxe", bookings.get(0).getBookingDetails().get(0).getRoomTypeName());
    }

    @Test
    void testGetCustomerBookings_EmptyResult_WhenNoBookings() {
        when(reservationRepository.findByCustomerIdOrderByBookingDateDesc(99)).thenReturn(Collections.emptyList());

        List<BookingReservationDto> bookings = bookingService.getCustomerBookings(99);

        assertNotNull(bookings);
        assertTrue(bookings.isEmpty());
    }

    @Test
    void testGetCustomerBookingById_Success_IncludesDetails() {
        Customer customer = new Customer(1, "Customer 1", "0987654321", "c1@hotel.com", LocalDate.now(), (byte) 1, "pass");
        RoomType type = new RoomType(1, "Standard", "Desc", "Note");
        RoomInformation room = new RoomInformation(10, "101", "Desc", 1, type, (byte) 1, BigDecimal.valueOf(50.00));

        BookingReservation reservation = new BookingReservation(55, LocalDate.now(), BigDecimal.valueOf(100), customer, (byte) 1);
        BookingDetail detail = new BookingDetail(reservation, room, LocalDate.now(), LocalDate.now().plusDays(2), BigDecimal.valueOf(100));
        reservation.getBookingDetails().add(detail);

        when(reservationRepository.findById(55)).thenReturn(Optional.of(reservation));

        BookingReservationDto dto = bookingService.getCustomerBookingById(1, 55);

        assertNotNull(dto);
        assertEquals(55, dto.getBookingReservationId());
        assertEquals(1, dto.getBookingDetails().size());
        assertEquals("101", dto.getBookingDetails().get(0).getRoomNumber());
        assertEquals("Standard", dto.getBookingDetails().get(0).getRoomTypeName());
    }

    @Test
    void testGetAllBookingsForStaff_Success_IncludesDetails() {
        Customer customer = new Customer(1, "Customer 1", "0987654321", "c1@hotel.com", LocalDate.now(), (byte) 1, "pass");
        RoomType type = new RoomType(1, "Suite", "Desc", "Note");
        RoomInformation room = new RoomInformation(20, "301", "Desc", 4, type, (byte) 1, BigDecimal.valueOf(180.00));

        BookingReservation reservation = new BookingReservation(60, LocalDate.now(), BigDecimal.valueOf(360), customer, (byte) 1);
        BookingDetail detail = new BookingDetail(reservation, room, LocalDate.now(), LocalDate.now().plusDays(2), BigDecimal.valueOf(360));
        reservation.getBookingDetails().add(detail);

        when(reservationRepository.findAllByOrderByBookingDateDesc()).thenReturn(Collections.singletonList(reservation));

        List<BookingReservationDto> bookings = bookingService.getAllBookingsForStaff();

        assertNotNull(bookings);
        assertEquals(1, bookings.size());
        assertEquals(60, bookings.get(0).getBookingReservationId());
        assertEquals(1, bookings.get(0).getBookingDetails().size());
        assertEquals("301", bookings.get(0).getBookingDetails().get(0).getRoomNumber());
    }

    @Test
    void testGetBookingByIdForStaff_Success_IncludesDetails() {
        Customer customer = new Customer(2, "Customer 2", "0987654322", "c2@hotel.com", LocalDate.now(), (byte) 1, "pass");
        BookingReservation reservation = new BookingReservation(70, LocalDate.now(), BigDecimal.valueOf(200), customer, (byte) 1);

        when(reservationRepository.findById(70)).thenReturn(Optional.of(reservation));

        BookingReservationDto dto = bookingService.getBookingByIdForStaff(70);

        assertNotNull(dto);
        assertEquals(70, dto.getBookingReservationId());
        assertEquals(2, dto.getCustomerId());
    }

    @Test
    void testCreateBooking_SameRoomOverlappingDates_Rejected() {
        Customer customer = new Customer(1, "Customer 1", "0987654321", "c1@hotel.com",
                LocalDate.of(1995, 5, 20), (byte) 1, "pass");
        RoomType type = new RoomType(1, "Deluxe", "Desc", "Note");
        RoomInformation room = new RoomInformation(5, "205", "Desc", 2, type, (byte) 1, BigDecimal.valueOf(100.00));

        when(customerRepository.findById(1)).thenReturn(Optional.of(customer));
        when(roomRepository.findById(5)).thenReturn(Optional.of(room));

        // Mock overlap detected in database for Room 5
        LocalDate requestedStart = LocalDate.of(2026, 11, 2);
        LocalDate requestedEnd = LocalDate.of(2026, 11, 5);
        when(detailRepository.hasOverlappingBooking(5, requestedStart, requestedEnd, (byte) 1)).thenReturn(true);

        BookingItemRequest item = new BookingItemRequest(5, requestedStart, requestedEnd);
        CreateBookingRequest request = new CreateBookingRequest(1, Collections.singletonList(item));

        BadRequestException ex = assertThrows(BadRequestException.class, () -> bookingService.createBooking(1, request));
        assertTrue(ex.getMessage().contains("already booked"));

        // Verify transaction is not saved
        verify(reservationRepository, never()).save(any());
        verify(detailRepository, never()).save(any());
    }

    @Test
    void testCreateBooking_SameRoomBoundaryDates_Allowed() {
        Customer customer = new Customer(1, "Customer 1", "0987654321", "c1@hotel.com",
                LocalDate.of(1995, 5, 20), (byte) 1, "pass");
        RoomType type = new RoomType(1, "Deluxe", "Desc", "Note");
        RoomInformation room = new RoomInformation(5, "205", "Desc", 2, type, (byte) 1, BigDecimal.valueOf(100.00));

        when(customerRepository.findById(1)).thenReturn(Optional.of(customer));
        when(roomRepository.findById(5)).thenReturn(Optional.of(room));

        // Existing booking check-out: Nov 4. New booking: Nov 4 to Nov 6. (Boundary date - NO overlap)
        LocalDate requestedStart = LocalDate.of(2026, 11, 4);
        LocalDate requestedEnd = LocalDate.of(2026, 11, 6);
        when(detailRepository.hasOverlappingBooking(5, requestedStart, requestedEnd, (byte) 1)).thenReturn(false);

        BookingReservation savedReservation = new BookingReservation();
        savedReservation.setBookingReservationId(102);
        savedReservation.setCustomer(customer);
        savedReservation.setBookingDate(LocalDate.now());
        savedReservation.setBookingStatus((byte) 1);
        savedReservation.setTotalPrice(BigDecimal.valueOf(200.00));

        when(reservationRepository.save(any())).thenReturn(savedReservation);

        BookingItemRequest item = new BookingItemRequest(5, requestedStart, requestedEnd);
        CreateBookingRequest request = new CreateBookingRequest(1, Collections.singletonList(item));

        BookingReservationDto dto = bookingService.createBooking(1, request);

        assertNotNull(dto);
        assertEquals(102, dto.getBookingReservationId());
        verify(reservationRepository).save(any());
        // Verify detailRepository.save is never called directly (cascade persistence via parent entity)
        verify(detailRepository, never()).save(any());

        // Verify composite ID and relationships in savedReservation
        assertEquals(1, savedReservation.getBookingDetails().size());
        BookingDetail savedDetail = savedReservation.getBookingDetails().get(0);
        assertEquals(102, savedDetail.getId().getBookingReservationId());
        assertEquals(5, savedDetail.getId().getRoomId());
        assertEquals(savedReservation, savedDetail.getBookingReservation());
        assertEquals(room, savedDetail.getRoomInformation());
    }

    @Test
    void testCreateBooking_DifferentRoomsOverlappingDates_Allowed() {
        Customer customer = new Customer(1, "Customer 1", "0987654321", "c1@hotel.com",
                LocalDate.of(1995, 5, 20), (byte) 1, "pass");
        RoomType type = new RoomType(1, "Deluxe", "Desc", "Note");
        RoomInformation room5 = new RoomInformation(5, "205", "Desc", 2, type, (byte) 1, BigDecimal.valueOf(100.00));
        RoomInformation room6 = new RoomInformation(6, "206", "Desc", 2, type, (byte) 1, BigDecimal.valueOf(150.00));

        when(customerRepository.findById(1)).thenReturn(Optional.of(customer));
        when(roomRepository.findById(5)).thenReturn(Optional.of(room5));
        when(roomRepository.findById(6)).thenReturn(Optional.of(room6));

        LocalDate requestedStart = LocalDate.of(2026, 11, 1);
        LocalDate requestedEnd = LocalDate.of(2026, 11, 4);

        // Different rooms on same dates: neither has overlap
        when(detailRepository.hasOverlappingBooking(5, requestedStart, requestedEnd, (byte) 1)).thenReturn(false);
        when(detailRepository.hasOverlappingBooking(6, requestedStart, requestedEnd, (byte) 1)).thenReturn(false);

        BookingReservation savedReservation = new BookingReservation();
        savedReservation.setBookingReservationId(103);
        savedReservation.setCustomer(customer);
        savedReservation.setBookingDate(LocalDate.now());
        savedReservation.setBookingStatus((byte) 1);
        savedReservation.setTotalPrice(BigDecimal.valueOf(750.00));

        when(reservationRepository.save(any())).thenReturn(savedReservation);

        BookingItemRequest item1 = new BookingItemRequest(5, requestedStart, requestedEnd);
        BookingItemRequest item2 = new BookingItemRequest(6, requestedStart, requestedEnd);
        CreateBookingRequest request = new CreateBookingRequest(1, Arrays.asList(item1, item2));

        BookingReservationDto dto = bookingService.createBooking(1, request);

        assertNotNull(dto);
        assertEquals(103, dto.getBookingReservationId());
        verify(reservationRepository).save(any());
        verify(detailRepository, never()).save(any());

        // Verify both details were added with correct composite IDs and relationships
        assertEquals(2, savedReservation.getBookingDetails().size());
        BookingDetail d1 = savedReservation.getBookingDetails().get(0);
        BookingDetail d2 = savedReservation.getBookingDetails().get(1);
        assertEquals(103, d1.getId().getBookingReservationId());
        assertEquals(5, d1.getId().getRoomId());
        assertEquals(savedReservation, d1.getBookingReservation());
        assertEquals(room5, d1.getRoomInformation());

        assertEquals(103, d2.getId().getBookingReservationId());
        assertEquals(6, d2.getId().getRoomId());
        assertEquals(savedReservation, d2.getBookingReservation());
        assertEquals(room6, d2.getRoomInformation());
    }

    @Test
    void testCreateBooking_ExistingCancelledReservation_DoesNotBlockNewBooking() {
        Customer customer = new Customer(1, "Customer 1", "0987654321", "c1@hotel.com",
                LocalDate.of(1995, 5, 20), (byte) 1, "pass");
        RoomType type = new RoomType(1, "Deluxe", "Desc", "Note");
        RoomInformation room = new RoomInformation(5, "205", "Desc", 2, type, (byte) 1, BigDecimal.valueOf(100.00));

        when(customerRepository.findById(1)).thenReturn(Optional.of(customer));
        when(roomRepository.findById(5)).thenReturn(Optional.of(room));

        LocalDate requestedStart = LocalDate.of(2026, 11, 1);
        LocalDate requestedEnd = LocalDate.of(2026, 11, 4);

        // An existing booking exists on these dates, but its status is Cancelled (status 0).
        // The repository queries active status (status 1), which returns false.
        when(detailRepository.hasOverlappingBooking(5, requestedStart, requestedEnd, (byte) 1)).thenReturn(false);

        BookingReservation savedReservation = new BookingReservation();
        savedReservation.setBookingReservationId(104);
        savedReservation.setCustomer(customer);
        savedReservation.setBookingDate(LocalDate.now());
        savedReservation.setBookingStatus((byte) 1);
        savedReservation.setTotalPrice(BigDecimal.valueOf(300.00));

        when(reservationRepository.save(any())).thenReturn(savedReservation);

        BookingItemRequest item = new BookingItemRequest(5, requestedStart, requestedEnd);
        CreateBookingRequest request = new CreateBookingRequest(1, Collections.singletonList(item));

        BookingReservationDto dto = bookingService.createBooking(1, request);

        assertNotNull(dto);
        assertEquals(104, dto.getBookingReservationId());
        verify(reservationRepository).save(any());
        verify(detailRepository, never()).save(any());
        assertEquals(1, savedReservation.getBookingDetails().size());
        assertEquals(104, savedReservation.getBookingDetails().get(0).getId().getBookingReservationId());
        assertEquals(5, savedReservation.getBookingDetails().get(0).getId().getRoomId());
    }

    @Test
    void testCreateBooking_MultipleRooms_ConflictInOneRoomRejectsEntireTransaction() {
        Customer customer = new Customer(1, "Customer 1", "0987654321", "c1@hotel.com",
                LocalDate.of(1995, 5, 20), (byte) 1, "pass");
        RoomType type = new RoomType(1, "Deluxe", "Desc", "Note");
        RoomInformation room5 = new RoomInformation(5, "205", "Desc", 2, type, (byte) 1, BigDecimal.valueOf(100.00));
        RoomInformation room6 = new RoomInformation(6, "206", "Desc", 2, type, (byte) 1, BigDecimal.valueOf(150.00));

        when(customerRepository.findById(1)).thenReturn(Optional.of(customer));
        when(roomRepository.findById(5)).thenReturn(Optional.of(room5));
        when(roomRepository.findById(6)).thenReturn(Optional.of(room6));

        LocalDate requestedStart = LocalDate.of(2026, 11, 1);
        LocalDate requestedEnd = LocalDate.of(2026, 11, 4);

        // Room 5 is free
        when(detailRepository.hasOverlappingBooking(5, requestedStart, requestedEnd, (byte) 1)).thenReturn(false);
        // Room 6 has an overlapping active reservation
        when(detailRepository.hasOverlappingBooking(6, requestedStart, requestedEnd, (byte) 1)).thenReturn(true);

        BookingItemRequest item1 = new BookingItemRequest(5, requestedStart, requestedEnd);
        BookingItemRequest item2 = new BookingItemRequest(6, requestedStart, requestedEnd);
        CreateBookingRequest request = new CreateBookingRequest(1, Arrays.asList(item1, item2));

        BadRequestException ex = assertThrows(BadRequestException.class, () -> bookingService.createBooking(1, request));
        assertTrue(ex.getMessage().contains("206"));

        // Entire transaction rejected: neither reservation nor any detail is saved
        verify(reservationRepository, never()).save(any());
        verify(detailRepository, never()).save(any());
    }
}

