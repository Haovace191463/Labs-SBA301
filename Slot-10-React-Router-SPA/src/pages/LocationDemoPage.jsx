import { useLocation, useNavigate } from 'react-router-dom';
import { Card, Table, Button, Row, Col, Alert } from 'react-bootstrap';
import Breadcrumbs from '../components/Breadcrumbs';

export default function LocationDemoPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleAddQuery = () => {
    navigate('/location-demo?species=amabilis&sort=asc&view=grid', {
      state: { from: 'button-click', timestamp: new Date().toISOString() }
    });
  };

  const handleAddHash = () => {
    navigate('/location-demo#care-instructions', {
      state: { from: 'hash-setter', note: 'Hash navigation preserves current view' }
    });
  };

  const handleClearParams = () => {
    navigate('/location-demo', { state: null });
  };

  return (
    <div>
      <Breadcrumbs items={[{ label: 'Location Inspector Demo' }]} />

      <div className="mb-4">
        <h1 className="h2 fw-bold text-dark mb-1">
          📍 React Router Location Inspector
        </h1>
        <p className="text-muted">
          Real-time inspection of the <code className="code-badge">useLocation()</code> hook object.
        </p>
      </div>

      <Row className="g-4 mb-4">
        <Col lg={8}>
          <Card className="border-0 shadow-sm rounded-4 bg-white p-3">
            <Card.Body>
              <h2 className="h5 fw-bold text-dark mb-3">Current Location Object Properties</h2>
              <Table responsive bordered hover className="align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th style={{ width: '25%' }}>Property</th>
                    <th style={{ width: '45%' }}>Current Value</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><code className="fw-bold text-primary">pathname</code></td>
                    <td><code className="code-badge">{location.pathname}</code></td>
                    <td className="small text-muted">The path of the URL (e.g. <code>/location-demo</code>)</td>
                  </tr>
                  <tr>
                    <td><code className="fw-bold text-primary">search</code></td>
                    <td>
                      {location.search ? (
                        <code className="code-badge">{location.search}</code>
                      ) : (
                        <span className="text-muted fst-italic">&quot;&quot; (empty)</span>
                      )}
                    </td>
                    <td className="small text-muted">Query string beginning with <code>?</code></td>
                  </tr>
                  <tr>
                    <td><code className="fw-bold text-primary">hash</code></td>
                    <td>
                      {location.hash ? (
                        <code className="code-badge">{location.hash}</code>
                      ) : (
                        <span className="text-muted fst-italic">&quot;&quot; (empty)</span>
                      )}
                    </td>
                    <td className="small text-muted">URL fragment beginning with <code>#</code></td>
                  </tr>
                  <tr>
                    <td><code className="fw-bold text-primary">state</code></td>
                    <td>
                      <pre className="bg-light p-2 rounded mb-0 small text-break" style={{ maxHeight: '100px' }}>
                        {JSON.stringify(location.state, null, 2) || 'null'}
                      </pre>
                    </td>
                    <td className="small text-muted">
                      In-memory state passed via <code>navigate(path, &#123; state &#125;)</code>
                    </td>
                  </tr>
                  <tr>
                    <td><code className="fw-bold text-primary">key</code></td>
                    <td><code className="code-badge">{location.key}</code></td>
                    <td className="small text-muted">Unique key string assigned by history stack</td>
                  </tr>
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card className="border-0 shadow-sm rounded-4 bg-white p-3 h-100">
            <Card.Body>
              <h2 className="h6 fw-bold text-dark mb-3">Interactive Location Triggers</h2>
              <p className="text-muted small mb-3">
                Click the actions below to mutate properties on the location object and observe the table update:
              </p>
              <div className="d-grid gap-2">
                <Button variant="outline-success" size="sm" onClick={handleAddQuery}>
                  1. Set Query String (?species=...)
                </Button>
                <Button variant="outline-primary" size="sm" onClick={handleAddHash}>
                  2. Set Fragment Hash (#care-instructions)
                </Button>
                <Button variant="outline-secondary" size="sm" onClick={handleClearParams}>
                  3. Reset URL to Clean Path
                </Button>
              </div>

              <Alert variant="warning" className="small mt-4 mb-0 border-0">
                <strong>Critical Rule:</strong> Do not rely on <code className="code-badge">location.state</code> for
                required data on any page! If a user bookmarks or refreshes the page in a new window,
                <code className="code-badge">location.state</code> will be <code className="code-badge">null</code>.
              </Alert>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
