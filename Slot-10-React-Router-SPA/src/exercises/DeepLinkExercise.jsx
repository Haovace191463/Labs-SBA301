import { Card, Table, Alert } from 'react-bootstrap';

export default function DeepLinkExercise() {
  const deepLinks = [
    {
      title: 'Direct Orchid Detail',
      url: '/orchids/phalaenopsis-amabilis',
      verification: 'Copy and paste into a new browser tab. The detail view of Moon Orchid must render immediately.'
    },
    {
      title: 'Direct Filtered Query',
      url: '/orchids?category=Vanda',
      verification: 'Copy and paste into a new tab. The Vanda category must be active and show only Vanda orchids.'
    },
    {
      title: 'Direct Nested Dashboard Route',
      url: '/dashboard/favorites',
      verification: 'Copy and paste into a new tab. The DashboardLayout must render with the Favorites subpage.'
    }
  ];

  return (
    <div>
      <h3 className="h5 fw-bold text-dark mb-2">Exercise 10: Direct URLs &amp; Deep Linking</h3>
      <p className="text-muted small">
        Understand how single-page applications handle initial entry points and why production server fallbacks are required.
      </p>

      <Alert variant="warning" className="border-0 shadow-sm rounded-3 mb-4">
        <strong>The Deep Link Deployment Dilemma:</strong>
        <br />
        In local development, the <strong>Vite development server</strong> automatically intercepts all unmatched file requests
        and falls back to serving <code className="code-badge">index.html</code>.
        However, on a standard production web server (Nginx, Apache, or AWS S3), requesting <code className="code-badge">/orchids/phalaenopsis-amabilis</code>
        will cause a <strong>404 Not Found</strong> because no physical file exists at that folder path on disk!
        <br /><br />
        <strong>Production Solution:</strong> The web server must be configured with an SPA rewrite rule directing all non-file requests back to <code className="code-badge">/index.html</code>.
      </Alert>

      <Card className="border-0 shadow-sm rounded-4 mb-4 bg-white">
        <Card.Body>
          <h4 className="h6 fw-bold mb-3">Deep Linking Test Matrix</h4>
          <Table responsive bordered hover className="align-middle small mb-4">
            <thead className="table-light">
              <tr>
                <th>Test Case</th>
                <th>Relative Path to Paste</th>
                <th>Testing Procedure &amp; Expected Result</th>
              </tr>
            </thead>
            <tbody>
              {deepLinks.map((dl, idx) => (
                <tr key={idx}>
                  <td><strong>{dl.title}</strong></td>
                  <td><code>{dl.url}</code></td>
                  <td>{dl.verification}</td>
                </tr>
              ))}
            </tbody>
          </Table>

          <h5 className="h6 fw-bold mb-2">Production Nginx Rewrite Example:</h5>
          <pre className="bg-light p-3 rounded-3 small text-dark mb-0">
{`# Nginx SPA Fallback configuration
location / {
    try_files $uri $uri/ /index.html;
}`}
          </pre>
        </Card.Body>
      </Card>
    </div>
  );
}
