import React, { useState } from 'react';
import { accountService } from '../../services/accountService';
import { authService } from '../../services/authService';
import Alert from '../../components/common/Alert';

export default function ProfilePage({ currentUser, onUpdateUser }) {
  const [name, setName] = useState(currentUser?.accountName || '');
  const [email, setEmail] = useState(currentUser?.accountEmail || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [alert, setAlert] = useState({ type: '', message: '' });

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      setAlert({ type: 'danger', message: 'Account name cannot be blank.' });
      return;
    }

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setAlert({ type: 'danger', message: 'Valid email address is required.' });
      return;
    }

    if (password && password !== confirmPassword) {
      setAlert({ type: 'danger', message: 'Passwords do not match.' });
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        accountName: name.trim(),
        accountEmail: email.trim(),
        accountPassword: password ? password : undefined,
      };

      const updated = await accountService.updateProfile(currentUser.accountId, payload);

      const refreshedUser = {
        ...currentUser,
        accountName: updated.accountName,
        accountEmail: updated.accountEmail,
      };

      authService.saveUser(refreshedUser);
      onUpdateUser(refreshedUser);

      setAlert({ type: 'success', message: 'Your profile has been updated successfully!' });
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      setAlert({ type: 'danger', message: err.message || 'Failed to update profile.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h2>My Profile</h2>
          <p className="page-description">
            Manage your personal profile details and account credentials
          </p>
        </div>
      </div>

      {alert.message && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert({ type: '', message: '' })}
        />
      )}

      <div className="card profile-card" style={{ maxWidth: '600px' }}>
        <div className="profile-header-summary">
          <div className="profile-avatar-large">
            {currentUser?.accountName?.charAt(0) || 'U'}
          </div>
          <div className="profile-summary-text">
            <h3>{currentUser?.accountName}</h3>
            <p className="text-muted">{currentUser?.accountEmail}</p>
            <span
              className={`badge ${currentUser?.accountRole === 1 ? 'badge-admin' : 'badge-staff'}`}
            >
              {currentUser?.accountRole === 1 ? 'Administrator' : 'Staff Member'}
            </span>
          </div>
        </div>

        <form onSubmit={handleUpdateProfile} className="mt-4">
          <div className="form-group">
            <label htmlFor="profName">Full Name *</label>
            <input
              id="profName"
              type="text"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={submitting}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="profEmail">Email Address *</label>
            <input
              id="profEmail"
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={submitting}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="profPass">New Password (leave empty to keep current)</label>
            <input
              id="profPass"
              type="password"
              className="form-control"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={submitting}
            />
          </div>

          {password && (
            <div className="form-group">
              <label htmlFor="profPassConfirm">Confirm New Password</label>
              <input
                id="profPassConfirm"
                type="password"
                className="form-control"
                placeholder="Re-enter new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={submitting}
              />
            </div>
          )}

          <div className="form-actions mt-4">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting ? 'Saving Changes...' : 'Save Profile Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

