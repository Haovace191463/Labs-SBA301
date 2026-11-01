package fu.se.a3haova_se1910.dto.room;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;

public class RoomRequest {

    @NotBlank(message = "Room number is required")
    @Size(max = 50, message = "Room number cannot exceed 50 characters")
    private String roomNumber;

    @Size(max = 250, message = "Room detail description cannot exceed 250 characters")
    private String roomDetailDescription;

    @NotNull(message = "Room max capacity is required")
    @Min(value = 1, message = "Capacity must be at least 1")
    private Integer roomMaxCapacity;

    @NotNull(message = "Room type ID is required")
    private Integer roomTypeId;

    private Byte roomStatus = 1; // Default to 1 (Active)

    @NotNull(message = "Room price per day is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Price per day must be greater than 0")
    private BigDecimal roomPricePerDay;

    public RoomRequest() {
    }

    public String getRoomNumber() {
        return roomNumber;
    }

    public void setRoomNumber(String roomNumber) {
        this.roomNumber = roomNumber;
    }

    public String getRoomDetailDescription() {
        return roomDetailDescription;
    }

    public void setRoomDetailDescription(String roomDetailDescription) {
        this.roomDetailDescription = roomDetailDescription;
    }

    public Integer getRoomMaxCapacity() {
        return roomMaxCapacity;
    }

    public void setRoomMaxCapacity(Integer roomMaxCapacity) {
        this.roomMaxCapacity = roomMaxCapacity;
    }

    public Integer getRoomTypeId() {
        return roomTypeId;
    }

    public void setRoomTypeId(Integer roomTypeId) {
        this.roomTypeId = roomTypeId;
    }

    public Byte getRoomStatus() {
        return roomStatus;
    }

    public void setRoomStatus(Byte roomStatus) {
        this.roomStatus = roomStatus;
    }

    public BigDecimal getRoomPricePerDay() {
        return roomPricePerDay;
    }

    public void setRoomPricePerDay(BigDecimal roomPricePerDay) {
        this.roomPricePerDay = roomPricePerDay;
    }
}

