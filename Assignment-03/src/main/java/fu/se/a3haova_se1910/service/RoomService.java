package fu.se.a3haova_se1910.service;

import fu.se.a3haova_se1910.dto.room.RoomDto;
import fu.se.a3haova_se1910.dto.room.RoomRequest;
import fu.se.a3haova_se1910.entity.RoomInformation;
import fu.se.a3haova_se1910.entity.RoomType;
import fu.se.a3haova_se1910.exception.BadRequestException;
import fu.se.a3haova_se1910.exception.ResourceNotFoundException;
import fu.se.a3haova_se1910.repository.BookingDetailRepository;
import fu.se.a3haova_se1910.repository.RoomInformationRepository;
import fu.se.a3haova_se1910.repository.RoomTypeRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class RoomService {

    private final RoomInformationRepository roomRepository;
    private final RoomTypeRepository roomTypeRepository;
    private final BookingDetailRepository bookingDetailRepository;

    public RoomService(RoomInformationRepository roomRepository,
                       RoomTypeRepository roomTypeRepository,
                       BookingDetailRepository bookingDetailRepository) {
        this.roomRepository = roomRepository;
        this.roomTypeRepository = roomTypeRepository;
        this.bookingDetailRepository = bookingDetailRepository;
    }

    // Public: get only active rooms
    public List<RoomDto> getAllActiveRooms() {
        return roomRepository.findByRoomStatus((byte) 1).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    // Staff: get all rooms regardless of status
    public List<RoomDto> getAllRoomsForStaff() {
        return roomRepository.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public RoomDto getRoomById(Integer id) {
        RoomInformation room = roomRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found with ID: " + id));
        return toDto(room);
    }

    public List<RoomDto> searchRooms(String roomNumber, Integer roomTypeId, Integer maxCapacity,
                                     BigDecimal minPrice, BigDecimal maxPrice, Byte status) {
        return roomRepository.searchRooms(roomNumber, roomTypeId, maxCapacity, minPrice, maxPrice, status)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public RoomDto createRoom(RoomRequest request) {
        if (roomRepository.existsByRoomNumber(request.getRoomNumber().trim())) {
            throw new BadRequestException("Room number already exists: " + request.getRoomNumber());
        }

        RoomType roomType = roomTypeRepository.findById(request.getRoomTypeId())
                .orElseThrow(() -> new ResourceNotFoundException("Room type not found with ID: " + request.getRoomTypeId()));

        RoomInformation room = new RoomInformation();
        room.setRoomNumber(request.getRoomNumber().trim());
        room.setRoomDetailDescription(request.getRoomDetailDescription());
        room.setRoomMaxCapacity(request.getRoomMaxCapacity());
        room.setRoomType(roomType);
        room.setRoomStatus(request.getRoomStatus() != null ? request.getRoomStatus() : (byte) 1);
        room.setRoomPricePerDay(request.getRoomPricePerDay());

        RoomInformation saved = roomRepository.save(room);
        return toDto(saved);
    }

    @Transactional
    public RoomDto updateRoom(Integer id, RoomRequest request) {
        RoomInformation room = roomRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found with ID: " + id));

        if (roomRepository.existsByRoomNumberAndRoomIdNot(request.getRoomNumber().trim(), id)) {
            throw new BadRequestException("Room number already in use by another room: " + request.getRoomNumber());
        }

        RoomType roomType = roomTypeRepository.findById(request.getRoomTypeId())
                .orElseThrow(() -> new ResourceNotFoundException("Room type not found with ID: " + request.getRoomTypeId()));

        room.setRoomNumber(request.getRoomNumber().trim());
        room.setRoomDetailDescription(request.getRoomDetailDescription());
        room.setRoomMaxCapacity(request.getRoomMaxCapacity());
        room.setRoomType(roomType);
        if (request.getRoomStatus() != null) {
            room.setRoomStatus(request.getRoomStatus());
        }
        room.setRoomPricePerDay(request.getRoomPricePerDay());

        RoomInformation saved = roomRepository.save(room);
        return toDto(saved);
    }

    @Transactional
    public String deleteRoom(Integer id) {
        RoomInformation room = roomRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found with ID: " + id));

        // Assignment 03 Critical Business Rule:
        // "The delete action will delete room information in the case this information is not belong to any renting transaction.
        // If the room information is already stored in a booking detail, just change the status."
        boolean isReferencedInBooking = bookingDetailRepository.existsByRoomInformation_RoomId(id);

        if (isReferencedInBooking) {
            room.setRoomStatus((byte) 0); // Change status to Inactive / Deleted
            roomRepository.save(room);
            return "Room is referenced in booking history. Status successfully changed to inactive (soft deleted).";
        } else {
            roomRepository.delete(room);
            return "Room is not referenced in any booking. Room successfully deleted from database.";
        }
    }

    public RoomDto toDto(RoomInformation r) {
        return new RoomDto(
                r.getRoomId(),
                r.getRoomNumber(),
                r.getRoomDetailDescription(),
                r.getRoomMaxCapacity(),
                r.getRoomType() != null ? r.getRoomType().getRoomTypeId() : null,
                r.getRoomType() != null ? r.getRoomType().getRoomTypeName() : null,
                r.getRoomStatus(),
                r.getRoomPricePerDay()
        );
    }
}

