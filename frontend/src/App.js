import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';

import Navbar        from './components/Navbar';
import Login         from './pages/Login';
import Register      from './pages/Register';
import Rooms         from './pages/Rooms';
import BookRoom      from './pages/BookRoom';
import PaymentPage   from './pages/PaymentPage';
import MyBookings    from './pages/MyBookings';
import AdminDashboard from './pages/AdminDashboard';
import ManageRooms   from './pages/ManageRooms';
import ManageBookings from './pages/ManageBookings';

function PrivateRoute({ children }) {
  const user = localStorage.getItem('user');
  return user ? children : <Navigate to="/login" />;
}

function AdminRoute({ children }) {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  if (!user) return <Navigate to="/login" />;
  if (user.role !== 'ADMIN') return <Navigate to="/" />;
  return children;
}

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Customer routes */}
        <Route path="/"           element={<PrivateRoute><Rooms /></PrivateRoute>} />
        <Route path="/rooms"      element={<PrivateRoute><Rooms /></PrivateRoute>} />
        <Route path="/book/:id"   element={<PrivateRoute><BookRoom /></PrivateRoute>} />
        <Route path="/payment/:bookingId" element={<PrivateRoute><PaymentPage /></PrivateRoute>} />
        <Route path="/my-bookings" element={<PrivateRoute><MyBookings /></PrivateRoute>} />

        {/* Admin routes */}
        <Route path="/admin"           element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/rooms"     element={<AdminRoute><ManageRooms /></AdminRoute>} />
        <Route path="/admin/bookings"  element={<AdminRoute><ManageBookings /></AdminRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
