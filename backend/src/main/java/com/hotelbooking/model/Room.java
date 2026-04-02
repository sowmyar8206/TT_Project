package com.hotelbooking.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "rooms")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Room {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String roomNumber;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RoomType roomType;

    @Column(nullable = false)
    private Double pricePerNight;

    private Integer capacity;

    private String description;

    private String amenities;

    @Enumerated(EnumType.STRING)
    private RoomStatus status = RoomStatus.AVAILABLE;

    public enum RoomType {
        SINGLE, DOUBLE, SUITE, DELUXE, FAMILY
    }

    public enum RoomStatus {
        AVAILABLE, BOOKED, MAINTENANCE
    }
}
