import { Card, Table, Button } from 'react-bootstrap';
import { useLocation, Link } from 'react-router-dom';

export default function LocationExercise() {
  const location = useLocation();

  return (
    <div>
      <h3 className="h5 fw-bold text-dark mb-2">Exercise 07: Location Object &amp; useLocation</h3>
      <p className="text-muted small">
        Inspect the properties of the current URL location provided by React Router.
      </p>

      <Card className="border-0 shadow-sm rounded-4 mb-4 bg-white">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="h6 fw-bold mb-0">Current Active Location Snapshot</h4>
            <Button as={Link} to="/location-demo" variant="outline-primary" size="sm" className="rounded-pill px-3">
              Open Dedicated Live Inspector →
            </Button>
          </div>

          <Table responsive bordered hover className="align-middle small mb-4">
            <thead className="table-light">
              <tr>
                <th>Property</th>
                <th>Current Value in this View</th>
                <th>Role in Routing</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>location.pathname</code></td>
                <td><code className="code-badge">{location.pathname}</code></td>
                <td>Matches against the <code>path</code> defined in <code>&lt;Route&gt;</code>.</td>
              </tr>
              <tr>
                <td><code>location.search</code></td>
                <td><code>{location.search || '(empty)'}</code></td>
                <td>Contains query parameters (parsed via <code>useSearchParams</code>).</td>
              </tr>
              <tr>
                <td><code>location.hash</code></td>
                <td><code>{location.hash || '(empty)'}</code></td>
                <td>Browser anchor / fragment identifier.</td>
              </tr>
              <tr>
                <td><code>location.key</code></td>
                <td><code>{location.key}</code></td>
                <td>Unique string generated for each history entry.</td>
              </tr>
            </tbody>
          </Table>

          <div className="p-3 bg-light rounded-3 small">
            <strong className="text-danger">Rule for SBA301 Projects:</strong>
            <p className="mb-0 text-muted mt-1">
              Do not use <code className="code-badge">location.state</code> to pass required data (e.g. orchid details) between pages.
              If a user refreshes or opens a direct link, <code className="code-badge">location.state</code> is lost!
              Always design pages to fetch or look up their data based on the URL path (<code className="code-badge">useParams</code>)
              or query parameters (<code className="code-badge">useSearchParams</code>).
            </p>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}
