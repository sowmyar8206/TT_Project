import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAvailableRooms, getAllRooms } from '../services/api';

const ROOM_ICONS = { SINGLE: '🛏️', DOUBLE: '🛏️🛏️', SUITE: '👑', DELUXE: '⭐', FAMILY: '👨‍👩‍👧‍👦' };
const ROOM_COLORS = { SINGLE: 'single', DOUBLE: 'double', SUITE: 'suite', DELUXE: 'deluxe', FAMILY: 'family' };

function Rooms() {
  const navigate = useNavigate();
  const [rooms, setRooms]         = useState([]);
  const [filtered, setFiltered]   = useState([]);
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [showAvail, setShowAvail] = useState(true);
  const [loading, setLoading]     = useState(true);

  useEffect(() => { fetchRooms(); }, [showAvail]);

  useEffect(() => {
    if (typeFilter === 'ALL') setFiltered(rooms);
    else setFiltered(rooms.filter(r => r.roomType === typeFilter));
  }, [typeFilter, rooms]);

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const res = showAvail ? await getAvailableRooms() : await getAllRooms();
      setRooms(res.data);
      setFiltered(res.data);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  return (
    <div className="page">
      <h1 className="page-title">🏨 Browse Rooms</h1>

      <div className="filter-bar">
        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
          <option value="ALL">All Types</option>
          <option value="SINGLE">Single</option>
          <option value="DOUBLE">Double</option>
          <option value="SUITE">Suite</option>
          <option value="DELUXE">Deluxe</option>
          <option value="FAMILY">Family</option>
        </select>
        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', cursor: 'pointer' }}>
          <input type="checkbox" checked={showAvail} onChange={e => setShowAvail(e.target.checked)} />
          Available only
        </label>
        <span style={{ marginLeft: 'auto', fontSize: '0.88rem', color: '#777' }}>
          {filtered.length} room{filtered.length !== 1 ? 's' : ''} found
        </span>
      </div>

      {loading ? (
        <div className="loading">Loading rooms...</div>
      ) : filtered.length === 0 ? (
        <div className="empty-state"><p>No rooms found.</p></div>
      ) : (
        <div className="card-grid">
          {filtered.map(r => (
            <div className="card" key={r.id}>
              <div className={`room-img ${ROOM_COLORS[r.roomType]}`}>
                {ROOM_ICONS[r.roomType]}
              </div>
              <span className="room-type-badge">{r.roomType}</span>
              <h3>Room {r.roomNumber}</h3>
              <p>👥 Capacity: {r.capacity} guest{r.capacity > 1 ? 's' : ''}</p>
              <p>✨ {r.amenities || 'Standard amenities'}</p>
              <p style={{ fontSize: '0.82rem', color: '#999' }}>{r.description}</p>
              <div className="price">₹{r.pricePerNight?.toLocaleString()} / night</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className={`badge badge-${r.status?.toLowerCase()}`}>{r.status}</span>
                {r.status === 'AVAILABLE' && (
                  <button className="btn btn-gold btn-sm" onClick={() => navigate(`/book/${r.id}`)}>
                    Book Now
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Rooms;
