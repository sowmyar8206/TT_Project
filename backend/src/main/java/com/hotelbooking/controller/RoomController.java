package com.hotelbooking.controller;

import com.hotelbooking.model.Room;
import com.hotelbooking.service.RoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/rooms")
public class RoomController {

    @Autowired
    private RoomService roomService;

    @PostMapping
    public ResponseEntity<?> addRoom(@RequestBody Room room) {
        try {
            return ResponseEntity.ok(roomService.addRoom(room));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<List<Room>> getAllRooms() {
        return ResponseEntity.ok(roomService.getAllRooms());
    }

    @GetMapping("/available")
    public ResponseEntity<List<Room>> getAvailableRooms() {
        return ResponseEntity.ok(roomService.getAvailableRooms());
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<List<Room>> getRoomsByType(@PathVariable String type) {
        return ResponseEntity.ok(roomService.getRoomsByType(type));
    }

    @GetMapping("/available/type/{type}")
    public ResponseEntity<List<Room>> getAvailableRoomsByType(@PathVariable String type) {
        return ResponseEntity.ok(roomService.getAvailableRoomsByType(type));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getRoomById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(roomService.getRoomById(id));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateRoom(@PathVariable Long id, @RequestBody Room room) {
        try {
            return ResponseEntity.ok(roomService.updateRoom(id, room));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteRoom(@PathVariable Long id) {
        roomService.deleteRoom(id);
        return ResponseEntity.ok(Map.of("message", "Room deleted"));
    }

    @GetMapping("/stats/available-count")
    public ResponseEntity<?> countAvailable() {
        return ResponseEntity.ok(Map.of("availableRooms", roomService.countAvailableRooms()));
    }
}
