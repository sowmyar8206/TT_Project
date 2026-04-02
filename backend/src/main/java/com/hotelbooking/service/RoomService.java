package com.hotelbooking.service;

import com.hotelbooking.model.Room;
import com.hotelbooking.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class RoomService {

    @Autowired
    private RoomRepository roomRepository;

    public Room addRoom(Room room) {
        return roomRepository.save(room);
    }

    public List<Room> getAllRooms() {
        return roomRepository.findAll();
    }

    public List<Room> getAvailableRooms() {
        return roomRepository.findByStatus(Room.RoomStatus.AVAILABLE);
    }

    public List<Room> getRoomsByType(String type) {
        return roomRepository.findByRoomType(Room.RoomType.valueOf(type.toUpperCase()));
    }

    public List<Room> getAvailableRoomsByType(String type) {
        return roomRepository.findByStatusAndRoomType(
                Room.RoomStatus.AVAILABLE,
                Room.RoomType.valueOf(type.toUpperCase())
        );
    }

    public Room getRoomById(Long id) {
        return roomRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Room not found"));
    }

    public Room updateRoom(Long id, Room updated) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Room not found"));
        room.setRoomNumber(updated.getRoomNumber());
        room.setRoomType(updated.getRoomType());
        room.setPricePerNight(updated.getPricePerNight());
        room.setCapacity(updated.getCapacity());
        room.setDescription(updated.getDescription());
        room.setAmenities(updated.getAmenities());
        room.setStatus(updated.getStatus());
        return roomRepository.save(room);
    }

    public void deleteRoom(Long id) {
        roomRepository.deleteById(id);
    }

    public long countAvailableRooms() {
        return roomRepository.findByStatus(Room.RoomStatus.AVAILABLE).size();
    }
}
