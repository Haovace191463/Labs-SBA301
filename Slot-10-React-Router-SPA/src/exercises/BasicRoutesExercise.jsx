import { Card, Table, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function BasicRoutesExercise() {
  const routes = [
    { path: '/', label: 'Home Page', expected: 'Renders HomePage with Hero Banner and Featured Orchids' },
    { path: '/orchids', label: 'Orchids Page', expected: 'Renders OrchidsPage with cards and category filter' },
    { path: '/about', label: 'About Page', expected: 'Renders AboutPage with project architecture and goals' },
    { path: '/contact', label: 'Contact Page', expected: 'Renders ContactPage with interactive validation form' },
    { path: '/home', label: 'Redirect Route (/home)', expected: 'Redirects automatically to / via <Navigate to="/" replace />' },
    { path: '/some-random-unknown-url', label: 'Wildcard Route (*)', expected: 'Catches unmatched URL and renders NotFoundPage' },
  ];

  return (
    <div>
      <h3 className="h5 fw-bold text-dark mb-2">Exercise 02: Basic Route Mapping &amp; Configuration</h3>
      <p className="text-muted small">
        Understand how <code className="code-badge">BrowserRouter</code>, <code className="code-badge">Routes</code>, and <code className="code-badge">Route</code> collaborate to match URLs.
      </p>

      <Card className="border-0 shadow-sm rounded-4 mb-4 bg-white">
        <Card.Body>
          <h4 className="h6 fw-bold mb-3">Live Route Verification Table</h4>
          <Table responsive bordered hover className="align-middle small mb-0">
            <thead className="table-light">
              <tr>
                <th>Target Route</th>
                <th>Test Action</th>
                <th>Expected Outcome</th>
              </tr>
            </thead>
            <tbody>
              {routes.map((r, idx) => (
                <tr key={idx}>
                  <td><code className="code-badge">{r.path}</code></td>
                  <td>
                    <Button as={Link} to={r.path} size="sm" variant="outline-success" className="rounded-pill px-3">
                      Test {r.label} →
                    </Button>
                  </td>
                  <td>{r.expected}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <Card className="border-0 shadow-sm rounded-4 bg-white p-3">
        <Card.Body>
          <h4 className="h6 fw-bold mb-2">Code Pattern Reference:</h4>
          <pre className="bg-light p-3 rounded-3 small text-dark mb-0">
{`// src/routes/AppRoutes.jsx
<BrowserRouter>
  <Routes>
    <Route path="/" element={<MainLayout />}>
      <Route index element={<HomePage />} />
      <Route path="orchids" element={<OrchidsPage />} />
      <Route path="about" element={<AboutPage />} />
      <Route path="contact" element={<ContactPage />} />
      <Route path="home" element={<Navigate to="/" replace />} />
      <Route path="*" element={<NotFoundPage />} />
    </Route>
  </Routes>
</BrowserRouter>`}
          </pre>
        </Card.Body>
      </Card>
    </div>
  );
}
