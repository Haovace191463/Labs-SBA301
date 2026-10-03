import { Card, Button, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useFavorites } from '../context/FavoritesContext';

export default function OrchidCard({ orchid }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorited = isFavorite(orchid.id);

  // Fallback image in case external network image fails to load
  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = 'https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?auto=format&fit=crop&w=800&q=80';
  };

  const getCareBadgeBg = (level) => {
    switch (level?.toLowerCase()) {
      case 'easy':
        return 'success';
      case 'moderate':
        return 'warning';
      case 'challenging':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  return (
    <Card className="orchid-card h-100">
      <div className="orchid-card-img-wrapper">
        <img
          src={orchid.image}
          alt={`Flower of ${orchid.name}`}
          className="orchid-card-img"
          onError={handleImageError}
          loading="lazy"
        />
        <span className="card-category-badge">{orchid.category}</span>
        
        <button
          type="button"
          className="card-fav-btn"
          onClick={() => toggleFavorite(orchid.id)}
          title={favorited ? 'Remove from favorites' : 'Add to favorites'}
          aria-label={favorited ? `Remove ${orchid.name} from favorites` : `Add ${orchid.name} to favorites`}
        >
          <span style={{ color: favorited ? '#dc3545' : '#94a3b8', fontSize: '1.2rem', lineHeight: 1 }}>
            {favorited ? '♥' : '♡'}
          </span>
        </button>
      </div>

      <Card.Body className="d-flex flex-column">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <Card.Title as="h3" className="h5 mb-0 fw-bold text-truncate" title={orchid.name}>
            {orchid.name}
          </Card.Title>
        </div>

        <div className="d-flex align-items-center gap-2 mb-2">
          <Badge bg={getCareBadgeBg(orchid.careLevel)} className="fw-normal">
            Care: {orchid.careLevel}
          </Badge>
          <span className="text-warning small">★ {orchid.rating}</span>
        </div>

        <Card.Text className="text-muted small flex-grow-1" style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {orchid.description}
        </Card.Text>

        <div className="mt-3 pt-2 border-top d-flex justify-content-between align-items-center">
          <small className="text-secondary fst-italic text-truncate me-2" style={{ maxWidth: '60%' }}>
            📍 {orchid.origin}
          </small>
          <Button
            as={Link}
            to={`/orchids/${orchid.id}`}
            variant="outline-success"
            size="sm"
            className="rounded-pill px-3 fw-semibold"
          >
            View Details →
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}
