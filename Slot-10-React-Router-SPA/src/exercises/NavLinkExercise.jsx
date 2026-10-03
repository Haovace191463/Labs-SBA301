import { Card, Alert, Row, Col } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

export default function NavLinkExercise() {
  return (
    <div>
      <h3 className="h5 fw-bold text-dark mb-2">Exercise 03: NavLink &amp; Active State Styling</h3>
      <p className="text-muted small">
        Learn how <code className="code-badge">&lt;NavLink&gt;</code> identifies the currently matching route and applies CSS classes.
      </p>

      <Alert variant="info" className="border-0 shadow-sm rounded-3 mb-4">
        <strong>The &ldquo;end&rdquo; Prop Requirement:</strong> In React Router, route matching matches prefixes by default.
        Because <code className="code-badge">/</code> is the prefix of every path (e.g. <code className="code-badge">/orchids</code>, <code className="code-badge">/about</code>),
        a <code className="code-badge">&lt;NavLink to=&quot;/&quot;&gt;</code> would remain active everywhere!
        Adding the <code className="code-badge">end</code> prop enforces that the route only matches when the URL is strictly equal to <code className="code-badge">/</code>.
      </Alert>

      <Row className="g-4 mb-4">
        <Col md={6}>
          <Card className="border-0 shadow-sm rounded-4 bg-white p-3 h-100">
            <Card.Body>
              <h4 className="h6 fw-bold mb-3">Live Interactive NavLink Sandbox</h4>
              <p className="small text-muted mb-3">
                Click between the sample links below to see how the active class dynamically shifts:
              </p>

              <div className="d-flex flex-column gap-2 mb-3">
                <NavLink
                  to="/"
                  end
                  className={({ isActive }) =>
                    `p-2 rounded text-decoration-none border ${isActive ? 'bg-success text-white fw-bold' : 'bg-light text-dark'}`
                  }
                >
                  {({ isActive }) => (
                    <div className="d-flex justify-content-between align-items-center">
                      <span>Home (with end prop)</span>
                      <span className="badge bg-secondary">{isActive ? 'ACTIVE' : 'INACTIVE'}</span>
                    </div>
                  )}
                </NavLink>

                <NavLink
                  to="/orchids"
                  className={({ isActive }) =>
                    `p-2 rounded text-decoration-none border ${isActive ? 'bg-success text-white fw-bold' : 'bg-light text-dark'}`
                  }
                >
                  {({ isActive }) => (
                    <div className="d-flex justify-content-between align-items-center">
                      <span>Orchids Collection</span>
                      <span className="badge bg-secondary">{isActive ? 'ACTIVE' : 'INACTIVE'}</span>
                    </div>
                  )}
                </NavLink>

                <NavLink
                  to="/exercises"
                  className={({ isActive }) =>
                    `p-2 rounded text-decoration-none border ${isActive ? 'bg-success text-white fw-bold' : 'bg-light text-dark'}`
                  }
                >
                  {({ isActive }) => (
                    <div className="d-flex justify-content-between align-items-center">
                      <span>Exercises Hub (Current View)</span>
                      <span className="badge bg-secondary">{isActive ? 'ACTIVE' : 'INACTIVE'}</span>
                    </div>
                  )}
                </NavLink>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="border-0 shadow-sm rounded-4 bg-white p-3 h-100">
            <Card.Body>
              <h4 className="h6 fw-bold mb-3">Code Syntax Reference</h4>
              <p className="small text-muted">Function-as-className syntax supported in React Router:</p>
              <pre className="bg-light p-3 rounded-3 small text-dark mb-0">
{`<NavLink
  to="/"
  end
  className={({ isActive }) =>
    isActive ? 'nav-link active-nav' : 'nav-link'
  }
>
  Home
</NavLink>`}
              </pre>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
