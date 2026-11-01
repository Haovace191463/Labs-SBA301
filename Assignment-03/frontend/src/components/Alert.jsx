import React from 'react';

export default function Alert({ type = 'info', message, onClose }) {
  if (!message) return null;

  const bgColors = {
    success: '#d1e7dd',
    error: '#f8d7da',
    warning: '#fff3cd',
    info: '#cff4fc',
  };

  const textColors = {
    success: '#0f5132',
    error: '#842029',
    warning: '#664d03',
    info: '#055160',
  };

  const borderColors = {
    success: '#badbcc',
    error: '#f5c2c7',
    warning: '#ffecb5',
    info: '#b6effb',
  };

  return (
    <div style={{
      backgroundColor: bgColors[type] || bgColors.info,
      color: textColors[type] || textColors.info,
      border: `1px solid ${borderColors[type] || borderColors.info}`,
      borderRadius: '6px',
      padding: '12px 16px',
      marginBottom: '16px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      fontSize: '14px',
    }}>
      <div>{message}</div>
      {onClose && (
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '18px',
            color: textColors[type] || textColors.info,
            fontWeight: 'bold',
            marginLeft: '12px',
          }}
        >
          &times;
        </button>
      )}
    </div>
  );
}

