package com.hotelbooking.repository;

import com.hotelbooking.model.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RoomRepository extends JpaRepository<Room, Long> {
    List<Room> findByStatus(Room.RoomStatus status);
    List<Room> findByRoomType(Room.RoomType roomType);
    List<Room> findByStatusAndRoomType(Room.RoomStatus status, Room.RoomType roomType);
}
