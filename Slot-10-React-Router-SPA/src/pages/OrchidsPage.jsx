import { useSearchParams } from 'react-router-dom';
import { Row, Col, Alert, Button } from 'react-bootstrap';
import { ORCHIDS } from '../data/orchids';
import OrchidCard from '../components/OrchidCard';
import CategoryFilter from '../components/CategoryFilter';
import Breadcrumbs from '../components/Breadcrumbs';

export default function OrchidsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentCategory = searchParams.get('category') || 'All';

  // Filter orchids according to query string param
  const filteredOrchids = currentCategory.toLowerCase() === 'all'
    ? ORCHIDS
    : ORCHIDS.filter(
        (o) => o.category.toLowerCase() === currentCategory.toLowerCase()
      );

  const handleResetFilter = () => {
    setSearchParams({});
  };

  return (
    <div>
      <Breadcrumbs items={[{ label: 'Orchids Collection' }]} />

      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4 pb-2 border-bottom">
        <div>
          <h1 className="h2 fw-bold text-dark mb-1">Orchid Flora Collection</h1>
          <p className="text-muted mb-0">
            Browse our curated botanical collection. Filter categories via query parameters.
          </p>
        </div>
        <div className="bg-light px-3 py-2 rounded-3 border small text-muted">
          Active URL Query:{' '}
          <code className="code-badge">
            {searchParams.toString() ? `?${searchParams.toString()}` : '(none)'}
          </code>
        </div>
      </div>

      {/* Category Filter Component (FR03) */}
      <CategoryFilter
        currentCategory={currentCategory}
        totalCount={ORCHIDS.length}
        filteredCount={filteredOrchids.length}
      />

      {/* Empty State for Invalid / Zero Result Categories */}
      {filteredOrchids.length === 0 ? (
        <Alert variant="warning" className="rounded-4 p-4 text-center border-0 shadow-sm bg-white my-4">
          <div className="fs-1 mb-2">🔍</div>
          <Alert.Heading as="h3" className="h5 fw-bold text-dark">
            No Orchids Found for Category &ldquo;{currentCategory}&rdquo;
          </Alert.Heading>
          <p className="text-muted small mb-3">
            The category requested in query string <code className="code-badge">?category={currentCategory}</code> does
            not match any known species in our database.
          </p>
          <Button variant="success" className="rounded-pill px-4 fw-semibold" onClick={handleResetFilter}>
            Reset Filter to All
          </Button>
        </Alert>
      ) : (
        <Row className="g-4">
          {filteredOrchids.map((orchid) => (
            <Col key={orchid.id} sm={6} lg={4}>
              <OrchidCard orchid={orchid} />
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
}
