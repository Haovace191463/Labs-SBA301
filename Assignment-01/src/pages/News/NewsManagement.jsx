import { useState } from "react";
import initialNews from "../../data/news";
import categories from "../../data/categories";

function NewsManagement() {
  const [news, setNews] = useState(initialNews);
  const [searchText, setSearchText] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState("create");
  const [selectedNews, setSelectedNews] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    categoryId: categories[0]?.id || "",
    status: 1,
    tags: "",
  });
  const [error, setError] = useState("");

  const filteredNews = news.filter((item) =>
    item.title.toLowerCase().includes(searchText.toLowerCase())
  );

  const getCategoryName = (categoryId) => {
    const category = categories.find((item) => item.id === categoryId);
    return category ? category.name : "Unknown";
  };

  const openCreateDialog = () => {
    setDialogMode("create");
    setSelectedNews(null);
    setFormData({
      title: "",
      content: "",
      categoryId: categories[0]?.id || "",
      status: 1,
      tags: "",
    });
    setError("");
    setIsDialogOpen(true);
  };

  const openUpdateDialog = (item) => {
    setDialogMode("update");
    setSelectedNews(item);
    setFormData({
      title: item.title,
      content: item.content,
      categoryId: item.categoryId,
      status: item.status,
      tags: item.tags?.join(", ") || "",
    });
    setError("");
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setSelectedNews(null);
    setError("");
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: name === "categoryId" || name === "status"
        ? Number(value)
        : value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const title = formData.title.trim();
    const content = formData.content.trim();

    if (!title) {
      setError("News title is required.");
      return;
    }

    if (!content) {
      setError("News content is required.");
      return;
    }

    const duplicate = news.some(
      (item) =>
        item.title.toLowerCase() === title.toLowerCase() &&
        item.id !== selectedNews?.id
    );

    if (duplicate) {
      setError("News title already exists.");
      return;
    }

    const tags = formData.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

    if (dialogMode === "create") {
      const newNews = {
        id: Date.now(),
        title,
        content,
        categoryId: formData.categoryId,
        createdBy: 1,
        status: formData.status,
        tags,
      };

      setNews((current) => [...current, newNews]);
    } else {
      setNews((current) =>
        current.map((item) =>
          item.id === selectedNews.id
            ? {
                ...item,
                title,
                content,
                categoryId: formData.categoryId,
                status: formData.status,
                tags,
              }
            : item
        )
      );
    }

    closeDialog();
  };

  const handleDelete = (item) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${item.title}"?`
    );

    if (!confirmed) {
      return;
    }

    setNews((current) =>
      current.filter((newsItem) => newsItem.id !== item.id)
    );
  };

  return (
    <div className="management-page">
      <div className="page-header management-header">
        <div>
          <h1>News Management</h1>
          <p>Manage news articles and their information.</p>
        </div>

        <button className="primary-button" onClick={openCreateDialog}>
          + Add News
        </button>
      </div>

      <div className="management-toolbar">
        <input
          type="text"
          value={searchText}
          onChange={(event) => setSearchText(event.target.value)}
          placeholder="Search news title..."
        />
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Category</th>
              <th>Status</th>
              <th>Tags</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredNews.length > 0 ? (
              filteredNews.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.title}</td>
                  <td>{getCategoryName(item.categoryId)}</td>
                  <td>
                    <span
                      className={
                        item.status === 1
                          ? "status-badge active"
                          : "status-badge inactive"
                      }
                    >
                      {item.status === 1 ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td>{item.tags?.join(", ") || "-"}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="secondary-button"
                        onClick={() => openUpdateDialog(item)}
                      >
                        Edit
                      </button>

                      <button
                        className="danger-button"
                        onClick={() => handleDelete(item)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="empty-state">
                  No news found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isDialogOpen && (
        <div className="modal-overlay">
          <div className="modal-card news-modal">
            <div className="modal-header">
              <h2>
                {dialogMode === "create"
                  ? "Create News"
                  : "Update News"}
              </h2>

              <button className="modal-close" onClick={closeDialog}>
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="news-title">Title</label>

                <input
                  id="news-title"
                  name="title"
                  type="text"
                  value={formData.title}
                  onChange={handleFormChange}
                  placeholder="Enter news title"
                />
              </div>

              <div className="form-group">
                <label htmlFor="news-content">Content</label>

                <textarea
                  id="news-content"
                  name="content"
                  value={formData.content}
                  onChange={handleFormChange}
                  placeholder="Enter news content"
                  rows="5"
                />
              </div>

              <div className="form-group">
                <label htmlFor="news-category">Category</label>

                <select
                  id="news-category"
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleFormChange}
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="news-status">Status</label>

                <select
                  id="news-status"
                  name="status"
                  value={formData.status}
                  onChange={handleFormChange}
                >
                  <option value={1}>Active</option>
                  <option value={0}>Inactive</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="news-tags">
                  Tags
                </label>

                <input
                  id="news-tags"
                  name="tags"
                  type="text"
                  value={formData.tags}
                  onChange={handleFormChange}
                  placeholder="technology, education"
                />
              </div>

              {error && <div className="form-error">{error}</div>}

              <div className="modal-actions">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={closeDialog}
                >
                  Cancel
                </button>

                <button type="submit" className="primary-button">
                  {dialogMode === "create" ? "Create" : "Update"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default NewsManagement;