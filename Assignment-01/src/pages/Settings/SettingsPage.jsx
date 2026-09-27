import { useState } from "react";

function SettingsPage({ currentUser }) {
    const [language, setLanguage] = useState("English");
    const [notifications, setNotifications] = useState(true);
    const [message, setMessage] = useState("");

    const handleSave = (event) => {
        event.preventDefault();
        setMessage("Settings saved successfully.");
    };

    return (
        <div className="management-page">
            <div className="page-header management-header">
                <div>
                    <h1>Settings</h1>
                    <p>Manage your account and system preferences.</p>
                </div>
            </div>

            <div className="settings-grid">
                <div className="settings-card">
                    <h2>Account Information</h2>

                    <div className="settings-info">
                        <div>
                            <span className="settings-label">Username</span>
                            <strong>{currentUser?.username || "Admin"}</strong>
                        </div>

                        <div>
                            <span className="settings-label">Role</span>
                            <strong>
                                {currentUser?.role === 1 ? "Admin" : "Staff"}
                            </strong>
                        </div>
                    </div>
                </div>

                <div className="settings-card">
                    <h2>System Preferences</h2>

                    <form onSubmit={handleSave}>
                        <div className="form-group">
                            <label htmlFor="language">Language</label>

                            <select
                                id="language"
                                value={language}
                                onChange={(event) =>
                                    setLanguage(event.target.value)
                                }
                            >
                                <option value="English">English</option>
                                <option value="Vietnamese">Vietnamese</option>
                            </select>
                        </div>

                        <div className="settings-checkbox">
                            <input
                                id="notifications"
                                type="checkbox"
                                checked={notifications}
                                onChange={(event) =>
                                    setNotifications(event.target.checked)
                                }
                            />

                            <label htmlFor="notifications">
                                Enable notifications
                            </label>
                        </div>

                        {message && (
                            <div className="success-message">
                                {message}
                            </div>
                        )}

                        <button type="submit" className="primary-button">
                            Save Settings
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default SettingsPage;