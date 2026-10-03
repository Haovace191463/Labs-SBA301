import { Card, Table, Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function DynamicRouteExercise() {
  const dynamicTests = [
    {
      id: 'phalaenopsis-amabilis',
      type: 'Valid Resource',
      description: 'Moon Orchid - Pristine white flower',
      expected: 'Status 200 OK view: Full orchid specifications, care guide, and photo rendered.'
    },
    {
      id: 'vanda-coerulea',
      type: 'Valid Resource',
      description: 'Blue Orchid - Rare blue tessellated flowers',
      expected: 'Status 200 OK view: Full orchid specifications and photo rendered.'
    },
    {
      id: '999999',
      type: 'Invalid Resource',
      description: 'Numeric non-existent identifier',
      expected: 'Route matches /orchids/:id, but displays "Resource Not Found: Orchid 999999" without crashing.'
    },
    {
      id: 'fake-orchid-xyz',
      type: 'Invalid Resource',
      description: 'String non-existent identifier',
      expected: 'Route matches /orchids/:id, but displays "Resource Not Found: Orchid fake-orchid-xyz".'
    }
  ];

  return (
    <div>
      <h3 className="h5 fw-bold text-dark mb-2">Exercise 04: Dynamic Route Parameters (:id)</h3>
      <p className="text-muted small">
        Understand path parameter tokens in routes and how <code className="code-badge">useParams()</code> extracts them.
      </p>

      <Alert variant="warning" className="border-0 shadow-sm rounded-3 mb-4">
        <strong>Key Architectural Distinction:</strong>
        <br />
        When a user visits <code className="code-badge">/orchids/999999</code>, the route pattern <code className="code-badge">/orchids/:id</code> matches!
        React Router successfully renders <code className="code-badge">&lt;OrchidDetailPage /&gt;</code>.
        It is the <em>component&apos;s responsibility</em> to look up the ID in data and conditionally render a friendly &ldquo;Resource Not Found&rdquo; message.
        This is completely separate from a 404 Wildcard route (<code className="code-badge">*</code>), which only fires when no route definition matches.
      </Alert>

      <Card className="border-0 shadow-sm rounded-4 mb-4 bg-white">
        <Card.Body>
          <h4 className="h6 fw-bold mb-3">Live Dynamic Route Test Suite</h4>
          <Table responsive bordered hover className="align-middle small mb-0">
            <thead className="table-light">
              <tr>
                <th>Test ID</th>
                <th>Type</th>
                <th>Target URL</th>
                <th>Action</th>
                <th>Expected Result</th>
              </tr>
            </thead>
            <tbody>
              {dynamicTests.map((t, idx) => (
                <tr key={idx}>
                  <td><code>{t.id}</code></td>
                  <td>
                    <span className={`badge ${t.type.includes('Valid') ? 'bg-success' : 'bg-danger'}`}>
                      {t.type}
                    </span>
                  </td>
                  <td><code>/orchids/{t.id}</code></td>
                  <td>
                    <Button
                      as={Link}
                      to={`/orchids/${t.id}`}
                      size="sm"
                      variant="outline-primary"
                      className="rounded-pill px-3"
                    >
                      Test Route →
                    </Button>
                  </td>
                  <td>{t.expected}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </div>
  );
}
