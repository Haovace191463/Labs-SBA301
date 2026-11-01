package fu.se.a3haova_se1910.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "BookingDetail")
public class BookingDetail {

    @EmbeddedId
    private BookingDetailId id = new BookingDetailId();

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("bookingReservationId")
    @JoinColumn(name = "BookingReservationID", nullable = false)
    @JsonIgnore
    private BookingReservation bookingReservation;

    @ManyToOne(fetch = FetchType.EAGER)
    @MapsId("roomId")
    @JoinColumn(name = "RoomID", nullable = false)
    private RoomInformation roomInformation;

    @Column(name = "StartDate")
    private LocalDate startDate;

    @Column(name = "EndDate")
    private LocalDate endDate;

    @Column(name = "ActualPrice", precision = 18, scale = 2)
    private BigDecimal actualPrice;

    public BookingDetail() {
    }

    public BookingDetail(BookingReservation bookingReservation, RoomInformation roomInformation,
                         LocalDate startDate, LocalDate endDate, BigDecimal actualPrice) {
        this.bookingReservation = bookingReservation;
        this.roomInformation = roomInformation;
        this.startDate = startDate;
        this.endDate = endDate;
        this.actualPrice = actualPrice;
        if (bookingReservation != null && roomInformation != null) {
            this.id = new BookingDetailId(bookingReservation.getBookingReservationId(), roomInformation.getRoomId());
        }
    }

    public BookingDetailId getId() {
        return id;
    }

    public void setId(BookingDetailId id) {
        this.id = id;
    }

    public BookingReservation getBookingReservation() {
        return bookingReservation;
    }

    public void setBookingReservation(BookingReservation bookingReservation) {
        this.bookingReservation = bookingReservation;
        if (bookingReservation != null) {
            if (this.id == null) this.id = new BookingDetailId();
            this.id.setBookingReservationId(bookingReservation.getBookingReservationId());
        }
    }

    public RoomInformation getRoomInformation() {
        return roomInformation;
    }

    public void setRoomInformation(RoomInformation roomInformation) {
        this.roomInformation = roomInformation;
        if (roomInformation != null) {
            if (this.id == null) this.id = new BookingDetailId();
            this.id.setRoomId(roomInformation.getRoomId());
        }
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public BigDecimal getActualPrice() {
        return actualPrice;
    }

    public void setActualPrice(BigDecimal actualPrice) {
        this.actualPrice = actualPrice;
    }
}

