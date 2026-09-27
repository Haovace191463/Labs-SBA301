function Sidebar({activePage, onNavigate}) {
    const menuItems = [
        {id: "dashboard", label: "Dashboard"},
        {id: "categories", label: "Categories"},
        {id: "news", label: "News"},
        {id: "users", label: "Users"},
        {id: "settings", label: "Settings"},
    ];

    return (
        <aside className="sidebar">
            <div className="sidebar-title">MENU</div>

            <nav>
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        className={activePage === item.id ? "menu-item active" : "menu-item"}
                        onClick={() => onNavigate(item.id)}
                    >
                        {item.label}
                    </button>
                ))}
            </nav>
        </aside>
    );
}

export default Sidebar;


