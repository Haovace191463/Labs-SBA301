import React, { useState, useEffect } from 'react';
import { newsService } from '../../services/newsService';
import { categoryService } from '../../services/categoryService';
import Modal from '../../components/common/Modal';
import Alert from '../../components/common/Alert';
import logo from '../../assets/funews-logo.png';

export default function PublicNewsPage({ onBackToLogin }) {
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedArticle, setSelectedArticle] = useState(null);

  useEffect(() => {
    loadPublicData();
  }, []);

  const loadPublicData = async () => {
    try {
      setLoading(true);
      setError('');
      const [articlesData, categoriesData] = await Promise.all([
        newsService.getAll({ activeOnly: true }),
        categoryService.getAll(true),
      ]);
      setArticles(articlesData || []);
      setCategories(categoriesData || []);
    } catch (err) {
      setError(err.message || 'Failed to load public news articles');
    } finally {
      setLoading(false);
    }
  };

  const filteredArticles = articles.filter((art) => {
    const matchesCategory =
      !selectedCategory || String(art.categoryID) === String(selectedCategory);
    const matchesSearch =
      !searchTerm ||
      art.headline?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      art.newsTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      art.newsContent?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="public-news-page">
      <header className="public-header">
        <div className="public-header-content">
          <div className="public-brand">
            <img src={logo} alt="FUNews Logo" className="public-logo" />
            <div>
              <h1>FUNews Portal</h1>
              <p>Public University News Bulletin &bull; Assignment 02</p>
            </div>
          </div>
          <button className="btn btn-primary" onClick={onBackToLogin}>
            Sign In / Portal Access
          </button>
        </div>
      </header>

      <main className="public-main">
        <div className="public-controls-bar">
          <div className="search-input-wrapper">
            <input
              type="text"
              className="form-control"
              placeholder="Search news headline or content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filter-select-wrapper">
            <select
              className="form-control"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.categoryName}
                </option>
              ))}
            </select>
          </div>
        </div>

        {error && <Alert type="danger" message={error} />}

        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading published news articles...</p>
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">📭</span>
            <h3>No Published Articles Found</h3>
            <p>Try adjusting your search criteria or category filter.</p>
          </div>
        ) : (
          <div className="articles-grid">
            {filteredArticles.map((article) => (
              <div
                key={article.newsArticleID}
                className="article-card"
                onClick={() => setSelectedArticle(article)}
              >
                <div className="article-card-header">
                  <span className="category-tag">
                    {article.categoryName || 'University News'}
                  </span>
                  <span className="article-date">
                    {article.createdDate
                      ? new Date(article.createdDate).toLocaleDateString()
                      : 'Recent'}
                  </span>
                </div>

                <h3 className="article-headline">{article.headline}</h3>

                {article.newsTitle && article.newsTitle !== article.headline && (
                  <p className="article-title-sub">{article.newsTitle}</p>
                )}

                <p className="article-snippet">
                  {article.newsContent
                    ? article.newsContent.slice(0, 160) + '...'
                    : 'No preview available.'}
                </p>

                <div className="article-card-footer">
                  <span className="article-source">Source: {article.newsSource || 'University'}</span>
                  <button className="btn btn-sm btn-outline-primary">Read More &rarr;</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Article Detail Modal */}
      <Modal
        isOpen={!!selectedArticle}
        title={selectedArticle?.headline || 'Article Details'}
        onClose={() => setSelectedArticle(null)}
        maxWidth="700px"
      >
        {selectedArticle && (
          <div className="article-detail-view">
            <div className="article-detail-meta">
              <span>
                <strong>Category:</strong> {selectedArticle.categoryName || 'N/A'}
              </span>
              <span>
                <strong>Published:</strong>{' '}
                {selectedArticle.createdDate
                  ? new Date(selectedArticle.createdDate).toLocaleString()
                  : 'N/A'}
              </span>
              <span>
                <strong>Source:</strong> {selectedArticle.newsSource || 'N/A'}
              </span>
            </div>

            {selectedArticle.tags && selectedArticle.tags.length > 0 && (
              <div className="article-tags-list">
                <strong>Tags:</strong>
                {selectedArticle.tags.map((t) => (
                  <span key={t.id} className="tag-pill">
                    #{t.tagName}
                  </span>
                ))}
              </div>
            )}

            <div className="article-full-content">
              {selectedArticle.newsContent ? (
                selectedArticle.newsContent.split('\n\n').map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))
              ) : (
                <p>No content provided.</p>
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

