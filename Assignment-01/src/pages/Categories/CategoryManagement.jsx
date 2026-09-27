import {useState} from "react";
import initialCategories from "../../data/categories";

function CategoryManagement() {
    const [categories, setCategories] = useState(initialCategories);
    const [searchText, setSearchText] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [dialogMode, setDialogMode] = useState("create");
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        status: 1,
    });
    const [error, setError] = useState("");

    const filteredCategories = categories.filter((category) =>
        category.name.toLowerCase().includes(searchText.toLowerCase())
    );

    const openCreateDialog = () => {
        setDialogMode("create");
        setSelectedCategory(null);
        setFormData({
            name: "",
            status: 1,
        });
        setError("");
        setIsDialogOpen(true);
    };

    const openUpdateDialog = (category) => {
        setDialogMode("update");
        setSelectedCategory(category);
        setFormData({
            name: category.name,
            status: category.status,
        });
        setError("");
        setIsDialogOpen(true);
    };

    const closeDialog = () => {
        setIsDialogOpen(false);
        setSelectedCategory(null);
        setError("");
    };

    const handleFormChange = (event) => {
        const {name, value} = event.target;

        setFormData((current) => ({
            ...current,
            [name]: name === "status" ? Number(value) : value,
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        const name = formData.name.trim();

        if (!name) {
            setError("Category name is required.");
            return;
        }

        const duplicate = categories.some(
            (category) =>
                category.name.toLowerCase() === name.toLowerCase() &&
                category.id !== selectedCategory?.id
        );

        if (duplicate) {
            setError("Category name already exists.");
            return;
        }

        if (dialogMode === "create") {
            const newCategory = {
                id: Date.now(),
                name,
                status: formData.status,
            };

            setCategories((current) => [...current, newCategory]);
        } else {
            setCategories((current) =>
                current.map((category) =>
                    category.id === selectedCategory.id
                        ? {
                            ...category,
                            name,
                            status: formData.status,
                        }
                        : category
                )
            );
        }

        closeDialog();
    };

    const handleDelete = (category) => {
        const confirmed = window.confirm(
            `Are you sure you want to delete "${category.name}"?`
        );

        if (!confirmed) {
            return;
        }

        setCategories((current) =>
            current.filter((item) => item.id !== category.id)
        );
    };

    return (
        <div className="management-page">
            <div className="page-header management-header">
                <div>
                    <h1>Category Management</h1>
                    <p>Manage categories and their status.</p>
                </div>

                <button className="primary-button" onClick={openCreateDialog}>
                    + Add Category
                </button>
            </div>

            <div className="management-toolbar">
                <input
                    type="text"
                    value={searchText}
                    onChange={(event) => setSearchText(event.target.value)}
                    placeholder="Search category name..."
                />
            </div>

            <div className="table-container">
                <table className="data-table">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Category Name</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                    </thead>

                    <tbody>
                    {filteredCategories.length > 0 ? (
                        filteredCategories.map((category) => (
                            <tr key={category.id}>
                                <td>{category.id}</td>
                                <td>{category.name}</td>
                                <td>
                    <span
                        className={
                            category.status === 1
                                ? "status-badge active"
                                : "status-badge inactive"
                        }
                    >
                      {category.status === 1 ? "Active" : "Inactive"}
                    </span>
                                </td>
                                <td>
                                    <div className="action-buttons">
                                        <button
                                            className="secondary-button"
                                            onClick={() => openUpdateDialog(category)}
                                        >
                                            Edit
                                        </button>

                                        <button
                                            className="danger-button"
                                            onClick={() => handleDelete(category)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" className="empty-state">
                                No categories found.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>

            {isDialogOpen && (
                <div className="modal-overlay">
                    <div className="modal-card">
                        <div className="modal-header">
                            <h2>
                                {dialogMode === "create"
                                    ? "Create Category"
                                    : "Update Category"}
                            </h2>

                            <button className="modal-close" onClick={closeDialog}>
                                ×
                            </button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="category-name">Category Name</label>

                                <input
                                    id="category-name"
                                    name="name"
                                    type="text"
                                    value={formData.name}
                                    onChange={handleFormChange}
                                    placeholder="Enter category name"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="category-status">Status</label>

                                <select
                                    id="category-status"
                                    name="status"
                                    value={formData.status}
                                    onChange={handleFormChange}
                                >
                                    <option value={1}>Active</option>
                                    <option value={0}>Inactive</option>
                                </select>
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

export default CategoryManagement;