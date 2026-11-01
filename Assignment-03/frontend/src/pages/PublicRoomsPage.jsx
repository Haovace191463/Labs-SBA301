import React, { useState, useEffect } from 'react';
import { roomService } from '../services/roomService';
import Alert from '../components/Alert';
import Modal from '../components/Modal';

export default function PublicRoomsPage({ setCurrentView, user }) {
  const [rooms, setRooms] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedRoom, setSelectedRoom] = useState(null);

  // Filters
  const [filters, setFilters] = useState({
    roomNumber: '',
    roomTypeId: '',
    maxCapacity: '',
    minPrice: '',
    maxPrice: '',
  });

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      const [roomsData, typesData] = await Promise.all([
        roomService.getPublicRooms(),
        roomService.getPublicRoomTypes()
      ]);
      setRooms(roomsData);
      setRoomTypes(typesData);
    } catch (err) {
      setError(err.message || 'Failed to load rooms');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      const params = {};
      if (filters.roomNumber.trim()) params.roomNumber = filters.roomNumber.trim();
      if (filters.roomTypeId) params.roomTypeId = filters.roomTypeId;
      if (filters.maxCapacity) params.maxCapacity = filters.maxCapacity;
      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;

      const filtered = await roomService.searchRooms(params);
      setRooms(filtered);
    } catch (err) {
      setError(err.message || 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFilters({
      roomNumber: '',
      roomTypeId: '',
      maxCapacity: '',
      minPrice: '',
      maxPrice: '',
    });
    loadData();
  };

  const handleBookClick = () => {
    if (!user) {
      setCurrentView('login');
    } else if (user.role === 'ROLE_CUSTOMER') {
      setCurrentView('customer-booking');
    } else {
      alert('Staff accounts manage reservations through the Staff Reservations panel.');
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 20px' }}>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', color: '#1e3a8a', marginBottom: '8px' }}>
          Explore Our Hotel Rooms
        </h1>
        <p style={{ color: '#4b5563', fontSize: '15px', maxWidth: '600px', margin: '0 auto' }}>
          Welcome to FU Mini Hotel. Browse our active rooms, view details, and book your stay online.
        </p>
      </div>

      <Alert type="error" message={error} onClose={() => setError('')} />

      {/* Filter / Search Bar */}
      <form onSubmit={handleSearch} style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        padding: '20px',
        marginBottom: '28px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', marginBottom: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
              Room Number
            </label>
            <input
              type="text"
              placeholder="e.g. 101, 201"
              value={filters.roomNumber}
              onChange={(e) => setFilters({ ...filters, roomNumber: e.target.value })}
              style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
              Room Type
            </label>
            <select
              value={filters.roomTypeId}
              onChange={(e) => setFilters({ ...filters, roomTypeId: e.target.value })}
              style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }}
            >
              <option value="">All Room Types</option>
              {roomTypes.map((t) => (
                <option key={t.roomTypeId} value={t.roomTypeId}>{t.roomTypeName}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
              Min Capacity (Guests)
            </label>
            <input
              type="number"
              min="1"
              placeholder="Min guests"
              value={filters.maxCapacity}
              onChange={(e) => setFilters({ ...filters, maxCapacity: e.target.value })}
              style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
              Min Price ($/day)
            </label>
            <input
              type="number"
              step="0.01"
              placeholder="Min $"
              value={filters.minPrice}
              onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
              style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
              Max Price ($/day)
            </label>
            <input
              type="number"
              step="0.01"
              placeholder="Max $"
              value={filters.maxPrice}
              onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
              style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <button
            type="button"
            onClick={handleReset}
            style={{ padding: '8px 16px', backgroundColor: '#f3f4f6', border: '1px solid #d1d5db', borderRadius: '6px', cursor: 'pointer', fontSize: '14px' }}
          >
            Reset
          </button>
          <button
            type="submit"
            style={{ padding: '8px 20px', backgroundColor: '#2563eb', color: '#ffffff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '500', fontSize: '14px' }}
          >
            Search Rooms
          </button>
        </div>
      </form>

      {/* Room Listing Cards */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>Loading available rooms...</div>
      ) : rooms.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
          <p style={{ fontSize: '16px', color: '#4b5563', margin: 0 }}>No rooms matched your search criteria.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
          {rooms.map((room) => (
            <div
              key={room.roomId}
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                transition: 'box-shadow 0.2s',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <h3 style={{ margin: 0, fontSize: '18px', color: '#1e3a8a', fontWeight: '700' }}>
                    Room {room.roomNumber}
                  </h3>
                  <span style={{
                    fontSize: '11px',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    backgroundColor: '#dcfce7',
                    color: '#15803d',
                    fontWeight: '600'
                  }}>
                    Available
                  </span>
                </div>

                <div style={{ fontSize: '13px', color: '#2563eb', fontWeight: '600', marginBottom: '8px' }}>
                  {room.roomTypeName || 'Room'}
                </div>

                <p style={{ fontSize: '13px', color: '#4b5563', margin: '0 0 12px 0', minHeight: '36px' }}>
                  {room.roomDetailDescription || 'Comfortable hotel accommodation with complete amenities.'}
                </p>

                <div style={{ fontSize: '13px', color: '#374151', marginBottom: '12px' }}>
                  👥 Max Guests: <strong>{room.roomMaxCapacity || 1}</strong>
                </div>
              </div>

              <div>
                <div style={{ fontSize: '20px', fontWeight: '700', color: '#047857', marginBottom: '14px' }}>
                  ${Number(room.roomPricePerDay).toFixed(2)} <span style={{ fontSize: '12px', color: '#6b7280', fontWeight: '400' }}>/ night</span>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => setSelectedRoom(room)}
                    style={{
                      flex: 1,
                      padding: '8px',
                      backgroundColor: '#f3f4f6',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontWeight: '500',
                    }}
                  >
                    Details
                  </button>
                  <button
                    onClick={handleBookClick}
                    style={{
                      flex: 1,
                      padding: '8px',
                      backgroundColor: '#2563eb',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontWeight: '500',
                    }}
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Room Details Modal */}
      <Modal
        isOpen={!!selectedRoom}
        title={selectedRoom ? `Room ${selectedRoom.roomNumber} - Details` : ''}
        onClose={() => setSelectedRoom(null)}
      >
        {selectedRoom && (
          <div>
            <div style={{ marginBottom: '14px' }}>
              <div style={{ fontSize: '13px', color: '#6b7280' }}>Room Type:</div>
              <div style={{ fontSize: '16px', fontWeight: '600', color: '#1e3a8a' }}>
                {selectedRoom.roomTypeName}
              </div>
            </div>

            <div style={{ marginBottom: '14px' }}>
              <div style={{ fontSize: '13px', color: '#6b7280' }}>Description:</div>
              <div style={{ fontSize: '14px', color: '#374151' }}>
                {selectedRoom.roomDetailDescription || 'Standard room equipment, complimentary Wi-Fi, air conditioning, and room service.'}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
              <div>
                <div style={{ fontSize: '13px', color: '#6b7280' }}>Max Capacity:</div>
                <div style={{ fontSize: '15px', fontWeight: '600', color: '#111827' }}>
                  {selectedRoom.roomMaxCapacity} Guests
                </div>
              </div>
              <div>
                <div style={{ fontSize: '13px', color: '#6b7280' }}>Price Per Night:</div>
                <div style={{ fontSize: '18px', fontWeight: '700', color: '#047857' }}>
                  ${Number(selectedRoom.roomPricePerDay).toFixed(2)}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                onClick={() => setSelectedRoom(null)}
                style={{ padding: '8px 16px', border: '1px solid #d1d5db', backgroundColor: '#f3f4f6', borderRadius: '6px', cursor: 'pointer' }}
              >
                Close
              </button>
              <button
                onClick={() => {
                  setSelectedRoom(null);
                  handleBookClick();
                }}
                style={{ padding: '8px 20px', backgroundColor: '#2563eb', color: '#ffffff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' }}
              >
                Proceed to Book
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

