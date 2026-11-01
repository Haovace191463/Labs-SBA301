import React, { useState, useEffect } from 'react';
import { customerService } from '../services/customerService';
import Alert from '../components/Alert';
import Modal from '../components/Modal';

export default function CustomerHistoryPage({ setCurrentView }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);

  const loadHistory = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await customerService.getBookingHistory();
      setBookings(data);
    } catch (err) {
      setError(err.message || 'Failed to load booking history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 1:
        return <span style={{ padding: '3px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: '600', backgroundColor: '#dcfce7', color: '#15803d' }}>Confirmed</span>;
      case 2:
        return <span style={{ padding: '3px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: '600', backgroundColor: '#e0e7ff', color: '#4338ca' }}>Completed</span>;
      case 0:
        return <span style={{ padding: '3px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: '600', backgroundColor: '#fee2e2', color: '#b91c1c' }}>Cancelled</span>;
      default:
        return <span style={{ padding: '3px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: '600', backgroundColor: '#f3f4f6', color: '#4b5563' }}>Pending</span>;
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '24px auto', padding: '0 16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#1e3a8a', margin: '0 0 4px 0' }}>
            My Booking History
          </h1>
          <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>
            View all your past and upcoming hotel reservations
          </p>
        </div>

        <button
          onClick={() => setCurrentView('customer-booking')}
          style={{
            padding: '9px 18px',
            backgroundColor: '#2563eb',
            color: '#ffffff',
            border: 'none',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
          }}
        >
          + Book Another Room
        </button>
      </div>

      <Alert type="error" message={error} onClose={() => setError('')} />

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>Loading booking records...</div>
      ) : bookings.length === 0 ? (
        <div style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          padding: '48px 20px',
          textAlign: 'center',
        }}>
          <span style={{ fontSize: '40px', display: 'block', marginBottom: '12px' }}>📅</span>
          <h3 style={{ fontSize: '18px', color: '#1f2937', margin: '0 0 6px 0' }}>No Bookings Found</h3>
          <p style={{ color: '#6b7280', fontSize: '14px', margin: '0 0 16px 0' }}>
            You haven't made any hotel reservations yet.
          </p>
          <button
            onClick={() => setCurrentView('customer-booking')}
            style={{
              padding: '8px 18px',
              backgroundColor: '#2563eb',
              color: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '500',
            }}
          >
            Start Booking Now
          </button>
        </div>
      ) : (
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
                <th style={{ padding: '12px 16px', fontWeight: '600', color: '#374151' }}>Booking Date</th>
                <th style={{ padding: '12px 16px', fontWeight: '600', color: '#374151' }}>Rooms Included</th>
                <th style={{ padding: '12px 16px', fontWeight: '600', color: '#374151' }}>Total Price</th>
                <th style={{ padding: '12px 16px', fontWeight: '600', color: '#374151' }}>Status</th>
                <th style={{ padding: '12px 16px', fontWeight: '600', color: '#374151', textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.bookingReservationId} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '12px 16px', fontWeight: '600', color: '#1e3a8a' }}>
                    #{b.bookingReservationId}
                  </td>
                  <td style={{ padding: '12px 16px', color: '#4b5563' }}>
                    {b.bookingDate}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    {b.bookingDetails?.length || 0} {b.bookingDetails?.length === 1 ? 'Room' : 'Rooms'}
                  </td>
                  <td style={{ padding: '12px 16px', fontWeight: '700', color: '#047857' }}>
                    ${Number(b.totalPrice).toFixed(2)}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    {getStatusBadge(b.bookingStatus)}
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                    <button
                      onClick={() => setSelectedBooking(b)}
                      style={{
                        padding: '6px 12px',
                        backgroundColor: '#f3f4f6',
                        border: '1px solid #d1d5db',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: '500',
                      }}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Details Modal */}
      <Modal
        isOpen={!!selectedBooking}
        title={selectedBooking ? `Reservation #${selectedBooking.bookingReservationId} Details` : ''}
        onClose={() => setSelectedBooking(null)}
        maxWidth="750px"
      >
        {selectedBooking && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', marginBottom: '20px', padding: '12px', backgroundColor: '#f9fafb', borderRadius: '6px' }}>
              <div>
                <span style={{ fontSize: '12px', color: '#6b7280' }}>Booking Date:</span>
                <div style={{ fontWeight: '600', color: '#1f2937' }}>{selectedBooking.bookingDate}</div>
              </div>
              <div>
                <span style={{ fontSize: '12px', color: '#6b7280' }}>Customer:</span>
                <div style={{ fontWeight: '600', color: '#1f2937' }}>{selectedBooking.customerFullName}</div>
              </div>
              <div>
                <span style={{ fontSize: '12px', color: '#6b7280' }}>Status:</span>
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
              Booked Rooms Details (BookingDetail)
            </h4>

            <div style={{ border: '1px solid #e5e7eb', borderRadius: '6px', overflow: 'hidden', marginBottom: '20px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
                <thead style={{ backgroundColor: '#f3f4f6' }}>
                  <tr>
                    <th style={{ padding: '8px 12px' }}>Room</th>
                    <th style={{ padding: '8px 12px' }}>Room Type</th>
                    <th style={{ padding: '8px 12px' }}>Check-in</th>
                    <th style={{ padding: '8px 12px' }}>Check-out</th>
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
    </div>
  );
}

