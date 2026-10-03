import { useLocation, Link } from 'react-router-dom';
import { Card, Button } from 'react-bootstrap';

export default function NotFoundPage() {
  const location = useLocation();

  return (
    <div className="py-5 text-center">
      <Card className="border-0 shadow-sm rounded-4 p-4 mx-auto bg-white" style={{ maxWidth: '640px' }}>
        <Card.Body className="py-4">
          <div className="display-1 text-danger fw-bold mb-3">404</div>
          <h1 className="h3 fw-bold text-dark mb-2">Page Not Found</h1>
          <p className="text-muted mb-3">
            The requested URL <code className="code-badge">{location.pathname}</code> does not match
            any declared route in this application.
          </p>

          <div className="p-3 bg-light rounded-3 text-start small mb-4">
            <strong className="text-secondary d-block mb-1">Routing Architecture Context:</strong>
            <p className="mb-1">
              This page was caught by the wildcard route: <code className="code-badge">&lt;Route path=&quot;*&quot; element=&quot;&lt;NotFoundPage /&gt;&quot; /&gt;</code>.
            </p>
            <p className="mb-0 text-muted">
              Note: This is distinct from an invalid orchid ID on a valid route (e.g., <code className="code-badge">/orchids/999999</code>),
              which renders the orchid detail view with a resource-not-found message.
            </p>
          </div>

          <div className="d-flex justify-content-center gap-3">
            <Button as={Link} to="/" variant="success" className="rounded-pill px-4 fw-semibold">
              ← Return Home
            </Button>
            <Button as={Link} to="/orchids" variant="outline-secondary" className="rounded-pill px-4 fw-semibold">
              Browse Orchids
            </Button>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}
