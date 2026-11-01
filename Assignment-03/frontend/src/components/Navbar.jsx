import React from 'react';

export default function Navbar({ currentView, setCurrentView, user, onLogout }) {
  const isStaff = user?.role === 'ROLE_STAFF';
  const isCustomer = user?.role === 'ROLE_CUSTOMER';

  const navItemStyle = (view) => ({
    padding: '8px 14px',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: currentView === view ? '600' : '400',
    backgroundColor: currentView === view ? '#2563eb' : 'transparent',
    color: currentView === view ? '#ffffff' : '#374151',
    transition: 'all 0.15s ease-in-out',
  });

  return (
    <header style={{
      backgroundColor: '#ffffff',
      borderBottom: '1px solid #e5e7eb',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '12px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px',
      }}>
        <div
          onClick={() => setCurrentView('public-rooms')}
          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <span style={{ fontSize: '24px' }}>🏨</span>
          <div>
            <div style={{ fontSize: '18px', fontWeight: '700', color: '#1e3a8a', letterSpacing: '-0.5px' }}>
              FU Mini Hotel
            </div>
            <div style={{ fontSize: '11px', color: '#6b7280' }}>
              Assignment 03 • SE1910 • HaoVA
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
          <button style={navItemStyle('public-rooms')} onClick={() => setCurrentView('public-rooms')}>
            Browse Rooms
          </button>

          {isCustomer && (
            <>
              <button style={navItemStyle('customer-booking')} onClick={() => setCurrentView('customer-booking')}>
                Book Rooms
              </button>
              <button style={navItemStyle('customer-history')} onClick={() => setCurrentView('customer-history')}>
                My Bookings
              </button>
              <button style={navItemStyle('customer-profile')} onClick={() => setCurrentView('customer-profile')}>
                My Profile
              </button>
            </>
          )}

          {isStaff && (
            <>
              <button style={navItemStyle('staff-dashboard')} onClick={() => setCurrentView('staff-dashboard')}>
                Dashboard
              </button>
              <button style={navItemStyle('staff-rooms')} onClick={() => setCurrentView('staff-rooms')}>
                Rooms & Types
              </button>
              <button style={navItemStyle('staff-customers')} onClick={() => setCurrentView('staff-customers')}>
                Customers
              </button>
              <button style={navItemStyle('staff-bookings')} onClick={() => setCurrentView('staff-bookings')}>
                Reservations
              </button>
            </>
          )}
        </nav>

        {/* User / Auth status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '13px', fontWeight: '600', color: '#1f2937' }}>
                  {user.name || user.email}
                </div>
                <div style={{
                  fontSize: '11px',
                  display: 'inline-block',
                  padding: '1px 6px',
                  borderRadius: '10px',
                  backgroundColor: isStaff ? '#fef3c7' : '#dbeafe',
                  color: isStaff ? '#92400e' : '#1e40af',
                  fontWeight: '600',
                }}>
                  {isStaff ? 'STAFF' : 'CUSTOMER'}
                </div>
              </div>
              <button
                onClick={onLogout}
                style={{
                  padding: '6px 12px',
                  backgroundColor: '#f3f4f6',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  color: '#4b5563',
                  fontSize: '13px',
                  cursor: 'pointer',
                  fontWeight: '500',
                }}
              >
                Logout
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => setCurrentView('login')}
                style={{
                  padding: '7px 14px',
                  backgroundColor: '#ffffff',
                  border: '1px solid #2563eb',
                  borderRadius: '6px',
                  color: '#2563eb',
                  fontSize: '14px',
                  cursor: 'pointer',
                  fontWeight: '500',
                }}
              >
                Login
              </button>
              <button
                onClick={() => setCurrentView('register')}
                style={{
                  padding: '7px 14px',
                  backgroundColor: '#2563eb',
                  border: 'none',
                  borderRadius: '6px',
                  color: '#ffffff',
                  fontSize: '14px',
                  cursor: 'pointer',
                  fontWeight: '500',
                }}
              >
                Register
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

