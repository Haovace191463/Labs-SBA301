import React, { useState } from 'react';
import { authService } from '../services/authService';
import Alert from '../components/Alert';

export default function RegisterPage({ setCurrentView }) {
  const [formData, setFormData] = useState({
    customerFullName: '',
    emailAddress: '',
    telephone: '',
    customerBirthday: '',
    password: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!formData.customerFullName.trim()) {
      setError('Full name is required.');
      return;
    }
    if (!formData.emailAddress.trim()) {
      setError('Email address is required.');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await authService.registerCustomer({
        customerFullName: formData.customerFullName.trim(),
        emailAddress: formData.emailAddress.trim(),
        telephone: formData.telephone.trim(),
        customerBirthday: formData.customerBirthday || null,
        password: formData.password,
      });

      setSuccess('Account created successfully! Redirecting to login...');
      setTimeout(() => {
        setCurrentView('login');
      }, 1500);
    } catch (err) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '480px', margin: '40px auto', padding: '0 16px' }}>
      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        padding: '30px',
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <span style={{ fontSize: '32px' }}>🏨</span>
          <h2 style={{ fontSize: '22px', fontWeight: '700', color: '#1e3a8a', margin: '8px 0 4px 0' }}>
            Customer Registration
          </h2>
          <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>
            Create an account to book hotel rooms and view reservations
          </p>
        </div>

        <Alert type="error" message={error} onClose={() => setError('')} />
        <Alert type="success" message={success} />

        <form onSubmit={handleRegister}>
          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
              Full Name *
            </label>
            <input
              type="text"
              name="customerFullName"
              required
              value={formData.customerFullName}
              onChange={handleChange}
              placeholder="e.g. Nguyen Van A"
              style={{ width: '100%', padding: '9px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
              Email Address *
            </label>
            <input
              type="email"
              name="emailAddress"
              required
              value={formData.emailAddress}
              onChange={handleChange}
              placeholder="e.g. name@example.com"
              style={{ width: '100%', padding: '9px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
                Telephone
              </label>
              <input
                type="tel"
                name="telephone"
                value={formData.telephone}
                onChange={handleChange}
                placeholder="0901234567"
                style={{ width: '100%', padding: '9px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
                Date of Birth
              </label>
              <input
                type="date"
                name="customerBirthday"
                value={formData.customerBirthday}
                onChange={handleChange}
                style={{ width: '100%', padding: '9px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
              Password (at least 6 characters) *
            </label>
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              style={{ width: '100%', padding: '9px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ marginBottom: '22px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
              Confirm Password *
            </label>
            <input
              type="password"
              name="confirmPassword"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              style={{ width: '100%', padding: '9px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '11px',
              backgroundColor: '#2563eb',
              color: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              fontSize: '15px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? 'Creating Account...' : 'Register Account'}
          </button>
        </form>

        <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '14px', color: '#4b5563' }}>
          Already have an account?{' '}
          <button
            type="button"
            onClick={() => setCurrentView('login')}
            style={{ background: 'none', border: 'none', color: '#2563eb', fontWeight: '600', cursor: 'pointer', padding: 0 }}
          >
            Sign in here
          </button>
        </div>
      </div>
    </div>
  );
}

