import { Outlet, Link } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import AppNavbar from '../components/AppNavbar';

export default function MainLayout() {
  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Top Navigation Bar */}
      <AppNavbar />

      {/* Main Content Area rendered via Outlet */}
      <main className="flex-grow-1 py-4">
        <Container>
          <Outlet />
        </Container>
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <Container>
          <Row className="gy-3 align-items-center">
            <Col md={6}>
              <div className="d-flex align-items-center gap-2 mb-1">
                <span style={{ fontSize: '1.2rem' }}>🌸</span>
                <strong className="text-dark">Orchid Router SPA</strong>
                <span className="badge bg-light text-secondary border">Slot 10</span>
              </div>
              <p className="text-muted small mb-0">
                SBA301 – Integrate Single Page Application with Spring Boot.
                <br />
                Hands-on practical lab for React Router v7 &amp; Single Page Application architecture.
              </p>
            </Col>
            <Col md={6} className="text-md-end">
              <div className="small text-muted mb-2">
                Student: <strong>Võ Anh Hào</strong> (CE191463)
              </div>
              <div className="d-flex justify-content-md-end gap-3 small">
                <Link to="/" className="text-decoration-none text-secondary">Home</Link>
                <Link to="/orchids" className="text-decoration-none text-secondary">Orchids</Link>
                <Link to="/about" className="text-decoration-none text-secondary">About</Link>
                <Link to="/dashboard" className="text-decoration-none text-secondary">Dashboard</Link>
                <Link to="/exercises" className="text-decoration-none text-secondary">Exercises</Link>
              </div>
            </Col>
          </Row>
        </Container>
      </footer>
    </div>
  );
}
