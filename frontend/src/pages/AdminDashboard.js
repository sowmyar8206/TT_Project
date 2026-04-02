import React, { useState, useEffect } from 'react';
import { getAllUsers, getAllRooms, getAllBookings, countAvailableRooms } from '../services/api';

function AdminDashboard() {
  const [stats, setStats]     = useState({ users: 0, rooms: 0, bookings: 0, available: 0 });
  const [recent, setRecent]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchStats(); }, []);

  const fetchStats = async () => {
    try {
      const [u, r, b, av] = await Promise.all([
        getAllUsers(), getAllRooms(), getAllBookings(), countAvailableRooms()
      ]);
      setStats({
        users: u.data.length,
        rooms: r.data.length,
        bookings: b.data.length,
        available: av.data.availableRooms
      });
      setRecent(b.data.reverse().slice(0, 8));
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const badge = (s) => `badge badge-${s?.toLowerCase()}`;

  const nights = (b) => {
    if (!b.checkInDate || !b.checkOutDate) return '—';
    return Math.round((new Date(b.checkOutDate) - new Date(b.checkInDate)) / (1000*60*60*24));
  };

  return (
    <div className="page">
      <h1 className="page-title">🛠️ Admin Dashboard</h1>

      {loading ? <div className="loading">Loading...</div> : (
        <>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-num">{stats.users}</div>
              <div className="stat-label">Total Users</div>
            </div>
            <div className="stat-card gold">
              <div className="stat-num">{stats.rooms}</div>
              <div className="stat-label">Total Rooms</div>
            </div>
            <div className="stat-card green">
              <div className="stat-num">{stats.available}</div>
              <div className="stat-label">Available Rooms</div>
            </div>
            <div className="stat-card red">
              <div className="stat-num">{stats.bookings}</div>
              <div className="stat-label">Total Bookings</div>
            </div>
          </div>

          <h3 style={{ marginBottom: '1rem', color: '#555' }}>Recent Bookings</h3>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr><th>#</th><th>Guest</th><th>Room</th><th>Check-in</th><th>Check-out</th><th>Nights</th><th>Total</th><th>Status</th></tr>
              </thead>
              <tbody>
                {recent.map(b => (
                  <tr key={b.id}>
                    <td>{b.id}</td>
                    <td>{b.user?.name}</td>
                    <td>Room {b.room?.roomNumber} ({b.room?.roomType})</td>
                    <td>{b.checkInDate}</td>
                    <td>{b.checkOutDate}</td>
                    <td>{nights(b)}</td>
                    <td>₹{b.totalAmount?.toLocaleString()}</td>
                    <td><span className={badge(b.status)}>{b.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

export default AdminDashboard;
