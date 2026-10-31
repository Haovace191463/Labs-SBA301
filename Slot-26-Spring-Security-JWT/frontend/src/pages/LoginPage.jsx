import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import authService from '../services/authService';
import { useAuth } from '../context/AuthContext';
import AlertBanner from '../components/AlertBanner';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const successMessage = location.state?.message || '';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const emailTrimmed = formData.email.trim();
    if (!emailTrimmed) {
      setError('Email is required.');
      return;
    }

    if (!formData.password) {
      setError('Password is required.');
      return;
    }

    setLoading(true);

    try {
      const authData = await authService.login(emailTrimmed, formData.password);
      // Response contains { accessToken, tokenType, expiresIn }
      if (!authData || !authData.accessToken) {
        throw new Error('No access token received from server.');
      }

      await login(authData.accessToken);
      navigate('/dashboard');
    } catch (err) {
      if (err.response) {
        const errorData = err.response.data?.error;
        if (err.response.status === 401 || errorData === 'UNAUTHORIZED') {
          setError('Invalid email or password. Please check your credentials.');
        } else if (err.response.status === 400 || errorData === 'INVALID_REQUEST') {
          setError('Invalid request format. Please enter a valid email and non-empty password.');
        } else {
          setError(`Login failed: ${errorData || 'Unexpected server error.'}`);
        }
      } else if (err.request) {
        setError('Cannot connect to backend server. Make sure Spring Boot is running on port 8080.');
      } else {
        setError(err.message || 'An error occurred during login.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Welcome Back</h2>
          <p className="auth-subtitle">Log in with your Spring Security credentials</p>
        </div>

        {successMessage && <AlertBanner type="success" message={successMessage} />}
        <AlertBanner type="error" message={error} onClose={() => setError('')} />

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="user@example.com"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
              autoComplete="email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
              autoComplete="current-password"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Authenticating...' : 'Log In'}
          </button>
        </form>

        <div className="auth-footer">
          Don't have an account?{' '}
          <Link to="/signup" className="auth-link">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
