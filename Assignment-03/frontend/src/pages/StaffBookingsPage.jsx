import React, { useState, useEffect } from 'react';
import { staffService } from '../services/staffService';
import Alert from '../components/Alert';
import Modal from '../components/Modal';

export default function StaffBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Selected Booking for Details Modal
  const [selectedBooking, setSelectedBooking] = useState(null);

  // New Offline Booking Modal
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [selectedRoomIds, setSelectedRoomIds] = useState([]);
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const dayAfter = new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0];
  const [startDate, setStartDate] = useState(tomorrow);
  const [endDate, setEndDate] = useState(dayAfter);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      const [bookingsData, customersData, roomsData] = await Promise.all([
        staffService.getAllBookings(),
        staffService.getAllCustomers(),
        staffService.getAllRooms(),
      ]);
      setBookings(bookingsData);
      setCustomers(customersData);
      setRooms(roomsData.filter((r) => r.roomStatus === 1));
      if (customersData.length > 0) {
        setSelectedCustomerId(customersData[0].customerId);
      }
    } catch (err) {
      setError(err.message || 'Failed to load reservations.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      setError('');
      await staffService.updateBookingStatus(bookingId, parseInt(newStatus));
      setSuccess(`Reservation #${bookingId} status updated successfully.`);
      loadData();
    } catch (err) {
      setError(err.message || 'Failed to update reservation status.');
    }
  };

  const handleDeleteBooking = async (bookingId) => {
    if (!window.confirm(`Delete reservation #${bookingId}?`)) return;
    try {
      setError('');
      await staffService.deleteBooking(bookingId);
      setSuccess(`Reservation #${bookingId} deleted successfully.`);
      loadData();
    } catch (err) {
      setError(err.message || 'Failed to delete reservation.');
    }
  };

  const toggleRoomSelection = (roomId) => {
    if (selectedRoomIds.includes(roomId)) {
      setSelectedRoomIds(selectedRoomIds.filter((id) => id !== roomId));
    } else {
      setSelectedRoomIds([...selectedRoomIds, roomId]);
    }
  };

  const handleCreateBookingSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCustomerId) {
      setError('Please select a customer.');
      return;
    }
    if (selectedRoomIds.length === 0) {
      setError('Please select at least one room.');
      return;
    }
    if (!startDate || !endDate || new Date(endDate) <= new Date(startDate)) {
      setError('Invalid check-in / check-out dates.');
      return;
    }

    try {
      setError('');
      const items = selectedRoomIds.map((roomId) => ({
        roomId,
        startDate,
        endDate,
      }));

      await staffService.createBooking({
        customerId: parseInt(selectedCustomerId),
        items,
      });

      setSuccess('Offline reservation created successfully!');
      setIsCreateModalOpen(false);
      setSelectedRoomIds([]);
      loadData();
    } catch (err) {
      setError(err.message || 'Failed to create offline booking.');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 1:
        return <span style={{ padding: '2px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: '600', backgroundColor: '#dcfce7', color: '#15803d' }}>Confirmed</span>;
      case 2:
        return <span style={{ padding: '2px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: '600', backgroundColor: '#e0e7ff', color: '#4338ca' }}>Completed</span>;
      case 0:
        return <span style={{ padding: '2px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: '600', backgroundColor: '#fee2e2', color: '#b91c1c' }}>Cancelled</span>;
      default:
        return <span style={{ padding: '2px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: '600', backgroundColor: '#f3f4f6', color: '#4b5563' }}>Pending</span>;
    }
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '24px auto', padding: '0 16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#1e3a8a', margin: '0 0 4px 0' }}>
            Booking Reservation Management
          </h1>
          <p style={{ color: '#6b7280', fontSize: '13px', margin: 0 }}>
            Manage hotel booking transactions and associated room details
          </p>
        </div>

        <button
          onClick={() => {
            setSelectedRoomIds([]);
            setIsCreateModalOpen(true);
          }}
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
          + Create Offline Reservation
        </button>
      </div>

      <Alert type="error" message={error} onClose={() => setError('')} />
      <Alert type="success" message={success} onClose={() => setSuccess('')} />

      {/* Bookings Table */}
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
              <th style={{ padding: '12px 16px', fontWeight: '600', color: '#374151' }}>Date</th>
              <th style={{ padding: '12px 16px', fontWeight: '600', color: '#374151' }}>Customer</th>
              <th style={{ padding: '12px 16px', fontWeight: '600', color: '#374151' }}>Rooms</th>
              <th style={{ padding: '12px 16px', fontWeight: '600', color: '#374151' }}>Total Price</th>
              <th style={{ padding: '12px 16px', fontWeight: '600', color: '#374151' }}>Status</th>
              <th style={{ padding: '12px 16px', fontWeight: '600', color: '#374151', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" style={{ padding: '30px', textAlign: 'center', color: '#6b7280' }}>
                  Loading reservations...
                </td>
              </tr>
            ) : bookings.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ padding: '30px', textAlign: 'center', color: '#6b7280' }}>
                  No reservations found.
                </td>
              </tr>
            ) : (
              bookings.map((b) => (
                <tr key={b.bookingReservationId} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '12px 16px', fontWeight: '600', color: '#1e3a8a' }}>
                    #{b.bookingReservationId}
                  </td>
                  <td style={{ padding: '12px 16px', color: '#4b5563' }}>
                    {b.bookingDate}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ fontWeight: '600', color: '#111827' }}>{b.customerFullName}</div>
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>{b.customerEmail}</div>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    {b.bookingDetails?.length || 0} {b.bookingDetails?.length === 1 ? 'room' : 'rooms'}
                  </td>
                  <td style={{ padding: '12px 16px', fontWeight: '700', color: '#047857' }}>
                    ${Number(b.totalPrice).toFixed(2)}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <select
                      value={b.bookingStatus}
                      onChange={(e) => handleStatusChange(b.bookingReservationId, e.target.value)}
                      style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        border: '1px solid #d1d5db',
                        fontSize: '12px',
                        fontWeight: '500',
                      }}
                    >
                      <option value={1}>1 - Confirmed</option>
                      <option value={2}>2 - Completed</option>
                      <option value={0}>0 - Cancelled</option>
                    </select>
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                    <button
                      onClick={() => setSelectedBooking(b)}
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
                      Details
                    </button>
                    <button
                      onClick={() => handleDeleteBooking(b.bookingReservationId)}
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
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Details Modal */}
      <Modal
        isOpen={!!selectedBooking}
        title={selectedBooking ? `Reservation #${selectedBooking.bookingReservationId} Management` : ''}
        onClose={() => setSelectedBooking(null)}
        maxWidth="750px"
      >
        {selectedBooking && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', marginBottom: '20px', padding: '12px', backgroundColor: '#f9fafb', borderRadius: '6px' }}>
              <div>
                <span style={{ fontSize: '12px', color: '#6b7280' }}>Booking Date:</span>
                <div style={{ fontWeight: '600' }}>{selectedBooking.bookingDate}</div>
              </div>
              <div>
                <span style={{ fontSize: '12px', color: '#6b7280' }}>Customer:</span>
                <div style={{ fontWeight: '600' }}>{selectedBooking.customerFullName} ({selectedBooking.customerEmail})</div>
              </div>
              <div>
                <span style={{ fontSize: '12px', color: '#6b7280' }}>Current Status:</span>
                <div>{getStatusBadge(selectedBooking.bookingStatus)}</div>
              </div>
              <div>
                <span style={{ fontSize: '12px', color: '#6b7280' }}>Total Amount:</span>
                <div style={{ fontWeight: '700', color: '#047857', fontSize: '16px' }}>
                  ${Number(selectedBooking.totalPrice).toFixed(2)}
                </div>
              </div>
            </div>

            <h4 style={{ fontSize: '15px', color: '#1f2937', marginBottom: '10px' }}>
              Booking Details (Rooms, Dates, Actual Prices)
            </h4>

            <div style={{ border: '1px solid #e5e7eb', borderRadius: '6px', overflow: 'hidden', marginBottom: '20px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
                <thead style={{ backgroundColor: '#f3f4f6' }}>
                  <tr>
                    <th style={{ padding: '8px 12px' }}>Room</th>
                    <th style={{ padding: '8px 12px' }}>Room Type</th>
                    <th style={{ padding: '8px 12px' }}>Start Date</th>
                    <th style={{ padding: '8px 12px' }}>End Date</th>
                    <th style={{ padding: '8px 12px', textAlign: 'right' }}>Actual Price</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedBooking.bookingDetails?.map((d, index) => (
                    <tr key={index} style={{ borderTop: '1px solid #f3f4f6' }}>
                      <td style={{ padding: '10px 12px', fontWeight: '600', color: '#1e3a8a' }}>
                        Room {d.roomNumber}
                      </td>
                      <td style={{ padding: '10px 12px' }}>{d.roomTypeName}</td>
                      <td style={{ padding: '10px 12px' }}>{d.startDate}</td>
                      <td style={{ padding: '10px 12px' }}>{d.endDate}</td>
                      <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: '600', color: '#047857' }}>
                        ${Number(d.actualPrice).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setSelectedBooking(null)}
                style={{ padding: '8px 18px', backgroundColor: '#2563eb', color: '#ffffff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' }}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Create Offline Booking Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        title="Create Offline Booking Reservation (Staff)"
        onClose={() => setIsCreateModalOpen(false)}
        maxWidth="750px"
      >
        <form onSubmit={handleCreateBookingSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '4px' }}>
              Select Customer *
            </label>
            <select
              required
              value={selectedCustomerId}
              onChange={(e) => setSelectedCustomerId(e.target.value)}
              style={{ width: '100%', padding: '9px 12px', border: '1px solid #d1d5db', borderRadius: '6px', boxSizing: 'border-box' }}
            >
              {customers.map((c) => (
                <option key={c.customerId} value={c.customerId}>
                  {c.customerFullName} ({c.emailAddress})
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '4px' }}>
                Check-in Date *
              </label>
              <input
                type="date"
                min={today}
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '4px' }}>
                Check-out Date *
              </label>
              <input
                type="date"
                min={startDate || today}
                required
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', boxSizing: 'border-box' }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '6px' }}>
              Select Rooms to Include in Reservation ({selectedRoomIds.length} selected) *
            </label>
            <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid #d1d5db', borderRadius: '6px', padding: '10px' }}>
              {rooms.map((r) => (
                <label
                  key={r.roomId}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '6px 8px',
                    borderRadius: '4px',
                    backgroundColor: selectedRoomIds.includes(r.roomId) ? '#eff6ff' : 'transparent',
                    cursor: 'pointer',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={selectedRoomIds.includes(r.roomId)}
                    onChange={() => toggleRoomSelection(r.roomId)}
                  />
                  <span style={{ fontWeight: '600', color: '#1e3a8a' }}>Room {r.roomNumber}</span>
                  <span style={{ color: '#4b5563', fontSize: '12px' }}>({r.roomTypeName})</span>
                  <span style={{ marginLeft: 'auto', fontWeight: '600', color: '#047857' }}>
                    ${Number(r.roomPricePerDay).toFixed(2)}/day
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
              style={{ padding: '8px 16px', backgroundColor: '#f3f4f6', border: '1px solid #d1d5db', borderRadius: '6px', cursor: 'pointer' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{ padding: '8px 20px', backgroundColor: '#2563eb', color: '#ffffff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}
            >
              Save Reservation
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

