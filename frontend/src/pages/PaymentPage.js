import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBookingById, confirmPayment } from '../services/api';

function PaymentPage() {
  const { bookingId } = useParams();
  const navigate      = useNavigate();
  const [booking, setBooking]   = useState(null);
  const [method, setMethod]     = useState('CASH');
  const [success, setSuccess]   = useState(false);
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    getBookingById(bookingId)
      .then(r => { setBooking(r.data); setLoading(false); })
      .catch(() => navigate('/my-bookings'));
  }, [bookingId]);

  const handlePay = async () => {
    setError('');
    try {
      await confirmPayment(bookingId, method);
      setSuccess(true);
    } catch (e) {
      setError('Payment failed. Please try again.');
    }
  };

  if (loading) return <div className="loading">Loading booking details...</div>;

  if (success) return (
    <div className="page">
      <div className="detail-card" style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>✅</div>
        <h2 style={{ color: '#27ae60', marginBottom: '0.5rem' }}>Payment Successful!</h2>
        <p style={{ color: '#666', marginBottom: '1.5rem' }}>
          Booking #{bookingId} is confirmed. Enjoy your stay at LuxeStay!
        </p>
        <button className="btn btn-primary" onClick={() => navigate('/my-bookings')}>
          View My Bookings
        </button>
      </div>
    </div>
  );

  const nights = booking
    ? Math.round((new Date(booking.checkOutDate) - new Date(booking.checkInDate)) / (1000*60*60*24))
    : 0;

  return (
    <div className="page">
      <div className="detail-card">
        <h2 style={{ marginBottom: '1.5rem' }}>💳 Complete Payment</h2>
        {error && <div className="alert alert-error">{error}</div>}

        <h4 style={{ color: '#777', marginBottom: '0.8rem' }}>Booking Summary</h4>
        <div className="detail-row">
          <span className="label">Booking ID</span>
          <span className="value">#{booking?.id}</span>
        </div>
        <div className="detail-row">
          <span className="label">Room</span>
          <span className="value">Room {booking?.room?.roomNumber} ({booking?.room?.roomType})</span>
        </div>
        <div className="detail-row">
          <span className="label">Check-in</span>
          <span className="value">{booking?.checkInDate}</span>
        </div>
        <div className="detail-row">
          <span className="label">Check-out</span>
          <span className="value">{booking?.checkOutDate}</span>
        </div>
        <div className="detail-row">
          <span className="label">Duration</span>
          <span className="value">{nights} night{nights > 1 ? 's' : ''}</span>
        </div>
        <div className="detail-row">
          <span className="label" style={{ fontSize: '1rem', fontWeight: 700 }}>Total Amount</span>
          <span className="value" style={{ fontSize: '1.2rem', fontWeight: 700, color: '#c8860a' }}>
            ₹{booking?.totalAmount?.toLocaleString()}
          </span>
        </div>

        <h4 style={{ color: '#777', margin: '1.5rem 0 0.8rem' }}>Payment Method</h4>
        {[
          { key: 'CASH',   label: '💵 Cash on Arrival' },
          { key: 'UPI',    label: '📱 UPI / GPay / PhonePe' },
          { key: 'CARD',   label: '💳 Credit / Debit Card' },
          { key: 'NETBANK',label: '🏦 Net Banking' },
        ].map(m => (
          <div key={m.key}
            className={`payment-method ${method === m.key ? 'selected' : ''}`}
            onClick={() => setMethod(m.key)}>
            <strong>{m.label}</strong>
          </div>
        ))}

        <button className="btn btn-gold" style={{ width: '100%', padding: '12px', fontSize: '1rem', marginTop: '1rem' }}
          onClick={handlePay}>
          Pay ₹{booking?.totalAmount?.toLocaleString()} →
        </button>
        <button className="btn btn-secondary" style={{ width: '100%', padding: '10px', marginTop: '0.6rem' }}
          onClick={() => navigate('/my-bookings')}>
          Pay Later
        </button>
      </div>
    </div>
  );
}

export default PaymentPage;
