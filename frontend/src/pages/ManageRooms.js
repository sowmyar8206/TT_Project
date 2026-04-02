import React, { useState, useEffect } from 'react';
import { getAllRooms, addRoom, updateRoom, deleteRoom } from '../services/api';

const EMPTY = { roomNumber: '', roomType: 'SINGLE', pricePerNight: '', capacity: '', description: '', amenities: '', status: 'AVAILABLE' };

function ManageRooms() {
  const [rooms, setRooms]     = useState([]);
  const [form, setForm]       = useState(EMPTY);
  const [editId, setEditId]   = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchRooms(); }, []);

  const fetchRooms = async () => {
    try { const r = await getAllRooms(); setRooms(r.data); }
    catch (e) { console.error(e); }
    setLoading(false);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault(); setError('');
    try {
      const payload = { ...form, pricePerNight: parseFloat(form.pricePerNight), capacity: parseInt(form.capacity) };
      if (editId) await updateRoom(editId, payload);
      else        await addRoom(payload);
      setForm(EMPTY); setEditId(null); setShowForm(false);
      fetchRooms();
    } catch (e) { setError(e.response?.data?.error || 'Failed to save room.'); }
  };

  const handleEdit = (r) => {
    setForm({ roomNumber: r.roomNumber, roomType: r.roomType, pricePerNight: r.pricePerNight, capacity: r.capacity, description: r.description || '', amenities: r.amenities || '', status: r.status });
    setEditId(r.id); setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this room?')) return;
    try { await deleteRoom(id); fetchRooms(); }
    catch (e) { alert('Failed to delete room.'); }
  };

  const badge = (s) => `badge badge-${s?.toLowerCase()}`;

  return (
    <div className="page">
      <div className="top-bar">
        <h1 className="page-title" style={{ margin: 0 }}>🛏️ Manage Rooms</h1>
        <button className="btn btn-gold" onClick={() => { setShowForm(!showForm); setEditId(null); setForm(EMPTY); }}>
          {showForm ? 'Cancel' : '+ Add Room'}
        </button>
      </div>

      {showForm && (
        <div style={{ background: 'white', borderRadius: '12px', padding: '1.8rem', marginBottom: '1.5rem', boxShadow: '0 2px 10px rgba(0,0,0,0.08)' }}>
          <h3 style={{ marginBottom: '1.2rem', color: '#1a2c45' }}>{editId ? 'Edit Room' : 'Add New Room'}</h3>
          {error && <div className="alert alert-error">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Room Number</label>
                <input name="roomNumber" value={form.roomNumber} onChange={handleChange} placeholder="e.g. 101" required />
              </div>
              <div className="form-group">
                <label>Room Type</label>
                <select name="roomType" value={form.roomType} onChange={handleChange}>
                  <option value="SINGLE">Single</option>
                  <option value="DOUBLE">Double</option>
                  <option value="SUITE">Suite</option>
                  <option value="DELUXE">Deluxe</option>
                  <option value="FAMILY">Family</option>
                </select>
              </div>
              <div className="form-group">
                <label>Price Per Night (₹)</label>
                <input name="pricePerNight" type="number" value={form.pricePerNight} onChange={handleChange} placeholder="e.g. 2500" required />
              </div>
              <div className="form-group">
                <label>Capacity (guests)</label>
                <input name="capacity" type="number" value={form.capacity} onChange={handleChange} placeholder="e.g. 2" required />
              </div>
              <div className="form-group">
                <label>Amenities</label>
                <input name="amenities" value={form.amenities} onChange={handleChange} placeholder="e.g. AC, WiFi, TV" />
              </div>
              <div className="form-group">
                <label>Status</label>
                <select name="status" value={form.status} onChange={handleChange}>
                  <option value="AVAILABLE">Available</option>
                  <option value="BOOKED">Booked</option>
                  <option value="MAINTENANCE">Maintenance</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea name="description" rows={2} value={form.description} onChange={handleChange}
                placeholder="Brief description of the room..." />
            </div>
            <button type="submit" className="btn btn-gold">{editId ? 'Update Room' : 'Add Room'}</button>
          </form>
        </div>
      )}

      {loading ? <div className="loading">Loading rooms...</div> : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr><th>Room #</th><th>Type</th><th>Price/Night</th><th>Capacity</th><th>Amenities</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {rooms.map(r => (
                <tr key={r.id}>
                  <td><strong>{r.roomNumber}</strong></td>
                  <td>{r.roomType}</td>
                  <td>₹{r.pricePerNight?.toLocaleString()}</td>
                  <td>{r.capacity} guests</td>
                  <td style={{ maxWidth: '160px', fontSize: '0.82rem' }}>{r.amenities || '—'}</td>
                  <td><span className={badge(r.status)}>{r.status}</span></td>
                  <td style={{ display: 'flex', gap: '6px' }}>
                    <button className="btn btn-secondary btn-sm" onClick={() => handleEdit(r)}>Edit</button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(r.id)}>Delete</button>
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

export default ManageRooms;
