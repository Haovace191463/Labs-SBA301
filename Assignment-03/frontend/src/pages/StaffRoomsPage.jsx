import React, { useState, useEffect } from 'react';
import { staffService } from '../services/staffService';
import Alert from '../components/Alert';
import Modal from '../components/Modal';

export default function StaffRoomsPage() {
  const [rooms, setRooms] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Active sub-tab: 'rooms' or 'room-types'
  const [activeTab, setActiveTab] = useState('rooms');

  // Room Modal state
  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [roomFormData, setRoomFormData] = useState({
    roomNumber: '',
    roomDetailDescription: '',
    roomMaxCapacity: 2,
    roomTypeId: '',
    roomStatus: 1,
    roomPricePerDay: 50.0,
  });

  // Room Type Modal state
  const [isTypeModalOpen, setIsTypeModalOpen] = useState(false);
  const [editingType, setEditingType] = useState(null);
  const [typeFormData, setTypeFormData] = useState({
    roomTypeName: '',
    typeDescription: '',
    typeNote: '',
  });

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      const [roomsData, typesData] = await Promise.all([
        staffService.getAllRooms(),
        staffService.getAllRoomTypes(),
      ]);
      setRooms(roomsData);
      setRoomTypes(typesData);
    } catch (err) {
      setError(err.message || 'Failed to load room management data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // --- Room Actions ---

  const openCreateRoomModal = () => {
    setEditingRoom(null);
    setRoomFormData({
      roomNumber: '',
      roomDetailDescription: '',
      roomMaxCapacity: 2,
      roomTypeId: roomTypes[0]?.roomTypeId || '',
      roomStatus: 1,
      roomPricePerDay: 50.0,
    });
    setIsRoomModalOpen(true);
  };

  const openEditRoomModal = (room) => {
    setEditingRoom(room);
    setRoomFormData({
      roomNumber: room.roomNumber,
      roomDetailDescription: room.roomDetailDescription || '',
      roomMaxCapacity: room.roomMaxCapacity,
      roomTypeId: room.roomTypeId,
      roomStatus: room.roomStatus,
      roomPricePerDay: room.roomPricePerDay,
    });
    setIsRoomModalOpen(true);
  };

  const handleRoomSubmit = async (e) => {
    e.preventDefault();
    if (!roomFormData.roomNumber.trim()) {
      setError('Room number is required.');
      return;
    }
    if (!roomFormData.roomTypeId) {
      setError('Please select a room type.');
      return;
    }

    try {
      setError('');
      if (editingRoom) {
        await staffService.updateRoom(editingRoom.roomId, roomFormData);
        setSuccess(`Room ${roomFormData.roomNumber} updated successfully!`);
      } else {
        await staffService.createRoom(roomFormData);
        setSuccess(`Room ${roomFormData.roomNumber} created successfully!`);
      }
      setIsRoomModalOpen(false);
      loadData();
    } catch (err) {
      setError(err.message || 'Failed to save room.');
    }
  };

  const handleDeleteRoom = async (room) => {
    if (!window.confirm(`Are you sure you want to delete/deactivate Room ${room.roomNumber}?`)) {
      return;
    }
    try {
      setError('');
      const message = await staffService.deleteRoom(room.roomId);
      setSuccess(`[Assignment Rule Enforced] ${message}`);
      loadData();
    } catch (err) {
      setError(err.message || 'Failed to delete room.');
    }
  };

  // --- Room Type Actions ---

  const openCreateTypeModal = () => {
    setEditingType(null);
    setTypeFormData({
      roomTypeName: '',
      typeDescription: '',
      typeNote: '',
    });
    setIsTypeModalOpen(true);
  };

  const openEditTypeModal = (type) => {
    setEditingType(type);
    setTypeFormData({
      roomTypeName: type.roomTypeName,
      typeDescription: type.typeDescription || '',
      typeNote: type.typeNote || '',
    });
    setIsTypeModalOpen(true);
  };

  const handleTypeSubmit = async (e) => {
    e.preventDefault();
    if (!typeFormData.roomTypeName.trim()) {
      setError('Room type name is required.');
      return;
    }

    try {
      setError('');
      if (editingType) {
        await staffService.updateRoomType(editingType.roomTypeId, typeFormData);
        setSuccess(`Room type updated successfully!`);
      } else {
        await staffService.createRoomType(typeFormData);
        setSuccess(`Room type created successfully!`);
      }
      setIsTypeModalOpen(false);
      loadData();
    } catch (err) {
      setError(err.message || 'Failed to save room type.');
    }
  };

  const handleDeleteType = async (type) => {
    if (!window.confirm(`Delete room type "${type.roomTypeName}"?`)) return;
    try {
      setError('');
      await staffService.deleteRoomType(type.roomTypeId);
      setSuccess('Room type deleted successfully.');
      loadData();
    } catch (err) {
      setError(err.message || 'Failed to delete room type.');
    }
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '24px auto', padding: '0 16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#1e3a8a', margin: '0 0 4px 0' }}>
            Room & Room Type Management
          </h1>
          <p style={{ color: '#6b7280', fontSize: '13px', margin: 0 }}>
            Configure rooms and manage room types under Assignment 03 requirements
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          {activeTab === 'rooms' ? (
            <button
              onClick={openCreateRoomModal}
              style={{
                padding: '9px 18px',
                backgroundColor: '#2563eb',
                color: '#ffffff',
                border: 'none',
                borderRadius: '6px',
                fontWeight: '600',
                fontSize: '14px',
                cursor: 'pointer',
              }}
            >
              + Create New Room
            </button>
          ) : (
            <button
              onClick={openCreateTypeModal}
              style={{
                padding: '9px 18px',
                backgroundColor: '#2563eb',
                color: '#ffffff',
                border: 'none',
                borderRadius: '6px',
                fontWeight: '600',
                fontSize: '14px',
                cursor: 'pointer',
              }}
            >
              + Create Room Type
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid #e5e7eb', marginBottom: '20px' }}>
        <button
          onClick={() => setActiveTab('rooms')}
          style={{
            padding: '10px 20px',
            border: 'none',
            borderBottom: activeTab === 'rooms' ? '2px solid #2563eb' : '2px solid transparent',
            backgroundColor: 'transparent',
            color: activeTab === 'rooms' ? '#2563eb' : '#6b7280',
            fontWeight: activeTab === 'rooms' ? '600' : '400',
            cursor: 'pointer',
            fontSize: '15px',
          }}
        >
          Rooms ({rooms.length})
        </button>
        <button
          onClick={() => setActiveTab('room-types')}
          style={{
            padding: '10px 20px',
            border: 'none',
            borderBottom: activeTab === 'room-types' ? '2px solid #2563eb' : '2px solid transparent',
            backgroundColor: 'transparent',
            color: activeTab === 'room-types' ? '#2563eb' : '#6b7280',
            fontWeight: activeTab === 'room-types' ? '600' : '400',
            cursor: 'pointer',
            fontSize: '15px',
          }}
        >
          Room Types ({roomTypes.length})
        </button>
      </div>

      <Alert type="error" message={error} onClose={() => setError('')} />
      <Alert type="success" message={success} onClose={() => setSuccess('')} />

      {/* ROOMS TABLE */}
      {activeTab === 'rooms' && (
        <div style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
            <thead style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
              <tr>
                <th style={{ padding: '12px 16px', fontWeight: '600', color: '#374151' }}>Room No.</th>
                <th style={{ padding: '12px 16px', fontWeight: '600', color: '#374151' }}>Type</th>
                <th style={{ padding: '12px 16px', fontWeight: '600', color: '#374151' }}>Capacity</th>
                <th style={{ padding: '12px 16px', fontWeight: '600', color: '#374151' }}>Price / Day</th>
                <th style={{ padding: '12px 16px', fontWeight: '600', color: '#374151' }}>Status</th>
                <th style={{ padding: '12px 16px', fontWeight: '600', color: '#374151', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" style={{ padding: '30px', textAlign: 'center', color: '#6b7280' }}>
                    Loading rooms...
                  </td>
                </tr>
              ) : rooms.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ padding: '30px', textAlign: 'center', color: '#6b7280' }}>
                    No rooms configured yet.
                  </td>
                </tr>
              ) : (
                rooms.map((room) => (
                  <tr key={room.roomId} style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <td style={{ padding: '12px 16px', fontWeight: '700', color: '#1e3a8a' }}>
                      {room.roomNumber}
                    </td>
                    <td style={{ padding: '12px 16px', color: '#374151' }}>
                      {room.roomTypeName}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      {room.roomMaxCapacity} guests
                    </td>
                    <td style={{ padding: '12px 16px', fontWeight: '600', color: '#047857' }}>
                      ${Number(room.roomPricePerDay).toFixed(2)}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      {room.roomStatus === 1 ? (
                        <span style={{ padding: '2px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: '600', backgroundColor: '#dcfce7', color: '#15803d' }}>
                          Active
                        </span>
                      ) : (
                        <span style={{ padding: '2px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: '600', backgroundColor: '#fee2e2', color: '#b91c1c' }}>
                          Inactive (Soft-Deleted)
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                      <button
                        onClick={() => openEditRoomModal(room)}
                        style={{
                          padding: '5px 10px',
                          marginRight: '6px',
                          backgroundColor: '#f3f4f6',
                          border: '1px solid #d1d5db',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px',
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteRoom(room)}
                        style={{
                          padding: '5px 10px',
                          backgroundColor: '#fee2e2',
                          border: '1px solid #fca5a5',
                          color: '#b91c1c',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px',
                          fontWeight: '500',
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ROOM TYPES TABLE */}
      {activeTab === 'room-types' && (
        <div style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
            <thead style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
              <tr>
                <th style={{ padding: '12px 16px', fontWeight: '600', color: '#374151' }}>ID</th>
                <th style={{ padding: '12px 16px', fontWeight: '600', color: '#374151' }}>Type Name</th>
                <th style={{ padding: '12px 16px', fontWeight: '600', color: '#374151' }}>Description</th>
                <th style={{ padding: '12px 16px', fontWeight: '600', color: '#374151' }}>Note</th>
                <th style={{ padding: '12px 16px', fontWeight: '600', color: '#374151', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {roomTypes.map((t) => (
                <tr key={t.roomTypeId} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '12px 16px', fontWeight: '600', color: '#1e3a8a' }}>
                    #{t.roomTypeId}
                  </td>
                  <td style={{ padding: '12px 16px', fontWeight: '600', color: '#111827' }}>
                    {t.roomTypeName}
                  </td>
                  <td style={{ padding: '12px 16px', color: '#4b5563' }}>
                    {t.typeDescription || '—'}
                  </td>
                  <td style={{ padding: '12px 16px', color: '#6b7280', fontSize: '13px' }}>
                    {t.typeNote || '—'}
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                    <button
                      onClick={() => openEditTypeModal(t)}
                      style={{
                        padding: '5px 10px',
                        marginRight: '6px',
                        backgroundColor: '#f3f4f6',
                        border: '1px solid #d1d5db',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px',
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteType(t)}
                      style={{
                        padding: '5px 10px',
                        backgroundColor: '#fee2e2',
                        border: '1px solid #fca5a5',
                        color: '#b91c1c',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px',
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Room Modal */}
      <Modal
        isOpen={isRoomModalOpen}
        title={editingRoom ? `Edit Room ${editingRoom.roomNumber}` : 'Create New Room'}
        onClose={() => setIsRoomModalOpen(false)}
      >
        <form onSubmit={handleRoomSubmit}>
          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '4px' }}>
              Room Number *
            </label>
            <input
              type="text"
              required
              value={roomFormData.roomNumber}
              onChange={(e) => setRoomFormData({ ...roomFormData, roomNumber: e.target.value })}
              placeholder="e.g. 101, 202"
              style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '4px' }}>
              Room Type *
            </label>
            <select
              required
              value={roomFormData.roomTypeId}
              onChange={(e) => setRoomFormData({ ...roomFormData, roomTypeId: e.target.value })}
              style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', boxSizing: 'border-box' }}
            >
              <option value="">Select Room Type</option>
              {roomTypes.map((t) => (
                <option key={t.roomTypeId} value={t.roomTypeId}>{t.roomTypeName}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '4px' }}>
                Max Capacity (Guests) *
              </label>
              <input
                type="number"
                min="1"
                required
                value={roomFormData.roomMaxCapacity}
                onChange={(e) => setRoomFormData({ ...roomFormData, roomMaxCapacity: parseInt(e.target.value) || 1 })}
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '4px' }}>
                Price Per Day ($) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                required
                value={roomFormData.roomPricePerDay}
                onChange={(e) => setRoomFormData({ ...roomFormData, roomPricePerDay: parseFloat(e.target.value) || 0 })}
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', boxSizing: 'border-box' }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '4px' }}>
              Status
            </label>
            <select
              value={roomFormData.roomStatus}
              onChange={(e) => setRoomFormData({ ...roomFormData, roomStatus: parseInt(e.target.value) })}
              style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', boxSizing: 'border-box' }}
            >
              <option value={1}>1 - Active / Available</option>
              <option value={0}>0 - Inactive / Unavailable</option>
            </select>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '4px' }}>
              Detail Description
            </label>
            <textarea
              rows="3"
              value={roomFormData.roomDetailDescription}
              onChange={(e) => setRoomFormData({ ...roomFormData, roomDetailDescription: e.target.value })}
              placeholder="Description of room features and amenities"
              style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
            <button
              type="button"
              onClick={() => setIsRoomModalOpen(false)}
              style={{ padding: '8px 16px', backgroundColor: '#f3f4f6', border: '1px solid #d1d5db', borderRadius: '6px', cursor: 'pointer' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{ padding: '8px 20px', backgroundColor: '#2563eb', color: '#ffffff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}
            >
              {editingRoom ? 'Update Room' : 'Create Room'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Room Type Modal */}
      <Modal
        isOpen={isTypeModalOpen}
        title={editingType ? `Edit Room Type: ${editingType.roomTypeName}` : 'Create Room Type'}
        onClose={() => setIsTypeModalOpen(false)}
      >
        <form onSubmit={handleTypeSubmit}>
          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '4px' }}>
              Room Type Name *
            </label>
            <input
              type="text"
              required
              value={typeFormData.roomTypeName}
              onChange={(e) => setTypeFormData({ ...typeFormData, roomTypeName: e.target.value })}
              placeholder="e.g. Deluxe Suite, Standard Twin"
              style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '4px' }}>
              Type Description
            </label>
            <textarea
              rows="3"
              value={typeFormData.typeDescription}
              onChange={(e) => setTypeFormData({ ...typeFormData, typeDescription: e.target.value })}
              placeholder="Detailed description of the room type"
              style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '4px' }}>
              Type Note
            </label>
            <input
              type="text"
              value={typeFormData.typeNote}
              onChange={(e) => setTypeFormData({ ...typeFormData, typeNote: e.target.value })}
              placeholder="Additional notes, e.g. Floors 1-3"
              style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
            <button
              type="button"
              onClick={() => setIsTypeModalOpen(false)}
              style={{ padding: '8px 16px', backgroundColor: '#f3f4f6', border: '1px solid #d1d5db', borderRadius: '6px', cursor: 'pointer' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{ padding: '8px 20px', backgroundColor: '#2563eb', color: '#ffffff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}
            >
              {editingType ? 'Update Type' : 'Create Type'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

