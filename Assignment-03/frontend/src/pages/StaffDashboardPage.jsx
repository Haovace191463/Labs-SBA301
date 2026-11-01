import React, { useState, useEffect } from 'react';
import { staffService } from '../services/staffService';
import Alert from '../components/Alert';

export default function StaffDashboardPage({ setCurrentView }) {
  const [stats, setStats] = useState({
    totalRooms: 0,
    activeRooms: 0,
    totalCustomers: 0,
    totalBookings: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        setError('');
        const [rooms, customers, bookings] = await Promise.all([
          staffService.getAllRooms(),
          staffService.getAllCustomers(),
          staffService.getAllBookings(),
        ]);

        const activeRooms = rooms.filter((r) => r.roomStatus === 1).length;
        const totalRevenue = bookings.reduce((sum, b) => sum + (Number(b.totalPrice) || 0), 0);

        setStats({
          totalRooms: rooms.length,
          activeRooms,
          totalCustomers: customers.length,
          totalBookings: bookings.length,
          totalRevenue,
        });
      } catch (err) {
        setError(err.message || 'Failed to load dashboard statistics.');
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  const cardStyle = {
    backgroundColor: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '24px auto', padding: '0 16px' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: '700', color: '#1e3a8a', margin: '0 0 4px 0' }}>
          Staff Management Dashboard
        </h1>
        <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>
          Overview of FU Mini Hotel operations, rooms, guests, and transactions
        </p>
      </div>

      <Alert type="error" message={error} onClose={() => setError('')} />

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>Loading dashboard data...</div>
      ) : (
        <>
          {/* Metrics Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '32px' }}>
            <div style={cardStyle}>
              <div style={{ fontSize: '13px', color: '#6b7280', fontWeight: '500' }}>Total Rooms</div>
              <div style={{ fontSize: '28px', fontWeight: '700', color: '#1e3a8a', margin: '6px 0' }}>
                {stats.totalRooms}
              </div>
              <div style={{ fontSize: '12px', color: '#15803d' }}>
                🟢 {stats.activeRooms} Active & Available
              </div>
            </div>

            <div style={cardStyle}>
              <div style={{ fontSize: '13px', color: '#6b7280', fontWeight: '500' }}>Registered Customers</div>
              <div style={{ fontSize: '28px', fontWeight: '700', color: '#2563eb', margin: '6px 0' }}>
                {stats.totalCustomers}
              </div>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>
                👥 Active Guest Accounts
              </div>
            </div>

            <div style={cardStyle}>
              <div style={{ fontSize: '13px', color: '#6b7280', fontWeight: '500' }}>Total Reservations</div>
              <div style={{ fontSize: '28px', fontWeight: '700', color: '#7c3aed', margin: '6px 0' }}>
                {stats.totalBookings}
              </div>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>
                📅 Online & Offline Bookings
              </div>
            </div>

            <div style={cardStyle}>
              <div style={{ fontSize: '13px', color: '#6b7280', fontWeight: '500' }}>Total Revenue</div>
              <div style={{ fontSize: '28px', fontWeight: '700', color: '#047857', margin: '6px 0' }}>
                ${stats.totalRevenue.toFixed(2)}
              </div>
              <div style={{ fontSize: '12px', color: '#15803d' }}>
                💰 Cumulative Booking Value
              </div>
            </div>
          </div>

          {/* Quick Management Navigation */}
          <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: '14px' }}>
            Hotel Management Actions
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            <div
              onClick={() => setCurrentView('staff-rooms')}
              style={{
                ...cardStyle,
                cursor: 'pointer',
                transition: 'transform 0.15s, box-shadow 0.15s',
              }}
            >
              <div style={{ fontSize: '26px', marginBottom: '8px' }}>🛏️</div>
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1e3a8a', margin: '0 0 6px 0' }}>
                Room & Room Type Management
              </h3>
              <p style={{ fontSize: '13px', color: '#4b5563', margin: 0 }}>
                Create, update, and manage rooms. Includes assignment-mandated safe deletion checks.
              </p>
            </div>

            <div
              onClick={() => setCurrentView('staff-customers')}
              style={{
                ...cardStyle,
                cursor: 'pointer',
                transition: 'transform 0.15s, box-shadow 0.15s',
              }}
            >
              <div style={{ fontSize: '26px', marginBottom: '8px' }}>👤</div>
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1e3a8a', margin: '0 0 6px 0' }}>
                Customer Information Management
              </h3>
              <p style={{ fontSize: '13px', color: '#4b5563', margin: 0 }}>
                Search, view, create, update, and manage hotel customer profiles and account status.
              </p>
            </div>

            <div
              onClick={() => setCurrentView('staff-bookings')}
              style={{
                ...cardStyle,
                cursor: 'pointer',
                transition: 'transform 0.15s, box-shadow 0.15s',
              }}
            >
              <div style={{ fontSize: '26px', marginBottom: '8px' }}>📋</div>
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1e3a8a', margin: '0 0 6px 0' }}>
                Booking Reservations & Details
              </h3>
              <p style={{ fontSize: '13px', color: '#4b5563', margin: 0 }}>
                View all reservations, review room details, confirm/complete stays, and create offline bookings.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

