import React from 'react';
import logo from '../../assets/funews-logo.png';

export default function Header({ currentUser, onLogout, onSwitchToPublic }) {
  const roleName = currentUser?.accountRole === 1 ? 'Administrator' : 'Staff';

  return (
    <header className="app-header">
      <div className="header-brand">
        <img src={logo} alt="FUNews Logo" className="header-logo" />
        <div className="header-title-group">
          <h1 className="header-title">FUNews Management</h1>
          <span className="header-subtitle">Assignment 02 &bull; SBA301</span>
        </div>
      </div>

      <div className="header-actions">
        {currentUser ? (
          <>
            <div className="user-profile-badge">
              <span className="user-avatar">{currentUser.accountName?.charAt(0) || 'U'}</span>
              <div className="user-details">
                <span className="user-name">{currentUser.accountName}</span>
                <span className={`user-role role-${currentUser.accountRole === 1 ? 'admin' : 'staff'}`}>
                  {roleName}
                </span>
              </div>
            </div>

            <button
              className="btn btn-outline-light btn-sm"
              onClick={onSwitchToPublic}
              title="View public active news"
            >
              Public View
            </button>

            <button
              className="btn btn-danger-outline btn-sm"
              onClick={onLogout}
              title="Sign out of the system"
            >
              Logout
            </button>
          </>
        ) : (
          <button className="btn btn-primary btn-sm" onClick={onSwitchToPublic}>
            Back to Public View
          </button>
        )}
      </div>
    </header>
  );
}

