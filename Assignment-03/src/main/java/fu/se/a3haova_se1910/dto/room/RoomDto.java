package fu.se.a3haova_se1910.dto.room;

import java.math.BigDecimal;

public class RoomDto {

    private Integer roomId;
    private String roomNumber;
    private String roomDetailDescription;
    private Integer roomMaxCapacity;
    private Integer roomTypeId;
    private String roomTypeName;
    private Byte roomStatus; // 1 = Active / Available, 0 = Inactive / Deleted
    private BigDecimal roomPricePerDay;

    public RoomDto() {
    }

    public RoomDto(Integer roomId, String roomNumber, String roomDetailDescription,
                   Integer roomMaxCapacity, Integer roomTypeId, String roomTypeName,
                   Byte roomStatus, BigDecimal roomPricePerDay) {
        this.roomId = roomId;
        this.roomNumber = roomNumber;
        this.roomDetailDescription = roomDetailDescription;
        this.roomMaxCapacity = roomMaxCapacity;
        this.roomTypeId = roomTypeId;
        this.roomTypeName = roomTypeName;
        this.roomStatus = roomStatus;
        this.roomPricePerDay = roomPricePerDay;
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

    public String getRoomTypeName() {
        return roomTypeName;
    }

    public void setRoomTypeName(String roomTypeName) {
        this.roomTypeName = roomTypeName;
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

