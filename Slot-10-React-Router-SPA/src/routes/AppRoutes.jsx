import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import MainLayout from '../layouts/MainLayout';
import DashboardLayout from '../layouts/DashboardLayout';

// Pages
import HomePage from '../pages/HomePage';
import OrchidsPage from '../pages/OrchidsPage';
import OrchidDetailPage from '../pages/OrchidDetailPage';
import AboutPage from '../pages/AboutPage';
import ContactPage from '../pages/ContactPage';
import ExercisesPage from '../pages/ExercisesPage';
import LocationDemoPage from '../pages/LocationDemoPage';
import NotFoundPage from '../pages/NotFoundPage';

// Dashboard Subpages
import DashboardHomePage from '../pages/dashboard/DashboardHomePage';
import FavoritesPage from '../pages/dashboard/FavoritesPage';
import ProfilePage from '../pages/dashboard/ProfilePage';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Root Layout wrapper for standard application chrome */}
      <Route path="/" element={<MainLayout />}>
        {/* FR01: Home page (index route) */}
        <Route index element={<HomePage />} />

        {/* FR02 & FR03: Orchid catalog and query param filtering */}
        <Route path="orchids" element={<OrchidsPage />} />

        {/* FR04 & FR05: Dynamic orchid detail view & resource-not-found handling */}
        <Route path="orchids/:id" element={<OrchidDetailPage />} />

        {/* FR06: About project page */}
        <Route path="about" element={<AboutPage />} />

        {/* FR06: Contact form & programmatic navigation with useNavigate */}
        <Route path="contact" element={<ContactPage />} />

        {/* Exercise Hub: 10 Hands-on Exercises */}
        <Route path="exercises" element={<ExercisesPage />} />

        {/* Exercise 07 & Location Inspection Demo */}
        <Route path="location-demo" element={<LocationDemoPage />} />

        {/* FR07: Nested Dashboard routing with DashboardLayout & Outlet */}
        <Route path="dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardHomePage />} />
          <Route path="favorites" element={<FavoritesPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>

        {/* FR08: Legacy redirect from /home to / using <Navigate replace /> */}
        <Route path="home" element={<Navigate to="/" replace />} />

        {/* FR09: Wildcard route catching all unmapped paths */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
