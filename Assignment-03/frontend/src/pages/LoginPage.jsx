import React, { useState } from 'react';
import { authService } from '../services/authService';
import Alert from '../components/Alert';

export default function LoginPage({ setCurrentView, setUser }) {
  const [roleTab, setRoleTab] = useState('customer'); // 'customer' or 'staff'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError('Please provide both email and password.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      let res;
      if (roleTab === 'staff') {
        res = await authService.loginStaff(email.trim(), password);
      } else {
        res = await authService.loginCustomer(email.trim(), password);
      }

      setSuccess('Login successful! Redirecting...');
      setUser(res.data);
      setTimeout(() => {
        if (roleTab === 'staff') {
          setCurrentView('staff-dashboard');
        } else {
          setCurrentView('public-rooms');
        }
      }, 500);
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const autofillStaff = () => {
    setRoleTab('staff');
    setEmail('staff@fuminihotel.com');
    setPassword('Staff@123');
    setError('');
  };

  const autofillCustomer = () => {
    setRoleTab('customer');
    setEmail('haova@fuminihotel.com');
    setPassword('Customer@123');
    setError('');
  };

  return (
    <div style={{ maxWidth: '440px', margin: '40px auto', padding: '0 16px' }}>
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
            FU Mini Hotel Login
          </h2>
          <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>
            Sign in to access your hotel account
          </p>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', borderBottom: '1px solid #e5e7eb', marginBottom: '20px' }}>
          <button
            type="button"
            onClick={() => {
              setRoleTab('customer');
              setError('');
            }}
            style={{
              flex: 1,
              padding: '10px',
              border: 'none',
              borderBottom: roleTab === 'customer' ? '2px solid #2563eb' : '2px solid transparent',
              backgroundColor: 'transparent',
              color: roleTab === 'customer' ? '#2563eb' : '#6b7280',
              fontWeight: roleTab === 'customer' ? '600' : '400',
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            Customer Login
          </button>
          <button
            type="button"
            onClick={() => {
              setRoleTab('staff');
              setError('');
            }}
            style={{
              flex: 1,
              padding: '10px',
              border: 'none',
              borderBottom: roleTab === 'staff' ? '2px solid #2563eb' : '2px solid transparent',
              backgroundColor: 'transparent',
              color: roleTab === 'staff' ? '#2563eb' : '#6b7280',
              fontWeight: roleTab === 'staff' ? '600' : '400',
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            Staff Login
          </button>
        </div>

        <Alert type="error" message={error} onClose={() => setError('')} />
        <Alert type="success" message={success} />

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
              {roleTab === 'staff' ? 'Staff Email (from properties)' : 'Customer Email'}
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. user@fuminihotel.com"
              style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ marginBottom: '22px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }}
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
            {loading ? 'Authenticating...' : `Sign in as ${roleTab === 'staff' ? 'Staff' : 'Customer'}`}
          </button>
        </form>

        {/* Demo Quick Autofill Section */}
        <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px dashed #e5e7eb' }}>
          <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px', textAlign: 'center' }}>
            💡 Quick Test Credentials:
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              onClick={autofillStaff}
              style={{
                flex: 1,
                padding: '6px 8px',
                fontSize: '11px',
                backgroundColor: '#fef3c7',
                border: '1px solid #fde68a',
                color: '#92400e',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: '500',
              }}
            >
              Autofill Staff
            </button>
            <button
              type="button"
              onClick={autofillCustomer}
              style={{
                flex: 1,
                padding: '6px 8px',
                fontSize: '11px',
                backgroundColor: '#dbeafe',
                border: '1px solid #bfdbfe',
                color: '#1e40af',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: '500',
              }}
            >
              Autofill Customer
            </button>
          </div>
        </div>

        {roleTab === 'customer' && (
          <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '14px', color: '#4b5563' }}>
            Don't have an account?{' '}
            <button
              type="button"
              onClick={() => setCurrentView('register')}
              style={{ background: 'none', border: 'none', color: '#2563eb', fontWeight: '600', cursor: 'pointer', padding: 0 }}
            >
              Register here
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

