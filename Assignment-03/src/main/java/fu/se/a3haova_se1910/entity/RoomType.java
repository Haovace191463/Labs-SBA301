package fu.se.a3haova_se1910.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "RoomType")
public class RoomType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "RoomTypeID")
    private Integer roomTypeId;

    @Column(name = "RoomTypeName", length = 50, nullable = false)
    private String roomTypeName;

    @Column(name = "TypeDescription", length = 250)
    private String typeDescription;

    @Column(name = "TypeNote", length = 250)
    private String typeNote;

    @OneToMany(mappedBy = "roomType", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<RoomInformation> rooms = new ArrayList<>();

    public RoomType() {
    }

    public RoomType(Integer roomTypeId, String roomTypeName, String typeDescription, String typeNote) {
        this.roomTypeId = roomTypeId;
        this.roomTypeName = roomTypeName;
        this.typeDescription = typeDescription;
        this.typeNote = typeNote;
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

    public String getTypeDescription() {
        return typeDescription;
    }

    public void setTypeDescription(String typeDescription) {
        this.typeDescription = typeDescription;
    }

    public String getTypeNote() {
        return typeNote;
    }

    public void setTypeNote(String typeNote) {
        this.typeNote = typeNote;
    }

    public List<RoomInformation> getRooms() {
        return rooms;
    }

    public void setRooms(List<RoomInformation> rooms) {
        this.rooms = rooms;
    }
}

