import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getBookingsByUser, cancelBooking } from '../services/api';

function MyBookings() {
  const navigate = useNavigate();
  const user     = JSON.parse(localStorage.getItem('user'));
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => { fetchBookings(); }, []);

  const fetchBookings = async () => {
    try {
      const res = await getBookingsByUser(user.id);
      setBookings(res.data.reverse());
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    try {
      await cancelBooking(id);
      fetchBookings();
    } catch (e) { alert('Failed to cancel booking.'); }
  };

  const badge = (s) => `badge badge-${s?.toLowerCase()}`;

  const nights = (b) => Math.round(
    (new Date(b.checkOutDate) - new Date(b.checkInDate)) / (1000*60*60*24)
  );

  return (
    <div className="page">
      <div className="top-bar">
        <h1 className="page-title" style={{ margin: 0 }}>📋 My Bookings</h1>
        <button className="btn btn-gold" onClick={() => navigate('/rooms')}>+ New Booking</button>
      </div>

      {loading ? (
        <div className="loading">Loading bookings...</div>
      ) : bookings.length === 0 ? (
        <div className="empty-state">
          <p>You haven't made any bookings yet.</p>
          <br />
          <button className="btn btn-gold" onClick={() => navigate('/rooms')}>Browse Rooms</button>
        </div>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Room</th>
                <th>Type</th>
                <th>Check-in</th>
                <th>Check-out</th>
                <th>Nights</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map(b => (
                <tr key={b.id}>
                  <td>{b.id}</td>
                  <td>Room {b.room?.roomNumber}</td>
                  <td>{b.room?.roomType}</td>
                  <td>{b.checkInDate}</td>
                  <td>{b.checkOutDate}</td>
                  <td>{nights(b)}</td>
                  <td>₹{b.totalAmount?.toLocaleString()}</td>
                  <td>{b.paymentMethod || <span style={{ color: '#bbb' }}>Pending</span>}</td>
                  <td><span className={badge(b.status)}>{b.status}</span></td>
                  <td style={{ display: 'flex', gap: '6px' }}>
                    {b.status === 'PENDING' && (
                      <>
                        <button className="btn btn-gold btn-sm"
                          onClick={() => navigate(`/payment/${b.id}`)}>Pay</button>
                        <button className="btn btn-danger btn-sm"
                          onClick={() => handleCancel(b.id)}>Cancel</button>
                      </>
                    )}
                    {b.status === 'CONFIRMED' && (
                      <button className="btn btn-danger btn-sm"
                        onClick={() => handleCancel(b.id)}>Cancel</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default MyBookings;
