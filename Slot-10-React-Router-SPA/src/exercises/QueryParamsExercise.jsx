import { Card, Table, Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function QueryParamsExercise() {
  const queryCases = [
    {
      query: '',
      label: 'All Orchids (Empty Query)',
      url: '/orchids',
      expected: 'Displays all 10 orchid species across all genera.'
    },
    {
      query: 'Phalaenopsis',
      label: 'Phalaenopsis Filter',
      url: '/orchids?category=Phalaenopsis',
      expected: 'Filters collection to show only Phalaenopsis orchids (3 results).'
    },
    {
      query: 'Cattleya',
      label: 'Cattleya Filter',
      url: '/orchids?category=Cattleya',
      expected: 'Filters collection to show only Cattleya orchids (3 results).'
    },
    {
      query: 'NonExistentGenus',
      label: 'Invalid / Empty Filter',
      url: '/orchids?category=NonExistentGenus',
      expected: 'Renders empty state alert with "No Orchids Found for Category" without crash.'
    }
  ];

  return (
    <div>
      <h3 className="h5 fw-bold text-dark mb-2">Exercise 05: Query Parameters &amp; useSearchParams</h3>
      <p className="text-muted small">
        Learn how URL query parameters synchronize state across browser reloads, bookmarking, and link sharing.
      </p>

      <Alert variant="info" className="border-0 shadow-sm rounded-3 mb-4">
        <strong>Why Query Parameters Matter:</strong>
        <br />
        If you store filter selections only inside local component state (<code className="code-badge">useState</code>),
        the moment the user reloads the browser, presses Back, or shares the URL with a classmate, the filter state is lost.
        By synchronizing filter state into the URL query string (<code className="code-badge">?category=...</code>),
        every view is shareable, reloadable, and bookmarkable.
      </Alert>

      <Card className="border-0 shadow-sm rounded-4 mb-4 bg-white">
        <Card.Body>
          <h4 className="h6 fw-bold mb-3">Query String Verification Scenarios</h4>
          <Table responsive bordered hover className="align-middle small mb-0">
            <thead className="table-light">
              <tr>
                <th>Scenario</th>
                <th>Target Query URL</th>
                <th>Action</th>
                <th>Expected Outcome</th>
              </tr>
            </thead>
            <tbody>
              {queryCases.map((qc, idx) => (
                <tr key={idx}>
                  <td><strong>{qc.label}</strong></td>
                  <td><code>{qc.url}</code></td>
                  <td>
                    <Button
                      as={Link}
                      to={qc.url}
                      size="sm"
                      variant="outline-success"
                      className="rounded-pill px-3"
                    >
                      Test Query →
                    </Button>
                  </td>
                  <td>{qc.expected}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </div>
  );
}
