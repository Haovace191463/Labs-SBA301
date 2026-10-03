import { Card, Table, Button } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';

export default function NavigateExercise() {
  const navigate = useNavigate();

  return (
    <div>
      <h3 className="h5 fw-bold text-dark mb-2">Exercise 06: Programmatic Navigation (useNavigate)</h3>
      <p className="text-muted small">
        Understand how to trigger route changes conditionally inside event handlers, form submits, and asynchronous callbacks.
      </p>

      <Card className="border-0 shadow-sm rounded-4 mb-4 bg-white">
        <Card.Body>
          <h4 className="h6 fw-bold mb-3">Push vs Replace History Operations</h4>
          <Table responsive bordered hover className="align-middle small mb-4">
            <thead className="table-light">
              <tr>
                <th>Method Syntax</th>
                <th>Underlying Browser API</th>
                <th>History Stack Effect</th>
                <th>Back Button Behavior</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>navigate(&apos;/orchids&apos;)</code></td>
                <td><code>history.pushState()</code></td>
                <td>Pushes a new entry onto the top of the stack.</td>
                <td>Pressing Back returns to the previous page.</td>
              </tr>
              <tr>
                <td><code>navigate(&apos;/orchids&apos;, &#123; replace: true &#125;)</code></td>
                <td><code>history.replaceState()</code></td>
                <td>Overwrites the current history entry in place.</td>
                <td>Pressing Back skips the replaced entry completely!</td>
              </tr>
              <tr>
                <td><code>navigate(-1)</code></td>
                <td><code>history.back()</code></td>
                <td>Moves one entry backward in the stack.</td>
                <td>Equivalent to clicking browser Back button.</td>
              </tr>
            </tbody>
          </Table>

          <h5 className="h6 fw-bold mb-2">Interactive Navigation Triggers:</h5>
          <div className="d-flex flex-wrap gap-2 mb-3">
            <Button
              variant="success"
              size="sm"
              className="rounded-pill px-3"
              onClick={() => navigate('/orchids')}
            >
              Test navigate(&apos;/orchids&apos;) [Push]
            </Button>
            <Button
              variant="outline-danger"
              size="sm"
              className="rounded-pill px-3"
              onClick={() => navigate('/dashboard', { replace: true })}
            >
              Test navigate(&apos;/dashboard&apos;, &#123; replace: true &#125;)
            </Button>
            <Button
              variant="outline-secondary"
              size="sm"
              className="rounded-pill px-3"
              onClick={() => navigate(-1)}
            >
              Test navigate(-1) [Back]
            </Button>
          </div>

          <div className="p-3 bg-light rounded-3 small">
            💡 <strong>Full Form Example:</strong> Try the Contact Page form at{' '}
            <Link to="/contact" className="fw-semibold text-success">
              /contact
            </Link>{' '}
            which validates inputs before calling <code className="code-badge">useNavigate()</code>.
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}
