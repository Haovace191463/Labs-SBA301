package fu.se.a3haova_se1910.controller;

import fu.se.a3haova_se1910.dto.common.ApiResponse;
import fu.se.a3haova_se1910.dto.room.RoomDto;
import fu.se.a3haova_se1910.dto.room.RoomRequest;
import fu.se.a3haova_se1910.dto.room.RoomTypeDto;
import fu.se.a3haova_se1910.service.RoomService;
import fu.se.a3haova_se1910.service.RoomTypeService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/staff")
public class StaffRoomController {

    private final RoomService roomService;
    private final RoomTypeService roomTypeService;

    public StaffRoomController(RoomService roomService, RoomTypeService roomTypeService) {
        this.roomService = roomService;
        this.roomTypeService = roomTypeService;
    }

    // --- Room Endpoints ---

    @GetMapping("/rooms")
    public ResponseEntity<ApiResponse<List<RoomDto>>> getAllRooms() {
        List<RoomDto> rooms = roomService.getAllRoomsForStaff();
        return ResponseEntity.ok(ApiResponse.ok("All rooms retrieved successfully", rooms));
    }

    @GetMapping("/rooms/{id}")
    public ResponseEntity<ApiResponse<RoomDto>> getRoomById(@PathVariable Integer id) {
        RoomDto room = roomService.getRoomById(id);
        return ResponseEntity.ok(ApiResponse.ok("Room retrieved successfully", room));
    }

    @PostMapping("/rooms")
    public ResponseEntity<ApiResponse<RoomDto>> createRoom(@Valid @RequestBody RoomRequest request) {
        RoomDto created = roomService.createRoom(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Room created successfully", created));
    }

    @PutMapping("/rooms/{id}")
    public ResponseEntity<ApiResponse<RoomDto>> updateRoom(
            @PathVariable Integer id,
            @Valid @RequestBody RoomRequest request) {
        RoomDto updated = roomService.updateRoom(id, request);
        return ResponseEntity.ok(ApiResponse.ok("Room updated successfully", updated));
    }

    @DeleteMapping("/rooms/{id}")
    public ResponseEntity<ApiResponse<String>> deleteRoom(@PathVariable Integer id) {
        String message = roomService.deleteRoom(id);
        return ResponseEntity.ok(ApiResponse.ok(message, message));
    }

    // --- Room Type Endpoints ---

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

    @PostMapping("/room-types")
    public ResponseEntity<ApiResponse<RoomTypeDto>> createRoomType(@Valid @RequestBody RoomTypeDto dto) {
        RoomTypeDto created = roomTypeService.createRoomType(dto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Room type created successfully", created));
    }

    @PutMapping("/room-types/{id}")
    public ResponseEntity<ApiResponse<RoomTypeDto>> updateRoomType(
            @PathVariable Integer id,
            @Valid @RequestBody RoomTypeDto dto) {
        RoomTypeDto updated = roomTypeService.updateRoomType(id, dto);
        return ResponseEntity.ok(ApiResponse.ok("Room type updated successfully", updated));
    }

    @DeleteMapping("/room-types/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteRoomType(@PathVariable Integer id) {
        roomTypeService.deleteRoomType(id);
        return ResponseEntity.ok(ApiResponse.ok("Room type deleted successfully", null));
    }
}

