package fu.se.a3haova_se1910.service;

import fu.se.a3haova_se1910.entity.RoomInformation;
import fu.se.a3haova_se1910.entity.RoomType;
import fu.se.a3haova_se1910.repository.BookingDetailRepository;
import fu.se.a3haova_se1910.repository.RoomInformationRepository;
import fu.se.a3haova_se1910.repository.RoomTypeRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RoomServiceTest {

    @Mock
    private RoomInformationRepository roomRepository;

    @Mock
    private RoomTypeRepository roomTypeRepository;

    @Mock
    private BookingDetailRepository bookingDetailRepository;

    @InjectMocks
    private RoomService roomService;

    @Test
    void testDeleteRoom_WhenNotInBookingDetail_PhysicallyDeletes() {
        RoomType type = new RoomType(1, "Standard", "Desc", "Note");
        RoomInformation room = new RoomInformation(10, "101", "Desc", 2, type, (byte) 1, BigDecimal.valueOf(100));

        when(roomRepository.findById(10)).thenReturn(Optional.of(room));
        // Room has never been booked
        when(bookingDetailRepository.existsByRoomInformation_RoomId(10)).thenReturn(false);

        String result = roomService.deleteRoom(10);

        verify(roomRepository, times(1)).delete(room);
        verify(roomRepository, never()).save(any());
        assertTrue(result.contains("successfully deleted"));
    }

    @Test
    void testDeleteRoom_WhenStoredInBookingDetail_ChangesStatusToZero() {
        RoomType type = new RoomType(1, "Standard", "Desc", "Note");
        RoomInformation room = new RoomInformation(10, "101", "Desc", 2, type, (byte) 1, BigDecimal.valueOf(100));

        when(roomRepository.findById(10)).thenReturn(Optional.of(room));
        // Room is referenced in a booking detail!
        when(bookingDetailRepository.existsByRoomInformation_RoomId(10)).thenReturn(true);

        String result = roomService.deleteRoom(10);

        // Verify room is NOT deleted, but saved with status 0
        verify(roomRepository, never()).delete(any());
        verify(roomRepository, times(1)).save(room);
        assertEquals((byte) 0, room.getRoomStatus());
        assertTrue(result.contains("Status successfully changed to inactive"));
    }
}

