import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import AlertBanner from '../components/AlertBanner';

const SignupPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Client-side validations
    const emailTrimmed = formData.email.trim();
    if (!emailTrimmed) {
      setError('Email is required.');
      return;
    }

    if (!formData.password) {
      setError('Password is required.');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Password and Confirm Password do not match.');
      return;
    }

    setLoading(true);

    try {
      await authService.signup(emailTrimmed, formData.password);
      setSuccess('Account created successfully! Redirecting to login...');
      setTimeout(() => {
        navigate('/login', {
          state: { message: 'Registration successful! Please log in with your credentials.' },
        });
      }, 1500);
    } catch (err) {
      if (err.response) {
        const errorData = err.response.data?.error;
        if (err.response.status === 409 || errorData === 'EMAIL_EXISTS') {
          setError('This email is already registered. Please use another email or log in.');
        } else if (err.response.status === 400 || errorData === 'INVALID_REQUEST') {
          setError('Invalid request. Password must be at least 8 characters and email must be valid.');
        } else {
          setError(`Registration failed: ${errorData || 'Unexpected server response.'}`);
        }
      } else if (err.request) {
        setError('Cannot connect to backend server. Make sure Spring Boot is running on port 8080.');
      } else {
        setError(err.message || 'An error occurred during registration.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Create an Account</h2>
          <p className="auth-subtitle">Register to explore Spring Security JWT</p>
        </div>

        <AlertBanner type="error" message={error} onClose={() => setError('')} />
        <AlertBanner type="success" message={success} />

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
              placeholder="Minimum 8 characters"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
              autoComplete="new-password"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              placeholder="Re-type your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              disabled={loading}
              autoComplete="new-password"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account?{' '}
          <Link to="/login" className="auth-link">
            Log In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
