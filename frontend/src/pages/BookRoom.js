import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getRoomById, createBooking } from '../services/api';

function BookRoom() {
  const { id }   = useParams();
  const navigate = useNavigate();
  const user     = JSON.parse(localStorage.getItem('user'));

  const [room, setRoom]   = useState(null);
  const [form, setForm]   = useState({ checkInDate: '', checkOutDate: '', specialRequests: '' });
  const [nights, setNights] = useState(0);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRoomById(id).then(r => { setRoom(r.data); setLoading(false); }).catch(() => navigate('/rooms'));
  }, [id]);

  useEffect(() => {
    if (form.checkInDate && form.checkOutDate) {
      const diff = (new Date(form.checkOutDate) - new Date(form.checkInDate)) / (1000 * 60 * 60 * 24);
      setNights(diff > 0 ? diff : 0);
    }
  }, [form.checkInDate, form.checkOutDate]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (nights <= 0) { setError('Check-out date must be after check-in date.'); return; }
    try {
      const payload = {
        user: { id: user.id },
        room: { id: parseInt(id) },
        checkInDate: form.checkInDate,
        checkOutDate: form.checkOutDate,
        specialRequests: form.specialRequests
      };
      const res = await createBooking(payload);
      navigate(`/payment/${res.data.id}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Booking failed. Please try again.');
    }
  };

  const today = new Date().toISOString().split('T')[0];

  if (loading) return <div className="loading">Loading room details...</div>;

  return (
    <div className="page">
      <button className="btn btn-secondary btn-sm" style={{ marginBottom: '1rem' }}
        onClick={() => navigate('/rooms')}>← Back to Rooms</button>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', maxWidth: '900px' }}>
        {/* Room Info */}
        <div className="card">
          <div className={`room-img ${room?.roomType?.toLowerCase()}`} style={{ height: '160px' }}>
            {room?.roomType === 'SINGLE' && '🛏️'}
            {room?.roomType === 'DOUBLE' && '🛏️🛏️'}
            {room?.roomType === 'SUITE'  && '👑'}
            {room?.roomType === 'DELUXE' && '⭐'}
            {room?.roomType === 'FAMILY' && '👨‍👩‍👧‍👦'}
          </div>
          <span className="room-type-badge">{room?.roomType}</span>
          <h3 style={{ fontSize: '1.3rem' }}>Room {room?.roomNumber}</h3>
          <p>👥 Capacity: {room?.capacity} guests</p>
          <p>✨ {room?.amenities}</p>
          <p style={{ color: '#888', fontSize: '0.85rem', marginTop: '0.5rem' }}>{room?.description}</p>
          <div className="price" style={{ fontSize: '1.3rem' }}>
            ₹{room?.pricePerNight?.toLocaleString()} / night
          </div>
          {nights > 0 && (
            <div style={{ background: '#fffbea', border: '1px solid #f0c040', borderRadius: '6px', padding: '0.8rem', marginTop: '0.5rem' }}>
              <strong>{nights} night{nights > 1 ? 's' : ''}</strong> × ₹{room?.pricePerNight?.toLocaleString()}
              <br />
              <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#c8860a' }}>
                Total: ₹{(nights * room?.pricePerNight).toLocaleString()}
              </span>
            </div>
          )}
        </div>

        {/* Booking Form */}
        <div className="form-card" style={{ margin: 0 }}>
          <h2 style={{ textAlign: 'left', fontSize: '1.2rem', marginBottom: '1.2rem' }}>📅 Booking Details</h2>
          {error && <div className="alert alert-error">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Check-in Date</label>
              <input type="date" name="checkInDate" min={today}
                value={form.checkInDate} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Check-out Date</label>
              <input type="date" name="checkOutDate" min={form.checkInDate || today}
                value={form.checkOutDate} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Special Requests (optional)</label>
              <textarea name="specialRequests" rows={3}
                placeholder="e.g. Early check-in, extra pillow..."
                value={form.specialRequests} onChange={handleChange} />
            </div>
            <button type="submit" className="btn btn-gold" style={{ width: '100%', padding: '11px', fontSize: '1rem' }}>
              Proceed to Payment →
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default BookRoom;
