import React, { useState, useEffect } from 'react';
import { roomService } from '../services/roomService';
import { customerService } from '../services/customerService';
import Alert from '../components/Alert';

export default function CustomerBookingPage({ setCurrentView }) {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Default dates: tomorrow to day after tomorrow
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const dayAfter = new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0];

  const [startDate, setStartDate] = useState(tomorrow);
  const [endDate, setEndDate] = useState(dayAfter);

  // Selected room IDs
  const [selectedRoomIds, setSelectedRoomIds] = useState([]);

  useEffect(() => {
    const loadRooms = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await roomService.getPublicRooms();
        setRooms(data);
      } catch (err) {
        setError(err.message || 'Failed to load available rooms.');
      } finally {
        setLoading(false);
      }
    };
    loadRooms();
  }, []);

  const toggleRoom = (roomId) => {
    if (selectedRoomIds.includes(roomId)) {
      setSelectedRoomIds(selectedRoomIds.filter((id) => id !== roomId));
    } else {
      setSelectedRoomIds([...selectedRoomIds, roomId]);
    }
  };

  // Calculate duration in days
  const calculateDays = () => {
    if (!startDate || !endDate) return 1;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
  };

  const days = calculateDays();

  // Selected rooms objects
  const selectedRooms = rooms.filter((r) => selectedRoomIds.includes(r.roomId));

  // Calculate total price
  const totalPrice = selectedRooms.reduce((sum, r) => {
    const price = Number(r.roomPricePerDay) || 0;
    return sum + price * days;
  }, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedRoomIds.length === 0) {
      setError('Please select at least one room to book.');
      return;
    }
    if (!startDate || !endDate) {
      setError('Please specify both check-in and check-out dates.');
      return;
    }
    if (new Date(endDate) <= new Date(startDate)) {
      setError('Check-out date must be after check-in date.');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      const items = selectedRoomIds.map((roomId) => ({
        roomId,
        startDate,
        endDate,
      }));

      await customerService.createBooking({ items });
      setSuccess('Booking reservation created successfully! Redirecting to your booking history...');
      setTimeout(() => {
        setCurrentView('customer-history');
      }, 1500);
    } catch (err) {
      setError(err.message || 'Failed to create booking reservation.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '24px auto', padding: '0 16px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#1e3a8a', margin: '0 0 6px 0' }}>
          Create Online Booking Reservation
        </h1>
        <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>
          Select one or multiple rooms and specify your stay duration.
        </p>
      </div>

      <Alert type="error" message={error} onClose={() => setError('')} />
      <Alert type="success" message={success} />

      <form onSubmit={handleSubmit}>
        {/* Date Selection Box */}
        <div style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          padding: '20px',
          marginBottom: '24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', margin: '0 0 14px 0' }}>
            1. Select Stay Dates
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', alignItems: 'center' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
                Check-in Date *
              </label>
              <input
                type="date"
                min={today}
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                style={{ width: '100%', padding: '9px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
                Check-out Date *
              </label>
              <input
                type="date"
                min={startDate || today}
                required
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                style={{ width: '100%', padding: '9px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ padding: '10px 14px', backgroundColor: '#f0fdf4', borderRadius: '6px', border: '1px solid #bbf7d0' }}>
              <div style={{ fontSize: '12px', color: '#166534', fontWeight: '500' }}>Stay Duration:</div>
              <div style={{ fontSize: '16px', fontWeight: '700', color: '#15803d' }}>
                {days} {days === 1 ? 'Night' : 'Nights'}
              </div>
            </div>
          </div>
        </div>

        {/* Room Selection */}
        <div style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          padding: '20px',
          marginBottom: '24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
              2. Choose Room(s) to Reserve
            </h3>
            <span style={{ fontSize: '13px', color: '#2563eb', fontWeight: '500' }}>
              {selectedRoomIds.length} {selectedRoomIds.length === 1 ? 'room' : 'rooms'} selected
            </span>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '30px', color: '#6b7280' }}>Loading rooms...</div>
          ) : rooms.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '30px', color: '#6b7280' }}>No active rooms available.</div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '14px' }}>
              {rooms.map((room) => {
                const isSelected = selectedRoomIds.includes(room.roomId);
                return (
                  <div
                    key={room.roomId}
                    onClick={() => toggleRoom(room.roomId)}
                    style={{
                      border: isSelected ? '2px solid #2563eb' : '1px solid #e5e7eb',
                      backgroundColor: isSelected ? '#eff6ff' : '#ffffff',
                      borderRadius: '8px',
                      padding: '14px',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      position: 'relative',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <span style={{ fontWeight: '700', fontSize: '16px', color: '#1e3a8a' }}>
                        Room {room.roomNumber}
                      </span>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {}} // handled by parent div
                        style={{ cursor: 'pointer', width: '16px', height: '16px' }}
                      />
                    </div>
                    <div style={{ fontSize: '12px', color: '#2563eb', fontWeight: '600', marginBottom: '4px' }}>
                      {room.roomTypeName}
                    </div>
                    <div style={{ fontSize: '12px', color: '#4b5563', marginBottom: '8px' }}>
                      👥 Capacity: {room.roomMaxCapacity} guests
                    </div>
                    <div style={{ fontSize: '16px', fontWeight: '700', color: '#047857' }}>
                      ${Number(room.roomPricePerDay).toFixed(2)} <span style={{ fontSize: '11px', color: '#6b7280', fontWeight: 'normal' }}>/ night</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Booking Summary & Submit */}
        <div style={{
          backgroundColor: '#1e3a8a',
          color: '#ffffff',
          borderRadius: '8px',
          padding: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
        }}>
          <div>
            <div style={{ fontSize: '13px', opacity: 0.85 }}>Estimated Total Reservation Price:</div>
            <div style={{ fontSize: '26px', fontWeight: '700' }}>
              ${totalPrice.toFixed(2)}
            </div>
            <div style={{ fontSize: '12px', opacity: 0.85, marginTop: '2px' }}>
              {selectedRoomIds.length} {selectedRoomIds.length === 1 ? 'room' : 'rooms'} × {days} {days === 1 ? 'night' : 'nights'}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              onClick={() => setCurrentView('public-rooms')}
              style={{
                padding: '10px 18px',
                backgroundColor: 'rgba(255,255,255,0.15)',
                color: '#ffffff',
                border: '1px solid rgba(255,255,255,0.3)',
                borderRadius: '6px',
                fontSize: '14px',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || selectedRoomIds.length === 0}
              style={{
                padding: '10px 28px',
                backgroundColor: '#ffffff',
                color: '#1e3a8a',
                border: 'none',
                borderRadius: '6px',
                fontSize: '15px',
                fontWeight: '700',
                cursor: (submitting || selectedRoomIds.length === 0) ? 'not-allowed' : 'pointer',
                opacity: (submitting || selectedRoomIds.length === 0) ? 0.7 : 1,
              }}
            >
              {submitting ? 'Confirming...' : 'Confirm & Reserve Now'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

