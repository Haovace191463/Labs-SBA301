import { Row, Col, Button, Card, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { ORCHIDS } from '../data/orchids';
import OrchidCard from '../components/OrchidCard';

export default function HomePage() {
  const featuredOrchids = ORCHIDS.filter((o) => o.featured).slice(0, 3);

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-banner text-center text-lg-start">
        <Row className="align-items-center g-4">
          <Col lg={7}>
            <Badge bg="success" className="px-3 py-2 rounded-pill mb-3 fw-semibold">
              SBA301 • Chapter 09: React Router &amp; SPA
            </Badge>
            <h1 className="display-5 fw-bold text-dark mb-3">
              Discover the Botanical Elegance of <span className="text-success">Orchids</span>
            </h1>
            <p className="lead text-muted mb-4 fs-6">
              Welcome to <strong>Orchid Router SPA</strong> — an educational Single Page Application
              built for SBA301. Explore client-side routing, dynamic URL parameters, query string filters,
              nested layouts with <code className="code-badge">&lt;Outlet /&gt;</code>, and seamless browser history.
            </p>
            <div className="d-flex flex-wrap gap-3 justify-content-center justify-content-lg-start">
              <Button
                as={Link}
                to="/orchids"
                variant="success"
                size="lg"
                className="rounded-pill px-4 fw-semibold shadow-sm"
              >
                🌿 Explore Orchids
              </Button>
              <Button
                as={Link}
                to="/about"
                variant="outline-secondary"
                size="lg"
                className="rounded-pill px-4 fw-semibold"
              >
                Learn About SPA
              </Button>
              <Button
                as={Link}
                to="/exercises"
                variant="outline-primary"
                size="lg"
                className="rounded-pill px-4 fw-semibold"
              >
                🧪 10 Hands-on Exercises
              </Button>
            </div>
          </Col>
          <Col lg={5} className="text-center">
            <div className="position-relative d-inline-block">
              <img
                src="https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?auto=format&fit=crop&w=600&q=80"
                alt="Moon Orchid Showcase"
                className="img-fluid rounded-4 shadow-lg"
                style={{ maxHeight: '360px', objectFit: 'cover' }}
              />
              <div
                className="position-absolute bottom-0 start-50 translate-middle-x bg-white px-3 py-2 rounded-pill shadow-sm text-dark small fw-semibold text-nowrap"
                style={{ marginBottom: '-14px', border: '1px solid #e2e8f0' }}
              >
                🌺 Zero Document Reloads
              </div>
            </div>
          </Col>
        </Row>
      </section>

      {/* Featured Orchids Section */}
      <section className="mb-5">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-4">
          <div>
            <h2 className="h3 fw-bold text-dark mb-1">Featured Orchid Species</h2>
            <p className="text-muted mb-0">Handpicked spotlight varieties from diverse tropical habitats.</p>
          </div>
          <Button as={Link} to="/orchids" variant="link" className="text-success fw-bold text-decoration-none p-0 mt-2 mt-md-0">
            View Complete Collection ({ORCHIDS.length}) →
          </Button>
        </div>

        <Row className="g-4">
          {featuredOrchids.map((orchid) => (
            <Col key={orchid.id} md={6} lg={4}>
              <OrchidCard orchid={orchid} />
            </Col>
          ))}
        </Row>
      </section>

      {/* Educational Context Cards */}
      <section className="mb-5">
        <h2 className="h4 fw-bold text-dark mb-3">Core Routing Concepts Demonstrated</h2>
        <Row className="g-3">
          <Col md={4}>
            <Card className="h-100 border-0 shadow-sm rounded-4 p-3 bg-white">
              <Card.Body>
                <div className="fs-2 mb-2">⚡</div>
                <Card.Title as="h3" className="h6 fw-bold">Client-Side Navigation</Card.Title>
                <Card.Text className="small text-muted">
                  Using <code className="code-badge">&lt;Link&gt;</code> and <code className="code-badge">&lt;NavLink&gt;</code> prevents
                  full HTML document reloads, preserving memory and application state while updating the address bar.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="h-100 border-0 shadow-sm rounded-4 p-3 bg-white">
              <Card.Body>
                <div className="fs-2 mb-2">🔍</div>
                <Card.Title as="h3" className="h6 fw-bold">Dynamic Routes &amp; Search Params</Card.Title>
                <Card.Text className="small text-muted">
                  Routes like <code className="code-badge">/orchids/:id</code> parse path parameters via <code className="code-badge">useParams()</code>,
                  while category filters utilize <code className="code-badge">useSearchParams()</code> for bookmarkable links.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="h-100 border-0 shadow-sm rounded-4 p-3 bg-white">
              <Card.Body>
                <div className="fs-2 mb-2">🗂️</div>
                <Card.Title as="h3" className="h6 fw-bold">Nested Layouts &amp; Outlets</Card.Title>
                <Card.Text className="small text-muted">
                  The <code className="code-badge">/dashboard</code> route showcases nested child routing where child views render
                  dynamically into the parent layout&apos;s <code className="code-badge">&lt;Outlet /&gt;</code>.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </section>
    </div>
  );
}
