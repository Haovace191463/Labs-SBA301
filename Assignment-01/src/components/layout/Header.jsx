import funewsLogo from "../../assets/funews-logo.png";

function Header({ currentUser, onLogout }) {
    return (
        <header className="app-header">
            <div className="app-brand">
                <img
                    src={funewsLogo}
                    alt="FUNews Logo"
                    className="app-logo"
                />
            </div>

            <div className="app-user">
                <span>
                    Welcome, <strong>{currentUser?.username}</strong>
                </span>

                <button onClick={onLogout} className="logout-button">
                    Logout
                </button>
            </div>
        </header>
    );
}

export default Header;