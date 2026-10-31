import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import authService from '../services/authService';
import api from '../services/api';
import AlertBanner from '../components/AlertBanner';

const DashboardPage = () => {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();

  const [usersList, setUsersList] = useState([]);
  const [apiResult, setApiResult] = useState(null);
  const [loadingAction, setLoadingAction] = useState('');
  const [banner, setBanner] = useState({ type: '', message: '' });

  // Initial fetch of /users/me details
  const [currentUserData, setCurrentUserData] = useState(user);

  useEffect(() => {
    let isMounted = true;
    const fetchMe = async () => {
      try {
        const data = await authService.getMe();
        if (isMounted) setCurrentUserData(data);
      } catch (err) {
        if (isMounted) {
          setBanner({
            type: 'error',
            message: 'Failed to refresh user profile from /users/me.',
          });
        }
      }
    };
    fetchMe();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Test 1: Call GET /users/me
  const handleTestMe = async () => {
    setLoadingAction('me');
    setBanner({ type: '', message: '' });
    try {
      const data = await authService.getMe();
      setApiResult({
        endpoint: 'GET /users/me',
        status: 200,
        statusText: 'OK',
        headers: { 'Authorization': `Bearer ${token?.slice(0, 16)}...` },
        data,
      });
      setBanner({ type: 'success', message: 'Successfully accessed GET /users/me with valid JWT!' });
    } catch (err) {
      setApiResult({
        endpoint: 'GET /users/me',
        status: err.response?.status || 'Network Error',
        statusText: err.response?.statusText || 'Failed',
        data: err.response?.data || { error: err.message },
      });
      setBanner({ type: 'error', message: 'Failed to access GET /users/me.' });
    } finally {
      setLoadingAction('');
    }
  };

  // Test 2: Call GET /users
  const handleTestGetUsers = async () => {
    setLoadingAction('users');
    setBanner({ type: '', message: '' });
    try {
      const data = await authService.getAllUsers();
      setUsersList(data);
      setApiResult({
        endpoint: 'GET /users',
        status: 200,
        statusText: 'OK',
        headers: { 'Authorization': `Bearer ${token?.slice(0, 16)}...` },
        data,
      });
      setBanner({
        type: 'success',
        message: `Successfully retrieved ${data.length} registered user(s) from protected GET /users!`,
      });
    } catch (err) {
      setApiResult({
        endpoint: 'GET /users',
        status: err.response?.status || 'Network Error',
        statusText: err.response?.statusText || 'Failed',
        data: err.response?.data || { error: err.message },
      });
      setBanner({ type: 'error', message: 'Failed to access protected GET /users.' });
    } finally {
      setLoadingAction('');
    }
  };

  // Test 3: Test with Tampered / Invalid JWT
  const handleTestInvalidToken = async () => {
    setLoadingAction('invalid');
    setBanner({ type: '', message: '' });
    try {
      // Intentionally sending a malformed / invalid bearer token
      await api.get('/users/me', {
        headers: { Authorization: 'Bearer this.is.an.invalid.or.tampered.token' },
      });
    } catch (err) {
      setApiResult({
        endpoint: 'GET /users/me (Simulated Malformed Token)',
        status: err.response?.status || 401,
        statusText: err.response?.statusText || 'Unauthorized',
        data: err.response?.data || { error: 'UNAUTHORIZED' },
      });
      setBanner({
        type: 'warning',
        message: 'Security Filter rejected the invalid token with HTTP 401 UNAUTHORIZED, as expected!',
      });
    } finally {
      setLoadingAction('');
    }
  };

  // Test 4: Access without token (verify 401 unauthorized)
  const handleTestNoToken = async () => {
    setLoadingAction('notoken');
    setBanner({ type: '', message: '' });
    try {
      await api.get('/users/me', {
        headers: { Authorization: '' },
      });
    } catch (err) {
      setApiResult({
        endpoint: 'GET /users/me (No Authorization Header)',
        status: err.response?.status || 401,
        statusText: err.response?.statusText || 'Unauthorized',
        data: err.response?.data || { error: 'UNAUTHORIZED' },
      });
      setBanner({
        type: 'warning',
        message: 'Backend rejected anonymous request with HTTP 401 UNAUTHORIZED!',
      });
    } finally {
      setLoadingAction('');
    }
  };

  return (
    <div className="dashboard-container">
      {/* Header card */}
      <div className="dashboard-header-card">
        <div className="header-text">
          <h1>Spring Security JWT Demo</h1>
          <p className="welcome-message">
            Welcome back, <strong>{currentUserData?.username || user?.username}</strong>!
          </p>
        </div>
        <div className="header-actions">
          <button onClick={handleLogout} className="btn btn-danger">
            🚪 Logout
          </button>
        </div>
      </div>

      <AlertBanner
        type={banner.type}
        message={banner.message}
        onClose={() => setBanner({ type: '', message: '' })}
      />

      <div className="dashboard-grid">
        {/* User profile card */}
        <div className="card profile-card">
          <div className="card-header">
            <h3>👤 Authenticated User Profile</h3>
            <span className="badge badge-success">JWT Verified</span>
          </div>
          <div className="card-body">
            <div className="info-row">
              <span className="info-label">Principal / Email:</span>
              <span className="info-value">{currentUserData?.username || user?.username}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Authorities / Roles:</span>
              <div className="authorities-list">
                {currentUserData?.authorities && currentUserData.authorities.length > 0 ? (
                  currentUserData.authorities.map((auth, idx) => (
                    <span key={idx} className="badge badge-primary">
                      {auth.authority || auth}
                    </span>
                  ))
                ) : (
                  <span className="badge badge-secondary">ROLE_USER</span>
                )}
              </div>
            </div>
            <div className="info-row">
              <span className="info-label">Token Type:</span>
              <span className="info-value">Bearer (Stateless)</span>
            </div>
            <div className="token-preview-box">
              <span className="token-preview-label">Active JWT (Client Storage):</span>
              <code className="token-code">
                {token ? `${token.substring(0, 36)}...${token.substring(token.length - 16)}` : 'No Token'}
              </code>
            </div>
          </div>
        </div>

        {/* Security & API Testing Control Card */}
        <div className="card testing-card">
          <div className="card-header">
            <h3>🧪 Protected API Live Testing</h3>
            <span className="badge badge-info">Spring Security Filter</span>
          </div>
          <div className="card-body">
            <p className="section-desc">
              Test how Spring Security handles requests with valid tokens, missing headers, or tampered signatures:
            </p>

            <div className="button-group">
              <button
                onClick={handleTestMe}
                disabled={Boolean(loadingAction)}
                className="btn btn-primary"
              >
                {loadingAction === 'me' ? 'Calling...' : 'GET /users/me'}
              </button>

              <button
                onClick={handleTestGetUsers}
                disabled={Boolean(loadingAction)}
                className="btn btn-secondary"
              >
                {loadingAction === 'users' ? 'Calling...' : 'GET /users'}
              </button>

              <button
                onClick={handleTestNoToken}
                disabled={Boolean(loadingAction)}
                className="btn btn-outline"
              >
                {loadingAction === 'notoken' ? 'Testing...' : 'Test Missing Token (401)'}
              </button>

              <button
                onClick={handleTestInvalidToken}
                disabled={Boolean(loadingAction)}
                className="btn btn-warning"
              >
                {loadingAction === 'invalid' ? 'Testing...' : 'Test Tampered Token (401)'}
              </button>
            </div>

            {/* API Response Display */}
            {apiResult && (
              <div className="api-result-box">
                <div className="result-header">
                  <span className="endpoint-tag">{apiResult.endpoint}</span>
                  <span
                    className={`status-tag status-${
                      apiResult.status === 200 ? 'success' : 'error'
                    }`}
                  >
                    HTTP {apiResult.status} {apiResult.statusText}
                  </span>
                </div>
                <pre className="json-display">
                  {JSON.stringify(apiResult.data, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Users table if loaded */}
      {usersList.length > 0 && (
        <div className="card users-table-card">
          <div className="card-header">
            <h3>📋 Database Users List (Protected Endpoint)</h3>
            <span className="badge badge-info">{usersList.length} Users</span>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table className="users-table">
                <thead>
                  <tr>
                    <th>User ID</th>
                    <th>Email / Username</th>
                    <th>Role</th>
                  </tr>
                </thead>
                <tbody>
                  {usersList.map((u) => (
                    <tr key={u.id}>
                      <td>#{u.id}</td>
                      <td>{u.email}</td>
                      <td>
                        <span className="badge badge-primary">{u.role}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
