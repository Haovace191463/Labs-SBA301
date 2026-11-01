import React, { useState, useEffect } from 'react';
import { staffService } from '../services/staffService';
import Alert from '../components/Alert';
import Modal from '../components/Modal';

export default function StaffCustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [formData, setFormData] = useState({
    customerFullName: '',
    emailAddress: '',
    telephone: '',
    customerBirthday: '',
    customerStatus: 1,
    password: '',
  });

  const loadCustomers = async (searchTerm = '') => {
    try {
      setLoading(true);
      setError('');
      const data = await staffService.getAllCustomers(searchTerm);
      setCustomers(data);
    } catch (err) {
      setError(err.message || 'Failed to load customers.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadCustomers(search);
  };

  const handleResetSearch = () => {
    setSearch('');
    loadCustomers('');
  };

  const openCreateModal = () => {
    setEditingCustomer(null);
    setFormData({
      customerFullName: '',
      emailAddress: '',
      telephone: '',
      customerBirthday: '',
      customerStatus: 1,
      password: '',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (c) => {
    setEditingCustomer(c);
    setFormData({
      customerFullName: c.customerFullName || '',
      emailAddress: c.emailAddress || '',
      telephone: c.telephone || '',
      customerBirthday: c.customerBirthday || '',
      customerStatus: c.customerStatus,
      password: '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.customerFullName.trim()) {
      setError('Full name is required.');
      return;
    }
    if (!formData.emailAddress.trim()) {
      setError('Email address is required.');
      return;
    }
    if (!editingCustomer && (!formData.password || formData.password.length < 6)) {
      setError('Password must be at least 6 characters for a new customer.');
      return;
    }

    try {
      setError('');
      if (editingCustomer) {
        await staffService.updateCustomer(editingCustomer.customerId, formData);
        setSuccess(`Customer ${formData.customerFullName} updated successfully!`);
      } else {
        await staffService.createCustomer(formData);
        setSuccess(`Customer ${formData.customerFullName} created successfully!`);
      }
      setIsModalOpen(false);
      loadCustomers(search);
    } catch (err) {
      setError(err.message || 'Failed to save customer.');
    }
  };

  const handleDelete = async (c) => {
    if (!window.confirm(`Are you sure you want to delete/deactivate customer ${c.customerFullName}?`)) {
      return;
    }
    try {
      setError('');
      await staffService.deleteCustomer(c.customerId);
      setSuccess(`Customer ${c.customerFullName} processed: deactivated/deleted safely without breaking booking integrity.`);
      loadCustomers(search);
    } catch (err) {
      setError(err.message || 'Failed to delete customer.');
    }
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '24px auto', padding: '0 16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#1e3a8a', margin: '0 0 4px 0' }}>
            Customer Management
          </h1>
          <p style={{ color: '#6b7280', fontSize: '13px', margin: 0 }}>
            Manage hotel customer accounts, contact details, and account status
          </p>
        </div>

        <button
          onClick={openCreateModal}
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
          + Add New Customer
        </button>
      </div>

      <Alert type="error" message={error} onClose={() => setError('')} />
      <Alert type="success" message={success} onClose={() => setSuccess('')} />

      {/* Search Bar */}
      <form onSubmit={handleSearchSubmit} style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        padding: '14px 18px',
        marginBottom: '20px',
        display: 'flex',
        gap: '10px',
        alignItems: 'center',
        flexWrap: 'wrap',
      }}>
        <input
          type="text"
          placeholder="Search by customer name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            flex: 1,
            minWidth: '220px',
            padding: '8px 12px',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            fontSize: '14px',
          }}
        />
        <button
          type="submit"
          style={{
            padding: '8px 18px',
            backgroundColor: '#2563eb',
            color: '#ffffff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
          }}
        >
          Search
        </button>
        {search && (
          <button
            type="button"
            onClick={handleResetSearch}
            style={{
              padding: '8px 14px',
              backgroundColor: '#f3f4f6',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            Clear
          </button>
        )}
      </form>

      {/* Customers Table */}
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
              <th style={{ padding: '12px 16px', fontWeight: '600', color: '#374151' }}>Full Name</th>
              <th style={{ padding: '12px 16px', fontWeight: '600', color: '#374151' }}>Email Address</th>
              <th style={{ padding: '12px 16px', fontWeight: '600', color: '#374151' }}>Telephone</th>
              <th style={{ padding: '12px 16px', fontWeight: '600', color: '#374151' }}>Birthday</th>
              <th style={{ padding: '12px 16px', fontWeight: '600', color: '#374151' }}>Status</th>
              <th style={{ padding: '12px 16px', fontWeight: '600', color: '#374151', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" style={{ padding: '30px', textAlign: 'center', color: '#6b7280' }}>
                  Loading customers...
                </td>
              </tr>
            ) : customers.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ padding: '30px', textAlign: 'center', color: '#6b7280' }}>
                  No customer records found.
                </td>
              </tr>
            ) : (
              customers.map((c) => (
                <tr key={c.customerId} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '12px 16px', fontWeight: '600', color: '#1e3a8a' }}>
                    #{c.customerId}
                  </td>
                  <td style={{ padding: '12px 16px', fontWeight: '600', color: '#111827' }}>
                    {c.customerFullName}
                  </td>
                  <td style={{ padding: '12px 16px', color: '#374151' }}>
                    {c.emailAddress}
                  </td>
                  <td style={{ padding: '12px 16px', color: '#4b5563' }}>
                    {c.telephone || '—'}
                  </td>
                  <td style={{ padding: '12px 16px', color: '#4b5563' }}>
                    {c.customerBirthday || '—'}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    {c.customerStatus === 1 ? (
                      <span style={{ padding: '2px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: '600', backgroundColor: '#dcfce7', color: '#15803d' }}>
                        Active
                      </span>
                    ) : (
                      <span style={{ padding: '2px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: '600', backgroundColor: '#fee2e2', color: '#b91c1c' }}>
                        Inactive
                      </span>
                    )}
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                    <button
                      onClick={() => openEditModal(c)}
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
                      onClick={() => handleDelete(c)}
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

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        title={editingCustomer ? `Edit Customer #${editingCustomer.customerId}` : 'Create Customer Account'}
        onClose={() => setIsModalOpen(false)}
      >
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '4px' }}>
              Full Name *
            </label>
            <input
              type="text"
              required
              value={formData.customerFullName}
              onChange={(e) => setFormData({ ...formData, customerFullName: e.target.value })}
              style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '4px' }}>
              Email Address *
            </label>
            <input
              type="email"
              required
              value={formData.emailAddress}
              onChange={(e) => setFormData({ ...formData, emailAddress: e.target.value })}
              style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '4px' }}>
                Telephone
              </label>
              <input
                type="tel"
                value={formData.telephone}
                onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '4px' }}>
                Birthday
              </label>
              <input
                type="date"
                value={formData.customerBirthday}
                onChange={(e) => setFormData({ ...formData, customerBirthday: e.target.value })}
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', boxSizing: 'border-box' }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '4px' }}>
              Account Status
            </label>
            <select
              value={formData.customerStatus}
              onChange={(e) => setFormData({ ...formData, customerStatus: parseInt(e.target.value) })}
              style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', boxSizing: 'border-box' }}
            >
              <option value={1}>1 - Active Account</option>
              <option value={0}>0 - Inactive / Deactivated</option>
            </select>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '4px' }}>
              {editingCustomer ? 'Reset Password (optional)' : 'Password *'}
            </label>
            <input
              type="password"
              required={!editingCustomer}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder={editingCustomer ? 'Leave empty to keep current password' : 'At least 6 characters'}
              style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              style={{ padding: '8px 16px', backgroundColor: '#f3f4f6', border: '1px solid #d1d5db', borderRadius: '6px', cursor: 'pointer' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{ padding: '8px 20px', backgroundColor: '#2563eb', color: '#ffffff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}
            >
              {editingCustomer ? 'Save Changes' : 'Create Customer'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

