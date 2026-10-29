import React, { useState, useEffect } from 'react';
import { accountService } from '../../services/accountService';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Alert from '../../components/common/Alert';

export default function UserManagement() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [alert, setAlert] = useState({ type: '', message: '' });

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' | 'edit'
  const [currentAccount, setCurrentAccount] = useState({
    id: null,
    accountName: '',
    accountEmail: '',
    accountRole: 2,
    accountPassword: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Delete Confirm State
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    try {
      setLoading(true);
      const data = await accountService.getAll();
      setAccounts(data || []);
    } catch (err) {
      setAlert({ type: 'danger', message: err.message || 'Failed to load system accounts' });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreateModal = () => {
    setModalMode('create');
    setCurrentAccount({
      id: null,
      accountName: '',
      accountEmail: '',
      accountRole: 2,
      accountPassword: '',
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (acc) => {
    setModalMode('edit');
    setCurrentAccount({
      id: acc.id,
      accountName: acc.accountName || '',
      accountEmail: acc.accountEmail || '',
      accountRole: acc.accountRole || 2,
      accountPassword: '', // Don't prefill password
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const validateForm = () => {
    const errors = {};
    if (!currentAccount.accountName.trim()) {
      errors.accountName = 'Name is required';
    } else if (currentAccount.accountName.length > 100) {
      errors.accountName = 'Name must not exceed 100 characters';
    }

    if (!currentAccount.accountEmail.trim()) {
      errors.accountEmail = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(currentAccount.accountEmail.trim())) {
      errors.accountEmail = 'Invalid email address format';
    } else if (currentAccount.accountEmail.length > 70) {
      errors.accountEmail = 'Email must not exceed 70 characters';
    }

    if (modalMode === 'create' && !currentAccount.accountPassword) {
      errors.accountPassword = 'Password is required for new accounts';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmitModal = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setSubmitting(true);
      const payload = {
        id: currentAccount.id || undefined,
        accountName: currentAccount.accountName.trim(),
        accountEmail: currentAccount.accountEmail.trim(),
        accountRole: Number(currentAccount.accountRole),
        accountPassword: currentAccount.accountPassword ? currentAccount.accountPassword : undefined,
      };

      if (modalMode === 'create') {
        await accountService.create(payload);
        setAlert({ type: 'success', message: 'Account created successfully!' });
      } else {
        await accountService.update(currentAccount.id, payload);
        setAlert({ type: 'success', message: 'Account updated successfully!' });
      }

      setIsModalOpen(false);
      await loadAccounts();
    } catch (err) {
      setAlert({ type: 'danger', message: err.message || 'Operation failed' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenDeleteConfirm = (acc) => {
    setAccountToDelete(acc);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!accountToDelete) return;
    try {
      setDeleting(true);
      await accountService.delete(accountToDelete.id);
      setAlert({
        type: 'success',
        message: `Account "${accountToDelete.accountName}" deleted successfully.`,
      });
      setIsConfirmOpen(false);
      setAccountToDelete(null);
      await loadAccounts();
    } catch (err) {
      setAlert({
        type: 'danger',
        message: err.message || 'Cannot delete account because it has created news articles.',
      });
      setIsConfirmOpen(false);
    } finally {
      setDeleting(false);
    }
  };

  const filteredAccounts = accounts.filter((acc) => {
    const term = searchTerm.toLowerCase();
    return (
      acc.accountName?.toLowerCase().includes(term) ||
      acc.accountEmail?.toLowerCase().includes(term) ||
      String(acc.id).includes(term)
    );
  });

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h2>System Account Management</h2>
          <p className="page-description">
            Administrator area for managing university staff and administrator profiles
          </p>
        </div>
        <button className="btn btn-primary" onClick={handleOpenCreateModal}>
          + Create New Account
        </button>
      </div>

      {alert.message && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert({ type: '', message: '' })}
        />
      )}

      <div className="card table-card">
        <div className="table-toolbar">
          <div className="search-input-wrapper">
            <input
              type="text"
              className="form-control"
              placeholder="Search by name, email, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <span className="results-count">Total {filteredAccounts.length} accounts</span>
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading accounts...</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ width: '60px' }}>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th style={{ width: '120px' }}>Role</th>
                  <th style={{ width: '160px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAccounts.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-4">
                      No accounts found.
                    </td>
                  </tr>
                ) : (
                  filteredAccounts.map((acc) => (
                    <tr key={acc.id}>
                      <td><code>#{acc.id}</code></td>
                      <td className="font-semibold">{acc.accountName}</td>
                      <td>{acc.accountEmail}</td>
                      <td>
                        <span
                          className={`badge ${acc.accountRole === 1 ? 'badge-admin' : 'badge-staff'}`}
                        >
                          {acc.accountRole === 1 ? 'Administrator' : 'Staff'}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => handleOpenEditModal(acc)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleOpenDeleteConfirm(acc)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        title={modalMode === 'create' ? 'Create Account' : 'Edit Account'}
        onClose={() => setIsModalOpen(false)}
        maxWidth="500px"
      >
        <form onSubmit={handleSubmitModal}>
          <div className="form-group">
            <label htmlFor="accountName">Full Name *</label>
            <input
              id="accountName"
              type="text"
              className={`form-control ${formErrors.accountName ? 'is-invalid' : ''}`}
              placeholder="e.g. John Doe"
              value={currentAccount.accountName}
              onChange={(e) =>
                setCurrentAccount({ ...currentAccount, accountName: e.target.value })
              }
              maxLength={100}
              required
            />
            {formErrors.accountName && (
              <span className="invalid-feedback">{formErrors.accountName}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="accountEmail">Email Address *</label>
            <input
              id="accountEmail"
              type="email"
              className={`form-control ${formErrors.accountEmail ? 'is-invalid' : ''}`}
              placeholder="e.g. name@FUNewsManagement.org"
              value={currentAccount.accountEmail}
              onChange={(e) =>
                setCurrentAccount({ ...currentAccount, accountEmail: e.target.value })
              }
              maxLength={70}
              required
            />
            {formErrors.accountEmail && (
              <span className="invalid-feedback">{formErrors.accountEmail}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="accountRole">Role *</label>
            <select
              id="accountRole"
              className="form-control"
              value={currentAccount.accountRole}
              onChange={(e) =>
                setCurrentAccount({ ...currentAccount, accountRole: Number(e.target.value) })
              }
            >
              <option value={2}>Staff (Role 2)</option>
              <option value={1}>Administrator (Role 1)</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="accountPassword">
              {modalMode === 'create' ? 'Password *' : 'Password (leave blank to keep unchanged)'}
            </label>
            <input
              id="accountPassword"
              type="password"
              className={`form-control ${formErrors.accountPassword ? 'is-invalid' : ''}`}
              placeholder={modalMode === 'create' ? 'Enter password' : 'New password'}
              value={currentAccount.accountPassword}
              onChange={(e) =>
                setCurrentAccount({ ...currentAccount, accountPassword: e.target.value })
              }
              maxLength={70}
              required={modalMode === 'create'}
            />
            {formErrors.accountPassword && (
              <span className="invalid-feedback">{formErrors.accountPassword}</span>
            )}
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setIsModalOpen(false)}
              disabled={submitting}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Saving...' : modalMode === 'create' ? 'Create Account' : 'Update Account'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirm */}
      <ConfirmDialog
        isOpen={isConfirmOpen}
        title="Confirm Account Deletion"
        message={`Are you sure you want to delete account "${accountToDelete?.accountName}"? Notice: Accounts that have authored or created any news articles cannot be deleted.`}
        confirmText="Confirm Delete"
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsConfirmOpen(false)}
        isLoading={deleting}
      />
    </div>
  );
}

