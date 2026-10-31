import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/" className="brand-link">
          <span className="brand-shield">🛡️</span> Spring Security JWT Demo
        </Link>
      </div>

      <div className="navbar-menu">
        {isAuthenticated ? (
          <div className="navbar-auth">
            <span className="user-badge" title="Authenticated User">
              👤 {user?.username}
            </span>
            <Link to="/dashboard" className="nav-btn nav-btn-outline">
              Dashboard
            </Link>
            <button onClick={handleLogout} className="nav-btn nav-btn-danger">
              Logout
            </button>
          </div>
        ) : (
          <div className="navbar-guest">
            <Link to="/login" className="nav-btn nav-btn-outline">
              Login
            </Link>
            <Link to="/signup" className="nav-btn nav-btn-primary">
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
