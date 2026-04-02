import React, { useState, useEffect } from 'react';
import { getAllBookings, updateBookingStatus, cancelBooking } from '../services/api';

function ManageBookings() {
  const [bookings, setBookings] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [loading, setLoading]   = useState(true);

  useEffect(() => { fetchBookings(); }, []);

  useEffect(() => {
    if (statusFilter === 'ALL') setFiltered(bookings);
    else setFiltered(bookings.filter(b => b.status === statusFilter));
  }, [statusFilter, bookings]);

  const fetchBookings = async () => {
    try {
      const res = await getAllBookings();
      setBookings(res.data.reverse());
      setFiltered(res.data);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const handleStatusChange = async (id, status) => {
    try { await updateBookingStatus(id, status); fetchBookings(); }
    catch (e) { alert('Failed to update status.'); }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this booking?')) return;
    try { await cancelBooking(id); fetchBookings(); }
    catch (e) { alert('Failed to cancel.'); }
  };

  const badge = (s) => `badge badge-${s?.toLowerCase()}`;

  const nights = (b) => {
    if (!b.checkInDate || !b.checkOutDate) return '—';
    return Math.round((new Date(b.checkOutDate) - new Date(b.checkInDate)) / (1000*60*60*24));
  };

  const STATUSES = ['PENDING', 'CONFIRMED', 'CHECKED_IN', 'CHECKED_OUT', 'CANCELLED'];

  return (
    <div className="page">
      <h1 className="page-title">📋 All Bookings</h1>

      <div className="filter-bar">
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="ALL">All Status</option>
          {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <span style={{ fontSize: '0.88rem', color: '#777' }}>
          {filtered.length} booking{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {loading ? <div className="loading">Loading...</div> : filtered.length === 0 ? (
        <div className="empty-state"><p>No bookings found.</p></div>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>#</th><th>Guest</th><th>Room</th><th>Check-in</th>
                <th>Check-out</th><th>Nights</th><th>Total</th>
                <th>Payment</th><th>Status</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(b => (
                <tr key={b.id}>
                  <td>{b.id}</td>
                  <td>
                    <div>{b.user?.name}</div>
                    <div style={{ fontSize: '0.78rem', color: '#999' }}>{b.user?.email}</div>
                  </td>
                  <td>Room {b.room?.roomNumber}<br /><span style={{ fontSize: '0.78rem', color: '#999' }}>{b.room?.roomType}</span></td>
                  <td>{b.checkInDate}</td>
                  <td>{b.checkOutDate}</td>
                  <td>{nights(b)}</td>
                  <td>₹{b.totalAmount?.toLocaleString()}</td>
                  <td>{b.paymentMethod || <span style={{ color: '#bbb' }}>—</span>}</td>
                  <td><span className={badge(b.status)}>{b.status}</span></td>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {b.status === 'CONFIRMED' && (
                        <button className="btn btn-success btn-sm"
                          onClick={() => handleStatusChange(b.id, 'CHECKED_IN')}>Check In</button>
                      )}
                      {b.status === 'CHECKED_IN' && (
                        <button className="btn btn-primary btn-sm"
                          onClick={() => handleStatusChange(b.id, 'CHECKED_OUT')}>Check Out</button>
                      )}
                      {(b.status === 'PENDING' || b.status === 'CONFIRMED') && (
                        <button className="btn btn-danger btn-sm"
                          onClick={() => handleCancel(b.id)}>Cancel</button>
                      )}
                    </div>
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

export default ManageBookings;
