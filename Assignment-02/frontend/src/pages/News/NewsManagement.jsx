import React, { useState, useEffect } from 'react';
import { newsService } from '../../services/newsService';
import { categoryService } from '../../services/categoryService';
import { tagService } from '../../services/tagService';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Alert from '../../components/common/Alert';

export default function NewsManagement({ currentUser }) {
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('');
  const [alert, setAlert] = useState({ type: '', message: '' });

  // Modal State for Create/Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' | 'edit'
  const [currentArticle, setCurrentArticle] = useState({
    newsArticleID: '',
    newsTitle: '',
    headline: '',
    newsContent: '',
    newsSource: '',
    categoryID: '',
    newsStatus: true,
    tagIds: [],
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Detail Modal State
  const [detailArticle, setDetailArticle] = useState(null);

  // Delete Confirm State
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      setLoading(true);
      const [articlesData, categoriesData, tagsData] = await Promise.all([
        newsService.getAll(),
        categoryService.getAll(),
        tagService.getAll(),
      ]);
      setArticles(articlesData || []);
      setCategories(categoriesData || []);
      setTags(tagsData || []);
    } catch (err) {
      setAlert({ type: 'danger', message: err.message || 'Failed to load data' });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreateModal = () => {
    setModalMode('create');
    setCurrentArticle({
      newsArticleID: '',
      newsTitle: '',
      headline: '',
      newsContent: '',
      newsSource: '',
      categoryID: categories.length > 0 ? categories[0].id : '',
      newsStatus: true,
      tagIds: [],
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (article) => {
    setModalMode('edit');
    setCurrentArticle({
      newsArticleID: article.newsArticleID,
      newsTitle: article.newsTitle || '',
      headline: article.headline || '',
      newsContent: article.newsContent || '',
      newsSource: article.newsSource || '',
      categoryID: article.categoryID || '',
      newsStatus: article.newsStatus !== undefined ? article.newsStatus : true,
      tagIds: article.tagIds || [],
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleToggleTag = (tagId) => {
    setCurrentArticle((prev) => {
      const exists = prev.tagIds.includes(tagId);
      const newTagIds = exists
        ? prev.tagIds.filter((id) => id !== tagId)
        : [...prev.tagIds, tagId];
      return { ...prev, tagIds: newTagIds };
    });
  };

  const validateForm = () => {
    const errors = {};
    if (!currentArticle.headline.trim()) {
      errors.headline = 'Headline is required';
    } else if (currentArticle.headline.length > 150) {
      errors.headline = 'Headline must not exceed 150 characters';
    }

    if (!currentArticle.categoryID) {
      errors.categoryID = 'Category is required';
    }

    if (currentArticle.newsTitle && currentArticle.newsTitle.length > 400) {
      errors.newsTitle = 'News Title must not exceed 400 characters';
    }

    if (currentArticle.newsContent && currentArticle.newsContent.length > 4000) {
      errors.newsContent = 'Content must not exceed 4000 characters';
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
        newsArticleID: currentArticle.newsArticleID || undefined,
        newsTitle: currentArticle.newsTitle.trim() || currentArticle.headline.trim(),
        headline: currentArticle.headline.trim(),
        newsContent: currentArticle.newsContent,
        newsSource: currentArticle.newsSource.trim() || 'University',
        categoryID: Number(currentArticle.categoryID),
        newsStatus: currentArticle.newsStatus,
        createdByID: currentUser?.accountId,
        updatedByID: currentUser?.accountId,
        tagIds: currentArticle.tagIds,
      };

      if (modalMode === 'create') {
        await newsService.create(payload);
        setAlert({ type: 'success', message: 'News article created successfully!' });
      } else {
        await newsService.update(currentArticle.newsArticleID, payload);
        setAlert({ type: 'success', message: 'News article updated successfully!' });
      }

      setIsModalOpen(false);
      await loadAllData();
    } catch (err) {
      setAlert({ type: 'danger', message: err.message || 'Operation failed' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenDeleteConfirm = (art) => {
    setArticleToDelete(art);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!articleToDelete) return;
    try {
      setDeleting(true);
      await newsService.delete(articleToDelete.newsArticleID);
      setAlert({
        type: 'success',
        message: `Article "${articleToDelete.headline}" deleted successfully.`,
      });
      setIsConfirmOpen(false);
      setArticleToDelete(null);
      await loadAllData();
    } catch (err) {
      setAlert({ type: 'danger', message: err.message || 'Failed to delete article' });
      setIsConfirmOpen(false);
    } finally {
      setDeleting(false);
    }
  };

  const filteredArticles = articles.filter((art) => {
    const matchesCategory =
      !selectedCategoryFilter || String(art.categoryID) === String(selectedCategoryFilter);
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      !term ||
      art.headline?.toLowerCase().includes(term) ||
      art.newsTitle?.toLowerCase().includes(term) ||
      art.newsArticleID?.toLowerCase().includes(term) ||
      art.categoryName?.toLowerCase().includes(term);
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h2>News Article Management</h2>
          <p className="page-description">
            Publish, update, and manage university news articles and associated tags
          </p>
        </div>
        <button className="btn btn-primary" onClick={handleOpenCreateModal}>
          + Create News Article
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
              placeholder="Search by headline, ID, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filter-select-wrapper">
            <select
              className="form-control"
              value={selectedCategoryFilter}
              onChange={(e) => setSelectedCategoryFilter(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.categoryName}
                </option>
              ))}
            </select>
          </div>
          <span className="results-count">Showing {filteredArticles.length} articles</span>
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading news articles...</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ width: '60px' }}>ID</th>
                  <th>Headline</th>
                  <th>Category</th>
                  <th>Tags</th>
                  <th style={{ width: '90px' }}>Status</th>
                  <th>Date</th>
                  <th style={{ width: '190px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredArticles.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-4">
                      No news articles found.
                    </td>
                  </tr>
                ) : (
                  filteredArticles.map((art) => (
                    <tr key={art.newsArticleID}>
                      <td><code>{art.newsArticleID}</code></td>
                      <td className="font-semibold">{art.headline}</td>
                      <td>
                        <span className="badge badge-category">
                          {art.categoryName || `Category ${art.categoryID}`}
                        </span>
                      </td>
                      <td>
                        <div className="tag-badges-container">
                          {art.tags && art.tags.length > 0 ? (
                            art.tags.map((t) => (
                              <span key={t.id} className="badge badge-tag">
                                #{t.tagName}
                              </span>
                            ))
                          ) : (
                            <span className="text-muted small">No tags</span>
                          )}
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${art.newsStatus ? 'badge-success' : 'badge-secondary'}`}>
                          {art.newsStatus ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>
                        {art.createdDate ? new Date(art.createdDate).toLocaleDateString() : 'N/A'}
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="btn btn-sm btn-outline-info"
                            onClick={() => setDetailArticle(art)}
                            title="View Full Details"
                          >
                            View
                          </button>
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => handleOpenEditModal(art)}
                            title="Edit Article"
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleOpenDeleteConfirm(art)}
                            title="Delete Article"
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

      {/* Create / Edit Popup Dialog */}
      <Modal
        isOpen={isModalOpen}
        title={modalMode === 'create' ? 'Create News Article' : 'Edit News Article'}
        onClose={() => setIsModalOpen(false)}
        maxWidth="680px"
      >
        <form onSubmit={handleSubmitModal}>
          {modalMode === 'create' && (
            <div className="form-group">
              <label htmlFor="newsArticleID">News Article ID (Optional, auto-generated if blank)</label>
              <input
                id="newsArticleID"
                type="text"
                className="form-control"
                placeholder="e.g. 101"
                value={currentArticle.newsArticleID}
                onChange={(e) =>
                  setCurrentArticle({ ...currentArticle, newsArticleID: e.target.value })
                }
                maxLength={20}
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="headline">Headline *</label>
            <input
              id="headline"
              type="text"
              className={`form-control ${formErrors.headline ? 'is-invalid' : ''}`}
              placeholder="Primary headline..."
              value={currentArticle.headline}
              onChange={(e) =>
                setCurrentArticle({ ...currentArticle, headline: e.target.value })
              }
              maxLength={150}
              required
            />
            {formErrors.headline && (
              <span className="invalid-feedback">{formErrors.headline}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="newsTitle">News Title (Optional)</label>
            <input
              id="newsTitle"
              type="text"
              className="form-control"
              placeholder="Extended title or subtitles..."
              value={currentArticle.newsTitle}
              onChange={(e) =>
                setCurrentArticle({ ...currentArticle, newsTitle: e.target.value })
              }
              maxLength={400}
            />
          </div>

          <div className="form-row">
            <div className="form-group col-half">
              <label htmlFor="categoryID">Category *</label>
              <select
                id="categoryID"
                className={`form-control ${formErrors.categoryID ? 'is-invalid' : ''}`}
                value={currentArticle.categoryID}
                onChange={(e) =>
                  setCurrentArticle({ ...currentArticle, categoryID: e.target.value })
                }
                required
              >
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.categoryName}
                  </option>
                ))}
              </select>
              {formErrors.categoryID && (
                <span className="invalid-feedback">{formErrors.categoryID}</span>
              )}
            </div>

            <div className="form-group col-half">
              <label htmlFor="newsSource">News Source</label>
              <input
                id="newsSource"
                type="text"
                className="form-control"
                placeholder="e.g. University Press, Internet"
                value={currentArticle.newsSource}
                onChange={(e) =>
                  setCurrentArticle({ ...currentArticle, newsSource: e.target.value })
                }
                maxLength={400}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="newsContent">News Content</label>
            <textarea
              id="newsContent"
              rows={5}
              className="form-control"
              placeholder="Full article content body..."
              value={currentArticle.newsContent}
              onChange={(e) =>
                setCurrentArticle({ ...currentArticle, newsContent: e.target.value })
              }
              maxLength={4000}
            />
          </div>

          <div className="form-group">
            <label>Associated Tags</label>
            <div className="tag-checkbox-grid">
              {tags.map((t) => (
                <label key={t.id} className="tag-checkbox-item">
                  <input
                    type="checkbox"
                    checked={currentArticle.tagIds.includes(t.id)}
                    onChange={() => handleToggleTag(t.id)}
                  />
                  <span>#{t.tagName}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                checked={currentArticle.newsStatus}
                onChange={(e) =>
                  setCurrentArticle({ ...currentArticle, newsStatus: e.target.checked })
                }
              />
              <span className="ml-2">Active / Published</span>
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
              {submitting ? 'Saving...' : modalMode === 'create' ? 'Create Article' : 'Update Article'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Article Detail Modal */}
      <Modal
        isOpen={!!detailArticle}
        title={detailArticle?.headline || 'Article Details'}
        onClose={() => setDetailArticle(null)}
        maxWidth="680px"
      >
        {detailArticle && (
          <div className="article-detail-view">
            <div className="article-detail-meta">
              <span><strong>Category:</strong> {detailArticle.categoryName}</span>
              <span><strong>Status:</strong> {detailArticle.newsStatus ? 'Active' : 'Inactive'}</span>
              <span><strong>Created By:</strong> {detailArticle.createdByName || `Account ${detailArticle.createdByID}`}</span>
              <span><strong>Source:</strong> {detailArticle.newsSource}</span>
            </div>

            {detailArticle.tags && detailArticle.tags.length > 0 && (
              <div className="article-tags-list">
                <strong>Tags:</strong>
                {detailArticle.tags.map((t) => (
                  <span key={t.id} className="tag-pill">#{t.tagName}</span>
                ))}
              </div>
            )}

            <div className="article-full-content">
              {detailArticle.newsContent ? (
                detailArticle.newsContent.split('\n\n').map((para, i) => (
                  <p key={i}>{para}</p>
                ))
              ) : (
                <p>No content recorded.</p>
              )}
            </div>

            <div className="modal-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setDetailArticle(null)}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isConfirmOpen}
        title="Confirm Article Deletion"
        message={`Are you sure you want to permanently delete article "${articleToDelete?.headline}"?`}
        confirmText="Confirm Delete"
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsConfirmOpen(false)}
        isLoading={deleting}
      />
    </div>
  );
}

