package fu.se.a3haova_se1910.dto.booking;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public class BookingReservationDto {

    private Integer bookingReservationId;
    private LocalDate bookingDate;
    private BigDecimal totalPrice;
    private Integer customerId;
    private String customerFullName;
    private String customerEmail;
    private Byte bookingStatus; // 1 = Confirmed, 2 = Completed, 0 = Cancelled
    private List<BookingDetailDto> bookingDetails = new ArrayList<>();

    public BookingReservationDto() {
    }

    public BookingReservationDto(Integer bookingReservationId, LocalDate bookingDate, BigDecimal totalPrice,
                                 Integer customerId, String customerFullName, String customerEmail,
                                 Byte bookingStatus, List<BookingDetailDto> bookingDetails) {
        this.bookingReservationId = bookingReservationId;
        this.bookingDate = bookingDate;
        this.totalPrice = totalPrice;
        this.customerId = customerId;
        this.customerFullName = customerFullName;
        this.customerEmail = customerEmail;
        this.bookingStatus = bookingStatus;
        this.bookingDetails = bookingDetails;
    }

    public Integer getBookingReservationId() {
        return bookingReservationId;
    }

    public void setBookingReservationId(Integer bookingReservationId) {
        this.bookingReservationId = bookingReservationId;
    }

    public LocalDate getBookingDate() {
        return bookingDate;
    }

    public void setBookingDate(LocalDate bookingDate) {
        this.bookingDate = bookingDate;
    }

    public BigDecimal getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(BigDecimal totalPrice) {
        this.totalPrice = totalPrice;
    }

    public Integer getCustomerId() {
        return customerId;
    }

    public void setCustomerId(Integer customerId) {
        this.customerId = customerId;
    }

    public String getCustomerFullName() {
        return customerFullName;
    }

    public void setCustomerFullName(String customerFullName) {
        this.customerFullName = customerFullName;
    }

    public String getCustomerEmail() {
        return customerEmail;
    }

    public void setCustomerEmail(String customerEmail) {
        this.customerEmail = customerEmail;
    }

    public Byte getBookingStatus() {
        return bookingStatus;
    }

    public void setBookingStatus(Byte bookingStatus) {
        this.bookingStatus = bookingStatus;
    }

    public List<BookingDetailDto> getBookingDetails() {
        return bookingDetails;
    }

    public void setBookingDetails(List<BookingDetailDto> bookingDetails) {
        this.bookingDetails = bookingDetails;
    }
}

