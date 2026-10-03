import { useParams, Link } from 'react-router-dom';
import { Row, Col, Badge, Button, Card, Table, Alert } from 'react-bootstrap';
import { getOrchidById, ORCHIDS } from '../data/orchids';
import { useFavorites } from '../context/FavoritesContext';
import Breadcrumbs from '../components/Breadcrumbs';

export default function OrchidDetailPage() {
  const { id } = useParams();
  const { isFavorite, toggleFavorite } = useFavorites();

  const orchid = getOrchidById(id);

  // FR05 - Resource Not Found Handling (Distinct from Wildcard 404)
  if (!orchid) {
    return (
      <div className="py-5">
        <Breadcrumbs
          items={[
            { label: 'Orchids Collection', path: '/orchids' },
            { label: 'Not Found' }
          ]}
        />
        <Alert variant="danger" className="rounded-4 p-5 text-center border-0 shadow-sm bg-white">
          <div className="fs-1 mb-3">⚠️</div>
          <Alert.Heading as="h1" className="h3 fw-bold text-danger">
            Resource Not Found: Orchid &ldquo;{id}&rdquo;
          </Alert.Heading>
          <p className="text-muted mx-auto my-3" style={{ maxWidth: '600px' }}>
            The dynamic route pattern <code className="code-badge">/orchids/:id</code> was successfully matched by React Router,
            but no orchid with identifier <code className="code-badge">{id}</code> exists in the current dataset.
          </p>
          <div className="p-3 bg-light rounded-3 d-inline-block text-start small mb-4">
            <strong>Educational Note (FR05):</strong>
            <ul className="mb-0 ps-3 mt-1">
              <li>This is a <em>resource lookup failure</em>, not an unmapped URL path.</li>
              <li>Wildcard 404 (<code className="code-badge">*</code>) handles non-existent paths, whereas this page handles valid routes requesting missing IDs.</li>
            </ul>
          </div>
          <div>
            <Button as={Link} to="/orchids" variant="success" className="rounded-pill px-4 fw-semibold me-2">
              ← Return to Orchid List
            </Button>
            <Button as={Link} to="/" variant="outline-secondary" className="rounded-pill px-4 fw-semibold">
              Go Home
            </Button>
          </div>
        </Alert>
      </div>
    );
  }

  const favorited = isFavorite(orchid.id);
  const relatedOrchids = ORCHIDS.filter(
    (o) => o.category === orchid.category && o.id !== orchid.id
  ).slice(0, 3);

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = 'https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?auto=format&fit=crop&w=800&q=80';
  };

  return (
    <div>
      <Breadcrumbs
        items={[
          { label: 'Orchids Collection', path: '/orchids' },
          { label: orchid.name }
        ]}
      />

      <div className="mb-4">
        <Link to="/orchids" className="text-success text-decoration-none fw-semibold small">
          ← Back to All Orchids
        </Link>
      </div>

      <Row className="g-4 mb-5">
        {/* Left Column: Orchid Image & Badges */}
        <Col lg={5}>
          <div className="position-relative">
            <img
              src={orchid.image}
              alt={`Full flower view of ${orchid.name}`}
              className="detail-hero-img w-100"
              onError={handleImageError}
            />
            <div className="position-absolute top-0 start-0 m-3">
              <Badge bg="success" className="px-3 py-2 rounded-pill fs-6 shadow-sm">
                {orchid.category}
              </Badge>
            </div>
          </div>
        </Col>

        {/* Right Column: Orchid Details */}
        <Col lg={7}>
          <div className="d-flex justify-content-between align-items-start gap-3 mb-2">
            <h1 className="h2 fw-bold text-dark mb-0">{orchid.name}</h1>
            <Button
              variant={favorited ? 'danger' : 'outline-danger'}
              className="rounded-pill px-3 py-1 d-flex align-items-center gap-2 fw-semibold"
              onClick={() => toggleFavorite(orchid.id)}
            >
              <span>{favorited ? '❤️ Favorited' : '♡ Add to Favorites'}</span>
            </Button>
          </div>

          <div className="d-flex align-items-center gap-3 mb-3">
            <span className="text-warning fw-bold">★ {orchid.rating} / 5.0</span>
            <span className="text-muted">•</span>
            <Badge bg="info" text="dark" className="fw-normal">
              Care Level: {orchid.careLevel}
            </Badge>
            {orchid.featured && (
              <Badge bg="warning" text="dark" className="fw-normal">
                Featured Species
              </Badge>
            )}
          </div>

          <p className="lead text-secondary fs-6 mb-4">{orchid.description}</p>

          {/* Detailed Specifications Table */}
          <Card className="border-0 shadow-sm rounded-4 mb-4">
            <Card.Body className="p-0">
              <Table responsive className="mb-0 align-middle">
                <tbody>
                  <tr>
                    <td className="text-muted fw-semibold ps-4" style={{ width: '35%' }}>
                      Origin
                    </td>
                    <td className="pe-4">{orchid.origin}</td>
                  </tr>
                  <tr>
                    <td className="text-muted fw-semibold ps-4">Watering Schedule</td>
                    <td className="pe-4">{orchid.watering}</td>
                  </tr>
                  <tr>
                    <td className="text-muted fw-semibold ps-4">Light Requirements</td>
                    <td className="pe-4">{orchid.light}</td>
                  </tr>
                  <tr>
                    <td className="text-muted fw-semibold ps-4">Blooming Season</td>
                    <td className="pe-4">{orchid.bloomingSeason}</td>
                  </tr>
                  <tr>
                    <td className="text-muted fw-semibold ps-4">Route Parameter (:id)</td>
                    <td className="pe-4">
                      <code className="code-badge">{orchid.id}</code>
                    </td>
                  </tr>
                </tbody>
              </Table>
            </Card.Body>
          </Card>

          <div className="d-flex gap-2">
            <Button as={Link} to="/orchids" variant="outline-success" className="rounded-pill px-4 fw-semibold">
              Browse More Orchids
            </Button>
            <Button
              as={Link}
              to={`/orchids?category=${encodeURIComponent(orchid.category)}`}
              variant="outline-secondary"
              className="rounded-pill px-3 fw-semibold"
            >
              View More {orchid.category} Orchids
            </Button>
          </div>
        </Col>
      </Row>

      {/* Related Orchids in Same Category */}
      {relatedOrchids.length > 0 && (
        <section className="pt-4 border-top">
          <h2 className="h4 fw-bold text-dark mb-3">Other {orchid.category} Orchids</h2>
          <Row className="g-3">
            {relatedOrchids.map((rel) => (
              <Col key={rel.id} sm={6} md={4}>
                <Card className="border-0 shadow-sm rounded-3 h-100 p-2">
                  <div className="d-flex align-items-center gap-3">
                    <img
                      src={rel.image}
                      alt={rel.name}
                      style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 8 }}
                      onError={handleImageError}
                    />
                    <div className="overflow-hidden">
                      <h3 className="h6 fw-bold mb-1 text-truncate">{rel.name}</h3>
                      <Link to={`/orchids/${rel.id}`} className="text-success small fw-semibold text-decoration-none">
                        View Details →
                      </Link>
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </section>
      )}
    </div>
  );
}
