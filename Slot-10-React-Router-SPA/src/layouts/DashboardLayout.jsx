import { Outlet, NavLink } from 'react-router-dom';
import { Row, Col, Card, Nav, Badge } from 'react-bootstrap';
import Breadcrumbs from '../components/Breadcrumbs';
import { useFavorites } from '../context/FavoritesContext';

export default function DashboardLayout() {
  const { favorites } = useFavorites();

  return (
    <div>
      <Breadcrumbs items={[{ label: 'Dashboard' }]} />

      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2 mb-4 pb-3 border-bottom">
        <div>
          <h1 className="h2 fw-bold text-dark mb-1">
            🌱 Orchid Management Dashboard
          </h1>
          <p className="text-muted mb-0">
            Demonstrating React Router Nested Routes with <code className="code-badge">&lt;Outlet /&gt;</code>.
          </p>
        </div>
        <div className="d-flex align-items-center gap-2">
          <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-3 py-2 rounded-pill">
            Nested Sub-Router Active
          </span>
        </div>
      </div>

      <Row className="g-4">
        {/* Dashboard Navigation Sidebar */}
        <Col lg={3} md={4}>
          <Card className="border-0 shadow-sm rounded-4 p-2">
            <Card.Body className="p-2">
              <div className="small text-uppercase fw-bold text-muted px-3 py-2 tracking-wider">
                Dashboard Menu
              </div>
              <Nav className="flex-column dashboard-sidebar-nav">
                <Nav.Link
                  as={NavLink}
                  to="/dashboard"
                  end
                  className={({ isActive }) =>
                    `nav-link ${isActive ? 'active-subnav' : ''}`
                  }
                >
                  <span className="me-2">📊</span> Overview
                </Nav.Link>

                <Nav.Link
                  as={NavLink}
                  to="/dashboard/favorites"
                  className={({ isActive }) =>
                    `nav-link ${isActive ? 'active-subnav' : ''}`
                  }
                >
                  <span className="me-2">❤️</span> Favorites
                  {favorites.length > 0 && (
                    <Badge pill bg="danger" className="ms-auto">
                      {favorites.length}
                    </Badge>
                  )}
                </Nav.Link>

                <Nav.Link
                  as={NavLink}
                  to="/dashboard/profile"
                  className={({ isActive }) =>
                    `nav-link ${isActive ? 'active-subnav' : ''}`
                  }
                >
                  <span className="me-2">👤</span> Student Profile
                </Nav.Link>
              </Nav>

              <hr className="my-3 text-muted" />

              <div className="px-3 py-2 bg-light rounded-3 small">
                <div className="fw-semibold text-secondary mb-1">Routing Tip</div>
                <p className="text-muted mb-0" style={{ fontSize: '0.8rem' }}>
                  Notice that switching between tabs only swaps the content inside{' '}
                  <code className="code-badge">&lt;Outlet /&gt;</code> without unmounting this sidebar!
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Child Route Content rendered via Outlet */}
        <Col lg={9} md={8}>
          <div className="dashboard-content-area">
            <Outlet />
          </div>
        </Col>
      </Row>
    </div>
  );
}
