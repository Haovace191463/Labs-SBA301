import {useState} from "react";
import initialUsers from "../../data/users";

function UserManagement() {
    const [users, setUsers] = useState(initialUsers);
    const [searchText, setSearchText] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [dialogMode, setDialogMode] = useState("create");
    const [selectedUser, setSelectedUser] = useState(null);
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        role: 2,
        status: 1,
    });
    const [error, setError] = useState("");

    const filteredUsers = users.filter((user) =>
        user.username.toLowerCase().includes(searchText.toLowerCase())
    );

    const getRoleName = (role) => {
        return role === 1 ? "Admin" : "Staff";
    };

    const openCreateDialog = () => {
        setDialogMode("create");
        setSelectedUser(null);
        setFormData({
            username: "",
            password: "",
            role: 2,
            status: 1,
        });
        setError("");
        setIsDialogOpen(true);
    };

    const openUpdateDialog = (user) => {
        setDialogMode("update");
        setSelectedUser(user);
        setFormData({
            username: user.username,
            password: user.password,
            role: user.role,
            status: user.status,
        });
        setError("");
        setIsDialogOpen(true);
    };

    const closeDialog = () => {
        setIsDialogOpen(false);
        setSelectedUser(null);
        setError("");
    };

    const handleFormChange = (event) => {
        const {name, value} = event.target;

        setFormData((current) => ({
            ...current,
            [name]:
                name === "role" || name === "status"
                    ? Number(value)
                    : value,
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        const username = formData.username.trim();
        const password = formData.password.trim();

        if (!username) {
            setError("Username is required.");
            return;
        }

        if (!password) {
            setError("Password is required.");
            return;
        }

        const duplicate = users.some(
            (user) =>
                user.username.toLowerCase() === username.toLowerCase() &&
                user.id !== selectedUser?.id
        );

        if (duplicate) {
            setError("Username already exists.");
            return;
        }

        if (dialogMode === "create") {
            const newUser = {
                id: Date.now(),
                username,
                password,
                role: formData.role,
                status: formData.status,
            };

            setUsers((current) => [...current, newUser]);
        } else {
            setUsers((current) =>
                current.map((user) =>
                    user.id === selectedUser.id
                        ? {
                            ...user,
                            username,
                            password,
                            role: formData.role,
                            status: formData.status,
                        }
                        : user
                )
            );
        }

        closeDialog();
    };

    const handleDelete = (user) => {
        const confirmed = window.confirm(
            `Are you sure you want to delete "${user.username}"?`
        );

        if (!confirmed) {
            return;
        }

        setUsers((current) =>
            current.filter((item) => item.id !== user.id)
        );
    };

    return (
        <div className="management-page">
            <div className="page-header management-header">
                <div>
                    <h1>User Management</h1>
                    <p>Manage system accounts, roles and status.</p>
                </div>

                <button className="primary-button" onClick={openCreateDialog}>
                    + Add User
                </button>
            </div>

            <div className="management-toolbar">
                <input
                    type="text"
                    value={searchText}
                    onChange={(event) => setSearchText(event.target.value)}
                    placeholder="Search username..."
                />
            </div>

            <div className="table-container">
                <table className="data-table">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Username</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                    </thead>

                    <tbody>
                    {filteredUsers.length > 0 ? (
                        filteredUsers.map((user) => (
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>{user.username}</td>

                                <td>
                    <span className="role-badge">
                      {getRoleName(user.role)}
                    </span>
                                </td>

                                <td>
                    <span
                        className={
                            user.status === 1
                                ? "status-badge active"
                                : "status-badge inactive"
                        }
                    >
                      {user.status === 1 ? "Active" : "Inactive"}
                    </span>
                                </td>

                                <td>
                                    <div className="action-buttons">
                                        <button
                                            className="secondary-button"
                                            onClick={() => openUpdateDialog(user)}
                                        >
                                            Edit
                                        </button>

                                        <button
                                            className="danger-button"
                                            onClick={() => handleDelete(user)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="empty-state">
                                No users found.
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
                                    ? "Create User"
                                    : "Update User"}
                            </h2>

                            <button className="modal-close" onClick={closeDialog}>
                                ×
                            </button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="user-username">Username</label>

                                <input
                                    id="user-username"
                                    name="username"
                                    type="text"
                                    value={formData.username}
                                    onChange={handleFormChange}
                                    placeholder="Enter username"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="user-password">Password</label>

                                <input
                                    id="user-password"
                                    name="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={handleFormChange}
                                    placeholder="Enter password"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="user-role">Role</label>

                                <select
                                    id="user-role"
                                    name="role"
                                    value={formData.role}
                                    onChange={handleFormChange}
                                >
                                    <option value={1}>Admin</option>
                                    <option value={2}>Staff</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="user-status">Status</label>

                                <select
                                    id="user-status"
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

export default UserManagement;