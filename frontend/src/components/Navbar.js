import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate  = useNavigate();
  const user      = JSON.parse(localStorage.getItem('user') || 'null');

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!user) return null;

  return (
    <div className="navbar">
      <Link to="/" className="logo">🏨 LuxeStay</Link>
      <nav>
        {user.role === 'CUSTOMER' && (
          <>
            <Link to="/rooms">Browse Rooms</Link>
            <Link to="/my-bookings">My Bookings</Link>
          </>
        )}
        {user.role === 'ADMIN' && (
          <>
            <Link to="/admin">Dashboard</Link>
            <Link to="/admin/rooms">Manage Rooms</Link>
            <Link to="/admin/bookings">All Bookings</Link>
          </>
        )}
        <span className="user-info">👤 {user.name} ({user.role})</span>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </nav>
    </div>
  );
}

export default Navbar;
