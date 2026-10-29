import React, { useState, useEffect } from 'react';
import { newsService } from '../../services/newsService';
import Modal from '../../components/common/Modal';
import Alert from '../../components/common/Alert';

export default function MyNewsHistory({ currentUser }) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    loadMyArticles();
  }, [currentUser]);

  const loadMyArticles = async () => {
    if (!currentUser?.accountId) return;
    try {
      setLoading(true);
      setError('');
      const data = await newsService.getAll({ createdById: currentUser.accountId });
      setArticles(data || []);
    } catch (err) {
      setError(err.message || 'Failed to load personal news history');
    } finally {
      setLoading(false);
    }
  };

  const filteredArticles = articles.filter((art) => {
    const term = searchTerm.toLowerCase();
    return (
      !term ||
      art.headline?.toLowerCase().includes(term) ||
      art.newsTitle?.toLowerCase().includes(term) ||
      art.newsContent?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h2>My News History</h2>
          <p className="page-description">
            Articles authored and published by {currentUser?.accountName} (Account #{currentUser?.accountId})
          </p>
        </div>
        <button className="btn btn-outline-primary btn-sm" onClick={loadMyArticles}>
          🔄 Refresh
        </button>
      </div>

      {error && <Alert type="danger" message={error} onClose={() => setError('')} />}

      <div className="card table-card">
        <div className="table-toolbar">
          <div className="search-input-wrapper">
            <input
              type="text"
              className="form-control"
              placeholder="Search your articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <span className="results-count">Total {filteredArticles.length} authored articles</span>
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading your articles...</p>
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">📝</span>
            <h3>No Articles Found in Your History</h3>
            <p>You have not authored any news articles yet, or none match your search.</p>
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
                  <th>Created Date</th>
                  <th style={{ width: '100px' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredArticles.map((art) => (
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
                          <span className="text-muted small">None</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <span
                        className={`badge ${art.newsStatus ? 'badge-success' : 'badge-secondary'}`}
                      >
                        {art.newsStatus ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      {art.createdDate ? new Date(art.createdDate).toLocaleDateString() : 'N/A'}
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-info"
                        onClick={() => setSelectedArticle(art)}
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <Modal
        isOpen={!!selectedArticle}
        title={selectedArticle?.headline || 'Article Details'}
        onClose={() => setSelectedArticle(null)}
        maxWidth="650px"
      >
        {selectedArticle && (
          <div className="article-detail-view">
            <div className="article-detail-meta">
              <span><strong>Category:</strong> {selectedArticle.categoryName}</span>
              <span><strong>Status:</strong> {selectedArticle.newsStatus ? 'Active' : 'Inactive'}</span>
              <span><strong>Published Date:</strong> {selectedArticle.createdDate ? new Date(selectedArticle.createdDate).toLocaleString() : 'N/A'}</span>
            </div>

            <div className="article-full-content">
              {selectedArticle.newsContent ? (
                selectedArticle.newsContent.split('\n\n').map((p, i) => (
                  <p key={i}>{p}</p>
                ))
              ) : (
                <p>No content.</p>
              )}
            </div>

            <div className="modal-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setSelectedArticle(null)}
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

