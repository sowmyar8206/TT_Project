package com.hotelbooking.service;

import com.hotelbooking.model.Booking;
import com.hotelbooking.model.Room;
import com.hotelbooking.repository.BookingRepository;
import com.hotelbooking.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private RoomRepository roomRepository;

    public Booking createBooking(Booking booking) {
        Room room = roomRepository.findById(booking.getRoom().getId())
                .orElseThrow(() -> new RuntimeException("Room not found"));

        if (room.getStatus() != Room.RoomStatus.AVAILABLE) {
            throw new RuntimeException("Room is not available!");
        }

        long nights = booking.getNumberOfNights();
        if (nights <= 0) {
            throw new RuntimeException("Check-out must be after check-in!");
        }

        booking.setTotalAmount(nights * room.getPricePerNight());
        booking.setStatus(Booking.BookingStatus.PENDING);

        room.setStatus(Room.RoomStatus.BOOKED);
        roomRepository.save(room);

        return bookingRepository.save(booking);
    }

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    public Booking getBookingById(Long id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
    }

    public List<Booking> getBookingsByUser(Long userId) {
        return bookingRepository.findByUserId(userId);
    }

    public List<Booking> getBookingsByStatus(String status) {
        return bookingRepository.findByStatus(Booking.BookingStatus.valueOf(status.toUpperCase()));
    }

    public Booking updateBookingStatus(Long id, String status) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        Booking.BookingStatus newStatus = Booking.BookingStatus.valueOf(status.toUpperCase());
        booking.setStatus(newStatus);

        if (newStatus == Booking.BookingStatus.CANCELLED ||
            newStatus == Booking.BookingStatus.CHECKED_OUT) {
            Room room = booking.getRoom();
            room.setStatus(Room.RoomStatus.AVAILABLE);
            roomRepository.save(room);
        }

        return bookingRepository.save(booking);
    }

    public Booking confirmPayment(Long id, String paymentMethod) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        booking.setPaymentMethod(paymentMethod);
        booking.setStatus(Booking.BookingStatus.CONFIRMED);
        return bookingRepository.save(booking);
    }

    public void cancelBooking(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        booking.setStatus(Booking.BookingStatus.CANCELLED);
        Room room = booking.getRoom();
        room.setStatus(Room.RoomStatus.AVAILABLE);
        roomRepository.save(room);
        bookingRepository.save(booking);
    }

    public long getTotalBookings() {
        return bookingRepository.count();
    }
}
