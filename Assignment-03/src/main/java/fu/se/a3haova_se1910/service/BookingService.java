package fu.se.a3haova_se1910.service;

import fu.se.a3haova_se1910.dto.booking.*;
import fu.se.a3haova_se1910.entity.BookingDetail;
import fu.se.a3haova_se1910.entity.BookingDetailId;
import fu.se.a3haova_se1910.entity.BookingReservation;
import fu.se.a3haova_se1910.entity.Customer;
import fu.se.a3haova_se1910.entity.RoomInformation;
import fu.se.a3haova_se1910.exception.BadRequestException;
import fu.se.a3haova_se1910.exception.ResourceNotFoundException;
import fu.se.a3haova_se1910.exception.UnauthorizedException;
import fu.se.a3haova_se1910.repository.BookingDetailRepository;
import fu.se.a3haova_se1910.repository.BookingReservationRepository;
import fu.se.a3haova_se1910.repository.CustomerRepository;
import fu.se.a3haova_se1910.repository.RoomInformationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BookingService {

    private final BookingReservationRepository reservationRepository;
    private final BookingDetailRepository detailRepository;
    private final CustomerRepository customerRepository;
    private final RoomInformationRepository roomRepository;

    public BookingService(BookingReservationRepository reservationRepository,
                          BookingDetailRepository detailRepository,
                          CustomerRepository customerRepository,
                          RoomInformationRepository roomRepository) {
        this.reservationRepository = reservationRepository;
        this.detailRepository = detailRepository;
        this.customerRepository = customerRepository;
        this.roomRepository = roomRepository;
    }

    @Transactional
    public BookingReservationDto createBooking(Integer customerId, CreateBookingRequest request) {
        if (request.getItems() == null || request.getItems().isEmpty()) {
            throw new BadRequestException("At least one room must be included in the booking reservation.");
        }

        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with ID: " + customerId));

        if (customer.getCustomerStatus() != null && customer.getCustomerStatus() == 0) {
            throw new BadRequestException("Customer account is inactive. Cannot create booking reservation.");
        }

        BookingReservation reservation = new BookingReservation();
        reservation.setCustomer(customer);
        reservation.setBookingDate(LocalDate.now());
        reservation.setBookingStatus((byte) 1); // 1 = Confirmed / Active

        BigDecimal calculatedTotal = BigDecimal.ZERO;
        List<BookingDetail> details = new ArrayList<>();

        for (BookingItemRequest item : request.getItems()) {
            if (item.getStartDate() == null || item.getEndDate() == null) {
                throw new BadRequestException("Start date and end date are required for each room.");
            }
            if (item.getEndDate().isBefore(item.getStartDate())) {
                throw new BadRequestException("End date cannot be earlier than start date for room ID: " + item.getRoomId());
            }

            RoomInformation room = roomRepository.findById(item.getRoomId())
                    .orElseThrow(() -> new ResourceNotFoundException("Room not found with ID: " + item.getRoomId()));

            if (room.getRoomStatus() != null && room.getRoomStatus() == 0) {
                throw new BadRequestException("Room " + room.getRoomNumber() + " is currently inactive.");
            }

            // Prevent duplicate room date collision within the same booking request
            for (BookingDetail priorDetail : details) {
                if (priorDetail.getRoomInformation().getRoomId().equals(room.getRoomId())) {
                    if (priorDetail.getStartDate().isBefore(item.getEndDate())
                            && priorDetail.getEndDate().isAfter(item.getStartDate())) {
                        throw new BadRequestException("Room " + room.getRoomNumber()
                                + " has conflicting date ranges within the same reservation request.");
                    }
                }
            }

            // Check for overlapping active reservations in database (status 1 = Confirmed / Active)
            boolean isOverlapping = detailRepository.hasOverlappingBooking(
                    room.getRoomId(),
                    item.getStartDate(),
                    item.getEndDate(),
                    (byte) 1
            );
            if (isOverlapping) {
                throw new BadRequestException("Room " + room.getRoomNumber() + " is already booked for the selected dates ("
                        + item.getStartDate() + " to " + item.getEndDate() + ").");
            }

            long days = ChronoUnit.DAYS.between(item.getStartDate(), item.getEndDate());
            if (days <= 0) {
                days = 1; // Minimum 1 day stay
            }

            BigDecimal roomPrice = room.getRoomPricePerDay() != null ? room.getRoomPricePerDay() : BigDecimal.ZERO;
            BigDecimal itemTotal = roomPrice.multiply(BigDecimal.valueOf(days));
            calculatedTotal = calculatedTotal.add(itemTotal);

            BookingDetail detail = new BookingDetail();
            detail.setRoomInformation(room);
            detail.setStartDate(item.getStartDate());
            detail.setEndDate(item.getEndDate());
            detail.setActualPrice(itemTotal);

            details.add(detail);
        }

        reservation.setTotalPrice(calculatedTotal);
        BookingReservation savedReservation = reservationRepository.save(reservation);

        for (BookingDetail detail : details) {
            detail.setId(new BookingDetailId(
                    savedReservation.getBookingReservationId(),
                    detail.getRoomInformation().getRoomId()
            ));
            savedReservation.addBookingDetail(detail);
        }

        return toDto(savedReservation);
    }

    @Transactional(readOnly = true)
    public List<BookingReservationDto> getCustomerBookings(Integer customerId) {
        return reservationRepository.findByCustomerIdOrderByBookingDateDesc(customerId).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public BookingReservationDto getCustomerBookingById(Integer customerId, Integer bookingId) {
        BookingReservation reservation = reservationRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking reservation not found with ID: " + bookingId));

        // Enforce ownership: customer can only view their own booking
        if (!reservation.getCustomer().getCustomerId().equals(customerId)) {
            throw new UnauthorizedException("Access denied: You can only view your own booking reservations.");
        }

        return toDto(reservation);
    }

    // Staff: view all bookings
    @Transactional(readOnly = true)
    public List<BookingReservationDto> getAllBookingsForStaff() {
        return reservationRepository.findAllByOrderByBookingDateDesc().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    // Staff: view single booking
    @Transactional(readOnly = true)
    public BookingReservationDto getBookingByIdForStaff(Integer bookingId) {
        BookingReservation reservation = reservationRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking reservation not found with ID: " + bookingId));
        return toDto(reservation);
    }

    @Transactional
    public BookingReservationDto updateBookingStatus(Integer bookingId, Byte status) {
        BookingReservation reservation = reservationRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking reservation not found with ID: " + bookingId));

        reservation.setBookingStatus(status);
        BookingReservation saved = reservationRepository.save(reservation);
        return toDto(saved);
    }

    @Transactional
    public void deleteBooking(Integer bookingId) {
        BookingReservation reservation = reservationRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking reservation not found with ID: " + bookingId));

        reservationRepository.delete(reservation);
    }

    public BookingReservationDto toDto(BookingReservation res) {
        List<BookingDetailDto> detailDtos = res.getBookingDetails().stream()
                .map(d -> new BookingDetailDto(
                        d.getRoomInformation() != null ? d.getRoomInformation().getRoomId() : null,
                        d.getRoomInformation() != null ? d.getRoomInformation().getRoomNumber() : "",
                        (d.getRoomInformation() != null && d.getRoomInformation().getRoomType() != null)
                                ? d.getRoomInformation().getRoomType().getRoomTypeName() : "",
                        d.getStartDate(),
                        d.getEndDate(),
                        d.getActualPrice()
                ))
                .collect(Collectors.toList());

        return new BookingReservationDto(
                res.getBookingReservationId(),
                res.getBookingDate(),
                res.getTotalPrice(),
                res.getCustomer() != null ? res.getCustomer().getCustomerId() : null,
                res.getCustomer() != null ? res.getCustomer().getCustomerFullName() : "",
                res.getCustomer() != null ? res.getCustomer().getEmailAddress() : "",
                res.getBookingStatus(),
                detailDtos
        );
    }
}

