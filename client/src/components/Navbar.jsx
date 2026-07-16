import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">BillPortal</div>
      {user && (
        <div className="navbar-links">
          <Link to="/dashboard">Dashboard</Link>
          {(user.role === 'admin' || user.role === 'manager') && (
            <Link to="/invoices">All Invoices</Link>
          )}
          {user.role === 'admin' && <Link to="/admin">Manage Users</Link>}
          <span className="navbar-badge">{user.role}</span>
          <button onClick={handleLogout} className="btn-outline">
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}
