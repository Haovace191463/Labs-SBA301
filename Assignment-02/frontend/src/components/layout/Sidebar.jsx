import React from 'react';

export default function Sidebar({ activePage, onNavigate, currentUser }) {
  const isAdmin = currentUser?.accountRole === 1;
  const isStaff = currentUser?.accountRole === 2;

  const navItems = [
    // Admin only management
    { id: 'users', label: 'Account Management', icon: '👥', show: isAdmin },

    // Staff only management
    { id: 'news', label: 'News Management', icon: '📰', show: isStaff },
    { id: 'my-history', label: 'My News History', icon: '📜', show: isStaff },
    { id: 'categories', label: 'Category Management', icon: '📁', show: isStaff },
    { id: 'profile', label: 'My Profile', icon: '👤', show: isStaff || isAdmin },

    // Public view available to both
    { id: 'public-news', label: 'Browse Public News', icon: '🌐', show: true },
  ];

  return (
    <aside className="app-sidebar">
      <div className="sidebar-section-title">
        {isAdmin ? 'ADMINISTRATION' : 'STAFF PORTAL'}
      </div>
      <nav className="sidebar-nav">
        {navItems
          .filter((item) => item.show)
          .map((item) => (
            <button
              key={item.id}
              className={`sidebar-nav-item ${activePage === item.id ? 'active' : ''}`}
              onClick={() => onNavigate(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </button>
          ))}
      </nav>
    </aside>
  );
}
