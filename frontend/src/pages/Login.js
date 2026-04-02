import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../services/api';

function Login() {
  const navigate = useNavigate();
  const [form, setForm]   = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await loginUser(form);
      localStorage.setItem('user', JSON.stringify(res.data));
      if (res.data.role === 'ADMIN') navigate('/admin');
      else navigate('/rooms');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    }
  };

  return (
    <div className="auth-container">
      <div className="form-card">
        <h2>🏨 LuxeStay</h2>
        <p style={{ textAlign: 'center', color: '#888', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
          Welcome back! Please login to continue.
        </p>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input name="email" type="email" placeholder="you@example.com"
              value={form.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input name="password" type="password" placeholder="••••••••"
              value={form.password} onChange={handleChange} required />
          </div>
          <button type="submit" className="btn btn-gold" style={{ width: '100%', padding: '11px', fontSize: '1rem', marginTop: '0.5rem' }}>
            Login
          </button>
        </form>
        <div className="auth-link">
          Don't have an account? <Link to="/register">Register here</Link>
        </div>
        <div style={{ textAlign: 'center', marginTop: '1rem', padding: '0.8rem', background: '#f8fafc', borderRadius: '6px', fontSize: '0.8rem', color: '#888' }}>
          <strong>Admin:</strong> admin@hotel.com / admin123
        </div>
      </div>
    </div>
  );
}

export default Login;
