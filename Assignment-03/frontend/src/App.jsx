import React, { useState, useEffect } from 'react';
import { authService } from './services/authService';
import Navbar from './components/Navbar';
import PublicRoomsPage from './pages/PublicRoomsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CustomerProfilePage from './pages/CustomerProfilePage';
import CustomerBookingPage from './pages/CustomerBookingPage';
import CustomerHistoryPage from './pages/CustomerHistoryPage';
import StaffDashboardPage from './pages/StaffDashboardPage';
import StaffRoomsPage from './pages/StaffRoomsPage';
import StaffCustomersPage from './pages/StaffCustomersPage';
import StaffBookingsPage from './pages/StaffBookingsPage';

export default function App() {
  const [user, setUser] = useState(authService.getCurrentUser());
  const [currentView, setCurrentView] = useState('public-rooms');

  useEffect(() => {
    const handleAuthChange = () => {
      setUser(authService.getCurrentUser());
    };
    window.addEventListener('auth-changed', handleAuthChange);
    return () => window.removeEventListener('auth-changed', handleAuthChange);
  }, []);

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setCurrentView('public-rooms');
  };

  // Role guard helpers
  const isStaff = user?.role === 'ROLE_STAFF';
  const isCustomer = user?.role === 'ROLE_CUSTOMER';

  const renderView = () => {
    switch (currentView) {
      case 'public-rooms':
        return <PublicRoomsPage setCurrentView={setCurrentView} user={user} />;
      case 'login':
        return <LoginPage setCurrentView={setCurrentView} setUser={setUser} />;
      case 'register':
        return <RegisterPage setCurrentView={setCurrentView} />;

      // Customer Views
      case 'customer-profile':
        return isCustomer ? (
          <CustomerProfilePage />
        ) : (
          <LoginPage setCurrentView={setCurrentView} setUser={setUser} />
        );
      case 'customer-booking':
        return isCustomer ? (
          <CustomerBookingPage setCurrentView={setCurrentView} />
        ) : (
          <LoginPage setCurrentView={setCurrentView} setUser={setUser} />
        );
      case 'customer-history':
        return isCustomer ? (
          <CustomerHistoryPage setCurrentView={setCurrentView} />
        ) : (
          <LoginPage setCurrentView={setCurrentView} setUser={setUser} />
        );

      // Staff Views
      case 'staff-dashboard':
        return isStaff ? (
          <StaffDashboardPage setCurrentView={setCurrentView} />
        ) : (
          <LoginPage setCurrentView={setCurrentView} setUser={setUser} />
        );
      case 'staff-rooms':
        return isStaff ? (
          <StaffRoomsPage />
        ) : (
          <LoginPage setCurrentView={setCurrentView} setUser={setUser} />
        );
      case 'staff-customers':
        return isStaff ? (
          <StaffCustomersPage />
        ) : (
          <LoginPage setCurrentView={setCurrentView} setUser={setUser} />
        );
      case 'staff-bookings':
        return isStaff ? (
          <StaffBookingsPage />
        ) : (
          <LoginPage setCurrentView={setCurrentView} setUser={setUser} />
        );

      default:
        return <PublicRoomsPage setCurrentView={setCurrentView} user={user} />;
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f8fafc' }}>
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        user={user}
        onLogout={handleLogout}
      />
      <main style={{ flex: 1 }}>
        {renderView()}
      </main>
      <footer style={{
        backgroundColor: '#ffffff',
        borderTop: '1px solid #e5e7eb',
        padding: '16px',
        textAlign: 'center',
        fontSize: '13px',
        color: '#6b7280',
        marginTop: 'auto',
      }}>
        FU Mini Hotel Management System (FUMiniHotelSystem) • SBA301 Assignment 03 • Student: HaoVA (SE1910)
      </footer>
    </div>
  );
}

