package fu.se.a3haova_se1910.controller;

import fu.se.a3haova_se1910.dto.booking.BookingReservationDto;
import fu.se.a3haova_se1910.dto.booking.CreateBookingRequest;
import fu.se.a3haova_se1910.dto.common.ApiResponse;
import fu.se.a3haova_se1910.dto.customer.CustomerDto;
import fu.se.a3haova_se1910.dto.customer.CustomerProfileUpdateRequest;
import fu.se.a3haova_se1910.exception.UnauthorizedException;
import fu.se.a3haova_se1910.security.UserPrincipal;
import fu.se.a3haova_se1910.service.BookingService;
import fu.se.a3haova_se1910.service.CustomerService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customer")
public class CustomerController {

    private final CustomerService customerService;
    private final BookingService bookingService;

    public CustomerController(CustomerService customerService, BookingService bookingService) {
        this.customerService = customerService;
        this.bookingService = bookingService;
    }

    private Integer getCustomerId(UserPrincipal principal) {
        if (principal == null || principal.getCustomerId() == null) {
            throw new UnauthorizedException("Authenticated customer context not found");
        }
        return principal.getCustomerId();
    }

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<CustomerDto>> getProfile(@AuthenticationPrincipal UserPrincipal principal) {
        Integer customerId = getCustomerId(principal);
        CustomerDto profile = customerService.getProfile(customerId);
        return ResponseEntity.ok(ApiResponse.ok("Customer profile retrieved successfully", profile));
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<CustomerDto>> updateProfile(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody CustomerProfileUpdateRequest request) {
        Integer customerId = getCustomerId(principal);
        CustomerDto updated = customerService.updateProfile(customerId, request);
        return ResponseEntity.ok(ApiResponse.ok("Profile updated successfully", updated));
    }

    @PostMapping("/bookings")
    public ResponseEntity<ApiResponse<BookingReservationDto>> createBooking(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody CreateBookingRequest request) {
        Integer customerId = getCustomerId(principal);
        BookingReservationDto reservation = bookingService.createBooking(customerId, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Booking reservation created successfully", reservation));
    }

    @GetMapping("/bookings")
    public ResponseEntity<ApiResponse<List<BookingReservationDto>>> getBookingHistory(
            @AuthenticationPrincipal UserPrincipal principal) {
        Integer customerId = getCustomerId(principal);
        List<BookingReservationDto> bookings = bookingService.getCustomerBookings(customerId);
        return ResponseEntity.ok(ApiResponse.ok("Booking history retrieved successfully", bookings));
    }

    @GetMapping("/bookings/{id}")
    public ResponseEntity<ApiResponse<BookingReservationDto>> getBookingDetail(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Integer id) {
        Integer customerId = getCustomerId(principal);
        BookingReservationDto booking = bookingService.getCustomerBookingById(customerId, id);
        return ResponseEntity.ok(ApiResponse.ok("Booking details retrieved successfully", booking));
    }
}

