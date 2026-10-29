import React, { useState, useEffect } from 'react';
import { authService } from './services/authService';
import LoginPage from './pages/Login/LoginPage';
import PublicNewsPage from './pages/Public/PublicNewsPage';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import CategoryManagement from './pages/Categories/CategoryManagement';
import NewsManagement from './pages/News/NewsManagement';
import MyNewsHistory from './pages/News/MyNewsHistory';
import UserManagement from './pages/Users/UserManagement';
import ProfilePage from './pages/Profile/ProfilePage';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [activePage, setActivePage] = useState('news');
  const [isPublicMode, setIsPublicMode] = useState(false);

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
      setActivePage(user.accountRole === 1 ? 'users' : 'news');
    }

    const handleUnauthorized = () => {
      setCurrentUser(null);
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, []);

  const handleLogin = (user) => {
    setCurrentUser(user);
    setIsPublicMode(false);
    setActivePage(user.accountRole === 1 ? 'users' : 'news');
  };

  const handleLogout = async () => {
    await authService.logout();
    setCurrentUser(null);
    setIsPublicMode(false);
  };

  const handleSwitchToPublic = () => {
    setIsPublicMode(true);
  };

  const handleReturnToLogin = () => {
    setIsPublicMode(false);
  };

  // If in public guest view
  if (isPublicMode) {
    return (
      <PublicNewsPage
        onBackToLogin={() => {
          if (currentUser) {
            setIsPublicMode(false);
          } else {
            handleReturnToLogin();
          }
        }}
      />
    );
  }

  // If not logged in and not in public mode, show login page
  if (!currentUser) {
    return (
      <LoginPage
        onLogin={handleLogin}
        onGuestAccess={handleSwitchToPublic}
      />
    );
  }

  const isAdmin = currentUser.accountRole === 1;
  const isStaff = currentUser.accountRole === 2;

  // Authenticated Portal View
  return (
    <div className="app-container">
      <Header
        currentUser={currentUser}
        onLogout={handleLogout}
        onSwitchToPublic={handleSwitchToPublic}
      />

      <div className="app-layout">
        <Sidebar
          activePage={activePage}
          onNavigate={(page) => {
            if (page === 'public-news') {
              handleSwitchToPublic();
            } else {
              setActivePage(page);
            }
          }}
          currentUser={currentUser}
        />

        <main className="main-content">
          {/* Admin Functions */}
          {activePage === 'users' && isAdmin && (
            <UserManagement />
          )}

          {/* Staff Functions */}
          {activePage === 'news' && isStaff && (
            <NewsManagement currentUser={currentUser} />
          )}

          {activePage === 'my-history' && isStaff && (
            <MyNewsHistory currentUser={currentUser} />
          )}

          {activePage === 'categories' && isStaff && (
            <CategoryManagement />
          )}

          {/* Profile Management for Logged-in Staff/Admin */}
          {activePage === 'profile' && (
            <ProfilePage
              currentUser={currentUser}
              onUpdateUser={setCurrentUser}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
