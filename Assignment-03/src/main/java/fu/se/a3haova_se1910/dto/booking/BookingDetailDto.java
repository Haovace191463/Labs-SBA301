package fu.se.a3haova_se1910.dto.booking;

import java.math.BigDecimal;
import java.time.LocalDate;

public class BookingDetailDto {

    private Integer roomId;
    private String roomNumber;
    private String roomTypeName;
    private LocalDate startDate;
    private LocalDate endDate;
    private BigDecimal actualPrice;

    public BookingDetailDto() {
    }

    public BookingDetailDto(Integer roomId, String roomNumber, String roomTypeName,
                            LocalDate startDate, LocalDate endDate, BigDecimal actualPrice) {
        this.roomId = roomId;
        this.roomNumber = roomNumber;
        this.roomTypeName = roomTypeName;
        this.startDate = startDate;
        this.endDate = endDate;
        this.actualPrice = actualPrice;
    }

    public Integer getRoomId() {
        return roomId;
    }

    public void setRoomId(Integer roomId) {
        this.roomId = roomId;
    }

    public String getRoomNumber() {
        return roomNumber;
    }

    public void setRoomNumber(String roomNumber) {
        this.roomNumber = roomNumber;
    }

    public String getRoomTypeName() {
        return roomTypeName;
    }

    public void setRoomTypeName(String roomTypeName) {
        this.roomTypeName = roomTypeName;
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

