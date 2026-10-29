import React, { useState, useEffect } from 'react';
import { categoryService } from '../../services/categoryService';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Alert from '../../components/common/Alert';

export default function CategoryManagement() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [alert, setAlert] = useState({ type: '', message: '' });

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' | 'edit'
  const [currentCategory, setCurrentCategory] = useState({
    id: null,
    categoryName: '',
    categoryDesciption: '',
    parentCategoryId: '',
    isActive: true,
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Delete Confirm State
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await categoryService.getAll();
      setCategories(data || []);
    } catch (err) {
      setAlert({ type: 'danger', message: err.message || 'Failed to load categories' });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreateModal = () => {
    setModalMode('create');
    setCurrentCategory({
      id: null,
      categoryName: '',
      categoryDesciption: '',
      parentCategoryId: '',
      isActive: true,
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (cat) => {
    setModalMode('edit');
    setCurrentCategory({
      id: cat.id,
      categoryName: cat.categoryName || '',
      categoryDesciption: cat.categoryDesciption || '',
      parentCategoryId: cat.parentCategoryId || '',
      isActive: cat.isActive !== undefined ? cat.isActive : true,
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const validateForm = () => {
    const errors = {};
    if (!currentCategory.categoryName.trim()) {
      errors.categoryName = 'Category name is required';
    } else if (currentCategory.categoryName.length > 100) {
      errors.categoryName = 'Category name must not exceed 100 characters';
    }

    if (!currentCategory.categoryDesciption.trim()) {
      errors.categoryDesciption = 'Category description is required';
    } else if (currentCategory.categoryDesciption.length > 250) {
      errors.categoryDesciption = 'Category description must not exceed 250 characters';
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
        categoryName: currentCategory.categoryName.trim(),
        categoryDesciption: currentCategory.categoryDesciption.trim(),
        parentCategoryId: currentCategory.parentCategoryId
          ? Number(currentCategory.parentCategoryId)
          : null,
        isActive: currentCategory.isActive,
      };

      if (modalMode === 'create') {
        await categoryService.create(payload);
        setAlert({ type: 'success', message: 'Category created successfully!' });
      } else {
        await categoryService.update(currentCategory.id, payload);
        setAlert({ type: 'success', message: 'Category updated successfully!' });
      }

      setIsModalOpen(false);
      await loadCategories();
    } catch (err) {
      setAlert({ type: 'danger', message: err.message || 'Operation failed' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenDeleteConfirm = (cat) => {
    setCategoryToDelete(cat);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!categoryToDelete) return;
    try {
      setDeleting(true);
      await categoryService.delete(categoryToDelete.id);
      setAlert({
        type: 'success',
        message: `Category "${categoryToDelete.categoryName}" deleted successfully.`,
      });
      setIsConfirmOpen(false);
      setCategoryToDelete(null);
      await loadCategories();
    } catch (err) {
      setAlert({
        type: 'danger',
        message: err.message || 'Cannot delete category. Check if articles reference it.',
      });
      setIsConfirmOpen(false);
    } finally {
      setDeleting(false);
    }
  };

  const filteredCategories = categories.filter((c) => {
    const term = searchTerm.toLowerCase();
    return (
      c.categoryName?.toLowerCase().includes(term) ||
      c.categoryDesciption?.toLowerCase().includes(term) ||
      String(c.id).includes(term)
    );
  });

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h2>Category Management</h2>
          <p className="page-description">
            Organize university news categories and hierarchical relationships
          </p>
        </div>
        <button className="btn btn-primary" onClick={handleOpenCreateModal}>
          + Create New Category
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
              placeholder="Search category name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <span className="results-count">Showing {filteredCategories.length} categories</span>
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading categories...</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ width: '60px' }}>ID</th>
                  <th>Category Name</th>
                  <th>Description</th>
                  <th>Parent Category</th>
                  <th style={{ width: '100px' }}>Status</th>
                  <th style={{ width: '150px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCategories.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-4">
                      No categories found matching "{searchTerm}"
                    </td>
                  </tr>
                ) : (
                  filteredCategories.map((cat) => {
                    const parent = categories.find((c) => c.id === cat.parentCategoryId);
                    return (
                      <tr key={cat.id}>
                        <td><code>{cat.id}</code></td>
                        <td className="font-semibold">{cat.categoryName}</td>
                        <td className="text-muted">{cat.categoryDesciption}</td>
                        <td>
                          {parent ? (
                            <span className="badge badge-secondary">
                              {parent.categoryName} (ID: {parent.id})
                            </span>
                          ) : (
                            <span className="text-muted font-italic">None (Root)</span>
                          )}
                        </td>
                        <td>
                          <span className={`badge ${cat.isActive ? 'badge-success' : 'badge-secondary'}`}>
                            {cat.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => handleOpenEditModal(cat)}
                              title="Edit Category"
                            >
                              Edit
                            </button>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleOpenDeleteConfirm(cat)}
                              title="Delete Category"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create / Edit Popup Dialog */}
      <Modal
        isOpen={isModalOpen}
        title={modalMode === 'create' ? 'Create Category' : 'Edit Category'}
        onClose={() => setIsModalOpen(false)}
        maxWidth="520px"
      >
        <form onSubmit={handleSubmitModal}>
          <div className="form-group">
            <label htmlFor="categoryName">Category Name *</label>
            <input
              id="categoryName"
              type="text"
              className={`form-control ${formErrors.categoryName ? 'is-invalid' : ''}`}
              placeholder="e.g. Academic News"
              value={currentCategory.categoryName}
              onChange={(e) =>
                setCurrentCategory({ ...currentCategory, categoryName: e.target.value })
              }
              maxLength={100}
              required
            />
            {formErrors.categoryName && (
              <span className="invalid-feedback">{formErrors.categoryName}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="categoryDesciption">Description *</label>
            <textarea
              id="categoryDesciption"
              rows={3}
              className={`form-control ${formErrors.categoryDesciption ? 'is-invalid' : ''}`}
              placeholder="Brief description of category..."
              value={currentCategory.categoryDesciption}
              onChange={(e) =>
                setCurrentCategory({ ...currentCategory, categoryDesciption: e.target.value })
              }
              maxLength={250}
              required
            />
            {formErrors.categoryDesciption && (
              <span className="invalid-feedback">{formErrors.categoryDesciption}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="parentCategoryId">Parent Category</label>
            <select
              id="parentCategoryId"
              className="form-control"
              value={currentCategory.parentCategoryId}
              onChange={(e) =>
                setCurrentCategory({ ...currentCategory, parentCategoryId: e.target.value })
              }
            >
              <option value="">None (Top-Level Category)</option>
              {categories
                .filter((c) => modalMode === 'create' || c.id !== currentCategory.id)
                .map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.categoryName} (ID: {c.id})
                  </option>
                ))}
            </select>
          </div>

          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                checked={currentCategory.isActive}
                onChange={(e) =>
                  setCurrentCategory({ ...currentCategory, isActive: e.target.checked })
                }
              />
              <span className="ml-2">Active Category</span>
            </label>
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
              {submitting ? 'Saving...' : modalMode === 'create' ? 'Create Category' : 'Update Category'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isConfirmOpen}
        title="Confirm Category Deletion"
        message={`Are you sure you want to delete category "${categoryToDelete?.categoryName}"? Notice: Categories associated with existing news articles cannot be deleted.`}
        confirmText="Confirm Delete"
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsConfirmOpen(false)}
        isLoading={deleting}
      />
    </div>
  );
}

