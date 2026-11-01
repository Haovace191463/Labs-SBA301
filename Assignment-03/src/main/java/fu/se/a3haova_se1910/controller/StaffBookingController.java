package fu.se.a3haova_se1910.controller;

import fu.se.a3haova_se1910.dto.booking.BookingReservationDto;
import fu.se.a3haova_se1910.dto.booking.CreateBookingRequest;
import fu.se.a3haova_se1910.dto.common.ApiResponse;
import fu.se.a3haova_se1910.exception.BadRequestException;
import fu.se.a3haova_se1910.service.BookingService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/staff/bookings")
public class StaffBookingController {

    private final BookingService bookingService;

    public StaffBookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<BookingReservationDto>>> getAllBookings() {
        List<BookingReservationDto> bookings = bookingService.getAllBookingsForStaff();
        return ResponseEntity.ok(ApiResponse.ok("Booking reservations retrieved successfully", bookings));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<BookingReservationDto>> getBookingById(@PathVariable Integer id) {
        BookingReservationDto booking = bookingService.getBookingByIdForStaff(id);
        return ResponseEntity.ok(ApiResponse.ok("Booking details retrieved successfully", booking));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<BookingReservationDto>> createBooking(@Valid @RequestBody CreateBookingRequest request) {
        if (request.getCustomerId() == null) {
            throw new BadRequestException("Customer ID is required when staff creates a booking reservation");
        }
        BookingReservationDto booking = bookingService.createBooking(request.getCustomerId(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Booking reservation created successfully", booking));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<BookingReservationDto>> updateBookingStatus(
            @PathVariable Integer id,
            @RequestBody Map<String, Byte> payload) {
        Byte status = payload.get("status");
        if (status == null) {
            throw new BadRequestException("Status is required (1 = Confirmed, 2 = Completed, 0 = Cancelled)");
        }
        BookingReservationDto updated = bookingService.updateBookingStatus(id, status);
        return ResponseEntity.ok(ApiResponse.ok("Booking status updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteBooking(@PathVariable Integer id) {
        bookingService.deleteBooking(id);
        return ResponseEntity.ok(ApiResponse.ok("Booking reservation deleted successfully", null));
    }
}

