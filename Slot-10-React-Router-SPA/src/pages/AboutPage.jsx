import { Card, Row, Col, Alert, Button } from 'react-bootstrap';
import { Link, useSearchParams } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';

export default function AboutPage() {
  const [searchParams] = useSearchParams();
  const submitted = searchParams.get('submitted') === 'true';
  const navMode = searchParams.get('navMode');

  return (
    <div>
      <Breadcrumbs items={[{ label: 'About Project' }]} />

      {/* Confirmation banner when navigated from Contact form */}
      {submitted && (
        <Alert variant="success" dismissible className="rounded-4 p-3 shadow-sm border-0 mb-4">
          <div className="d-flex align-items-center gap-2">
            <span className="fs-4">✅</span>
            <div>
              <strong>Form Submission Successful!</strong>
              <div className="small">
                You were programmatically redirected here via <code className="code-badge">useNavigate()</code>
                {navMode ? ` using mode: ${navMode}` : ''}.
              </div>
            </div>
          </div>
        </Alert>
      )}

      <div className="mb-4">
        <h1 className="h2 fw-bold text-dark mb-1">About Orchid Router SPA</h1>
        <p className="text-muted lead fs-6">
          Architectural documentation and learning objectives for SBA301 Slot 10.
        </p>
      </div>

      <Row className="g-4 mb-5">
        <Col lg={8}>
          <Card className="border-0 shadow-sm rounded-4 p-3 mb-4 bg-white">
            <Card.Body>
              <h2 className="h5 fw-bold text-dark mb-3">Project Overview &amp; Purpose</h2>
              <p className="text-muted">
                <strong>Orchid Router SPA</strong> is an educational Single Page Application developed
                as part of <em>SBA301 (Integrate Single Page Application with Spring Boot)</em>, Chapter 09: React Router
                and SPA.
              </p>
              <p className="text-muted">
                The core premise of an SPA is client-side routing. Instead of requesting a brand-new HTML
                document from a web server on every link click (as in Multi-Page Applications), React Router intercepts
                URL changes in the browser, updates the Browser History API, and dynamically swaps React components into
                the DOM without refreshing the page.
              </p>
              <p className="text-muted mb-0">
                This project provides practical, hands-on demonstrations of all fundamental React Router concepts,
                giving students clear architectural patterns to apply when integrating React frontend with Spring Boot REST backends.
              </p>
            </Card.Body>
          </Card>

          <Card className="border-0 shadow-sm rounded-4 p-3 bg-white">
            <Card.Body>
              <h2 className="h5 fw-bold text-dark mb-3">React Router Concepts Practiced</h2>
              <div className="d-flex flex-column gap-3">
                <div className="p-3 bg-light rounded-3">
                  <strong className="text-success d-block mb-1">1. Declarative Routing &amp; Hierarchy</strong>
                  <span className="text-muted small">
                    Configuring <code className="code-badge">BrowserRouter</code>, <code className="code-badge">Routes</code>, and <code className="code-badge">Route</code> with parent layouts and child views.
                  </span>
                </div>
                <div className="p-3 bg-light rounded-3">
                  <strong className="text-success d-block mb-1">2. Link vs NavLink Active Styling</strong>
                  <span className="text-muted small">
                    Using <code className="code-badge">NavLink</code> with function-based <code className="code-badge">isActive</code> state and the <code className="code-badge">end</code> prop for exact home route matching.
                  </span>
                </div>
                <div className="p-3 bg-light rounded-3">
                  <strong className="text-success d-block mb-1">3. Dynamic Path Parameters</strong>
                  <span className="text-muted small">
                    Extracting dynamic parameters like <code className="code-badge">/orchids/:id</code> using <code className="code-badge">useParams()</code> and distinguishing between missing routes and missing resources.
                  </span>
                </div>
                <div className="p-3 bg-light rounded-3">
                  <strong className="text-success d-block mb-1">4. Search Parameters (Query Strings)</strong>
                  <span className="text-muted small">
                    Synchronizing URL query strings like <code className="code-badge">?category=Phalaenopsis</code> via <code className="code-badge">useSearchParams()</code> for bookmarkable, shareable views.
                  </span>
                </div>
                <div className="p-3 bg-light rounded-3">
                  <strong className="text-success d-block mb-1">5. Programmatic Navigation &amp; History Manipulation</strong>
                  <span className="text-muted small">
                    Using <code className="code-badge">useNavigate()</code> for form submission redirects with both standard push and <code className="code-badge">replace: true</code> modes.
                  </span>
                </div>
                <div className="p-3 bg-light rounded-3">
                  <strong className="text-success d-block mb-1">6. Nested Routes with &lt;Outlet /&gt;</strong>
                  <span className="text-muted small">
                    Preserving parent dashboard chrome while swapping nested child routes (<code className="code-badge">/dashboard/favorites</code>, <code className="code-badge">/dashboard/profile</code>) seamlessly.
                  </span>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card className="border-0 shadow-sm rounded-4 p-3 bg-white mb-4">
            <Card.Body>
              <h2 className="h6 fw-bold text-dark mb-3">Academic Context</h2>
              <ul className="list-unstyled small text-muted mb-4 d-flex flex-column gap-2">
                <li><strong>Course:</strong> SBA301</li>
                <li><strong>Topic:</strong> Slot 10 (React Router SPA)</li>
                <li><strong>Student:</strong> Võ Anh Hào</li>
                <li><strong>Student ID:</strong> CE191463</li>
                <li><strong>Environment:</strong> React 19 + Vite 8</li>
                <li><strong>Router:</strong> React Router DOM v7</li>
              </ul>
              <div className="d-grid gap-2">
                <Button as={Link} to="/orchids" variant="success" className="rounded-pill fw-semibold">
                  🌿 View Orchids
                </Button>
                <Button as={Link} to="/exercises" variant="outline-primary" className="rounded-pill fw-semibold">
                  🧪 View 10 Exercises
                </Button>
                <Button as={Link} to="/contact" variant="outline-secondary" className="rounded-pill fw-semibold">
                  ✉️ Test Contact Form
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
