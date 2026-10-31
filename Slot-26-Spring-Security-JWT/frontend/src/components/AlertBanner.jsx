import React from 'react';

const AlertBanner = ({ type = 'error', message, onClose }) => {
  if (!message) return null;

  return (
    <div className={`alert-banner alert-${type}`}>
      <span className="alert-icon">
        {type === 'success' ? '✓' : type === 'warning' ? '⚠' : '✕'}
      </span>
      <span className="alert-text">{message}</span>
      {onClose && (
        <button type="button" className="alert-close" onClick={onClose} aria-label="Close">
          ×
        </button>
      )}
    </div>
  );
};

export default AlertBanner;
