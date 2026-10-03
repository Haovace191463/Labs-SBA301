import { Row, Col, Alert, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useFavorites } from '../../context/FavoritesContext';
import { ORCHIDS } from '../../data/orchids';
import OrchidCard from '../../components/OrchidCard';

export default function FavoritesPage() {
  const { favorites, clearFavorites } = useFavorites();

  const favoriteOrchids = ORCHIDS.filter(orchid => favorites.includes(orchid.id));

  return (
    <div>
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-2 mb-4">
        <div>
          <h2 className="h4 fw-bold text-dark mb-1">Your Favorite Orchids</h2>
          <p className="text-muted small mb-0">
            Bookmarked species persisted in browser local storage.
          </p>
        </div>
        {favoriteOrchids.length > 0 && (
          <Button
            variant="outline-danger"
            size="sm"
            className="rounded-pill px-3"
            onClick={clearFavorites}
          >
            Clear All Favorites
          </Button>
        )}
      </div>

      {favoriteOrchids.length === 0 ? (
        <Alert variant="info" className="rounded-4 p-4 text-center border-0 shadow-sm bg-white">
          <div className="fs-1 mb-2">🌸</div>
          <Alert.Heading as="h3" className="h5 fw-bold text-dark">
            No Favorite Orchids Yet
          </Alert.Heading>
          <p className="text-muted small mb-3">
            You haven&apos;t marked any orchids as favorites. Browse our collection and click the heart icon on any card or detail page!
          </p>
          <Button as={Link} to="/orchids" variant="success" className="rounded-pill px-4 fw-semibold">
            Explore Orchids
          </Button>
        </Alert>
      ) : (
        <Row className="g-4">
          {favoriteOrchids.map(orchid => (
            <Col key={orchid.id} sm={6} xl={6}>
              <OrchidCard orchid={orchid} />
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
}
