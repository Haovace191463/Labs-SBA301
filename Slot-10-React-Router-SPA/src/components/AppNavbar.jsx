import { Navbar, Nav, Container, Badge } from 'react-bootstrap';
import { NavLink, Link } from 'react-router-dom';
import { useFavorites } from '../context/FavoritesContext';

export default function AppNavbar() {
  const { favorites } = useFavorites();

  return (
    <Navbar expand="lg" className="custom-navbar sticky-top shadow-sm py-2">
      <Container>
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
          <span className="me-2" style={{ fontSize: '1.4rem' }}>🌸</span>
          <span className="brand-title">Orchid Router SPA</span>
          <span className="brand-badge d-none d-sm-inline">SBA301 Slot 10</span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="main-navbar-nav" />

        <Navbar.Collapse id="main-navbar-nav">
          <Nav className="ms-auto align-items-lg-center">
            {/* NavLink with 'end' prop ensures exact matching for root path '/' */}
            <Nav.Link
              as={NavLink}
              to="/"
              end
              className={({ isActive }) =>
                `nav-link-custom ${isActive ? 'active-nav' : ''}`
              }
            >
              Home
            </Nav.Link>

            <Nav.Link
              as={NavLink}
              to="/orchids"
              className={({ isActive }) =>
                `nav-link-custom ${isActive ? 'active-nav' : ''}`
              }
            >
              Orchids
            </Nav.Link>

            <Nav.Link
              as={NavLink}
              to="/about"
              className={({ isActive }) =>
                `nav-link-custom ${isActive ? 'active-nav' : ''}`
              }
            >
              About
            </Nav.Link>

            <Nav.Link
              as={NavLink}
              to="/contact"
              className={({ isActive }) =>
                `nav-link-custom ${isActive ? 'active-nav' : ''}`
              }
            >
              Contact
            </Nav.Link>

            <Nav.Link
              as={NavLink}
              to="/dashboard"
              className={({ isActive }) =>
                `nav-link-custom ${isActive ? 'active-nav' : ''}`
              }
            >
              Dashboard
              {favorites.length > 0 && (
                <Badge pill bg="success" className="ms-1" style={{ fontSize: '0.68rem' }}>
                  {favorites.length}
                </Badge>
              )}
            </Nav.Link>

            <Nav.Link
              as={NavLink}
              to="/exercises"
              className={({ isActive }) =>
                `nav-link-custom ${isActive ? 'active-nav' : ''}`
              }
            >
              Exercises
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
