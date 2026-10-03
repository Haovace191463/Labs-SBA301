import { Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { ORCHIDS, ORCHID_CATEGORIES } from '../../data/orchids';
import { useFavorites } from '../../context/FavoritesContext';

export default function DashboardHomePage() {
  const { favorites } = useFavorites();

  const totalOrchids = ORCHIDS.length;
  // Exclude 'All'
  const totalCategories = ORCHID_CATEGORIES.filter(c => c !== 'All').length;
  const totalFavorites = favorites.length;
  const featuredCount = ORCHIDS.filter(o => o.featured).length;

  return (
    <div>
      <div className="mb-4">
        <h2 className="h4 fw-bold text-dark mb-1">System Overview</h2>
        <p className="text-muted small">
          Aggregated statistics calculated dynamically from shared orchid dataset and local favorites state.
        </p>
      </div>

      {/* Metrics Row */}
      <Row className="g-3 mb-4">
        <Col sm={6} xl={3}>
          <Card className="border-0 shadow-sm rounded-3 bg-white h-100 p-3">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <div className="text-muted small fw-semibold">TOTAL SPECIES</div>
                <div className="h3 fw-bold text-success mb-0">{totalOrchids}</div>
              </div>
              <div className="fs-1">🌿</div>
            </div>
            <div className="mt-2 text-muted small">Active orchid records</div>
          </Card>
        </Col>

        <Col sm={6} xl={3}>
          <Card className="border-0 shadow-sm rounded-3 bg-white h-100 p-3">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <div className="text-muted small fw-semibold">CATEGORIES</div>
                <div className="h3 fw-bold text-primary mb-0">{totalCategories}</div>
              </div>
              <div className="fs-1">📂</div>
            </div>
            <div className="mt-2 text-muted small">Genera &amp; classifications</div>
          </Card>
        </Col>

        <Col sm={6} xl={3}>
          <Card className="border-0 shadow-sm rounded-3 bg-white h-100 p-3">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <div className="text-muted small fw-semibold">FAVORITES</div>
                <div className="h3 fw-bold text-danger mb-0">{totalFavorites}</div>
              </div>
              <div className="fs-1">❤️</div>
            </div>
            <div className="mt-2 text-muted small">Saved to local state</div>
          </Card>
        </Col>

        <Col sm={6} xl={3}>
          <Card className="border-0 shadow-sm rounded-3 bg-white h-100 p-3">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <div className="text-muted small fw-semibold">FEATURED</div>
                <div className="h3 fw-bold text-warning mb-0">{featuredCount}</div>
              </div>
              <div className="fs-1">⭐</div>
            </div>
            <div className="mt-2 text-muted small">Spotlight collection</div>
          </Card>
        </Col>
      </Row>

      {/* Quick Actions & Guidance */}
      <Card className="border-0 shadow-sm rounded-4 mb-4">
        <Card.Body className="p-4">
          <h3 className="h5 fw-bold mb-3">Quick Navigation</h3>
          <p className="text-muted small mb-3">
            Use client-side navigation to explore the collection, review your saved bookmarks, or test deep links.
          </p>
          <div className="d-flex flex-wrap gap-2">
            <Button as={Link} to="/orchids" variant="success" className="px-3 rounded-pill fw-semibold">
              Browse All Orchids →
            </Button>
            <Button as={Link} to="/dashboard/favorites" variant="outline-danger" className="px-3 rounded-pill fw-semibold">
              Manage Favorites ({totalFavorites})
            </Button>
            <Button as={Link} to="/dashboard/profile" variant="outline-secondary" className="px-3 rounded-pill fw-semibold">
              View Student Profile
            </Button>
            <Button as={Link} to="/exercises" variant="outline-primary" className="px-3 rounded-pill fw-semibold">
              Go to Exercises
            </Button>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}
