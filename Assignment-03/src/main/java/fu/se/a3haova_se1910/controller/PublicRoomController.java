package fu.se.a3haova_se1910.controller;

import fu.se.a3haova_se1910.dto.common.ApiResponse;
import fu.se.a3haova_se1910.dto.room.RoomDto;
import fu.se.a3haova_se1910.dto.room.RoomTypeDto;
import fu.se.a3haova_se1910.service.RoomService;
import fu.se.a3haova_se1910.service.RoomTypeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api")
public class PublicRoomController {

    private final RoomService roomService;
    private final RoomTypeService roomTypeService;

    public PublicRoomController(RoomService roomService, RoomTypeService roomTypeService) {
        this.roomService = roomService;
        this.roomTypeService = roomTypeService;
    }

    // Public room listing - no authentication required
    @GetMapping("/rooms")
    public ResponseEntity<ApiResponse<List<RoomDto>>> getAllActiveRooms() {
        List<RoomDto> rooms = roomService.getAllActiveRooms();
        return ResponseEntity.ok(ApiResponse.ok("Rooms retrieved successfully", rooms));
    }

    // Public room search and filter
    @GetMapping("/rooms/search")
    public ResponseEntity<ApiResponse<List<RoomDto>>> searchRooms(
            @RequestParam(required = false) String roomNumber,
            @RequestParam(required = false) Integer roomTypeId,
            @RequestParam(required = false) Integer maxCapacity,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice
    ) {
        List<RoomDto> rooms = roomService.searchRooms(roomNumber, roomTypeId, maxCapacity, minPrice, maxPrice, (byte) 1);
        return ResponseEntity.ok(ApiResponse.ok("Search results retrieved successfully", rooms));
    }

    // Public single room details
    @GetMapping("/rooms/{id}")
    public ResponseEntity<ApiResponse<RoomDto>> getRoomById(@PathVariable Integer id) {
        RoomDto room = roomService.getRoomById(id);
        return ResponseEntity.ok(ApiResponse.ok("Room details retrieved successfully", room));
    }

    // Public room types
    @GetMapping("/room-types")
    public ResponseEntity<ApiResponse<List<RoomTypeDto>>> getAllRoomTypes() {
        List<RoomTypeDto> types = roomTypeService.getAllRoomTypes();
        return ResponseEntity.ok(ApiResponse.ok("Room types retrieved successfully", types));
    }

    @GetMapping("/room-types/{id}")
    public ResponseEntity<ApiResponse<RoomTypeDto>> getRoomTypeById(@PathVariable Integer id) {
        RoomTypeDto type = roomTypeService.getRoomTypeById(id);
        return ResponseEntity.ok(ApiResponse.ok("Room type retrieved successfully", type));
    }
}

