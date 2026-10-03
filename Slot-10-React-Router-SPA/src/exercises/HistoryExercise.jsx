import { Card, Table, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export default function HistoryExercise() {
  const navigate = useNavigate();

  return (
    <div>
      <h3 className="h5 fw-bold text-dark mb-2">Exercise 09: Browser History Stack (Back / Forward)</h3>
      <p className="text-muted small">
        Understand how React Router manipulates the HTML5 History API without causing document reloads.
      </p>

      <Alert variant="info" className="border-0 shadow-sm rounded-3 mb-4">
        <strong>Browser Security Note:</strong> For user privacy and security reasons, modern web browsers
        do NOT allow JavaScript to read the actual list of URLs in the history stack (<code className="code-badge">window.history</code>).
        Web applications can only inspect <code className="code-badge">window.history.length</code> and dispatch
        <code className="code-badge">back()</code>, <code className="code-badge">forward()</code>, or <code className="code-badge">go(n)</code>.
      </Alert>

      <Card className="border-0 shadow-sm rounded-4 mb-4 bg-white">
        <Card.Body>
          <h4 className="h6 fw-bold mb-3">Recommended Step-by-Step History Trace</h4>
          <Table responsive bordered hover className="align-middle small mb-4">
            <thead className="table-light">
              <tr>
                <th>Step</th>
                <th>Action to Perform</th>
                <th>Expected URL</th>
                <th>Expected History Stack State</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>Navigate to Home (<code>/</code>)</td>
                <td><code>/</code></td>
                <td>Entry added [ / ]</td>
              </tr>
              <tr>
                <td>2</td>
                <td>Click Orchids menu link</td>
                <td><code>/orchids</code></td>
                <td>Entry pushed [ /, /orchids ]</td>
              </tr>
              <tr>
                <td>3</td>
                <td>Click Moon Orchid card</td>
                <td><code>/orchids/phalaenopsis-amabilis</code></td>
                <td>Entry pushed [ /, /orchids, /orchids/phalaenopsis-amabilis ]</td>
              </tr>
              <tr>
                <td>4</td>
                <td>Click browser <strong>Back</strong> button or button below</td>
                <td><code>/orchids</code></td>
                <td>Pointer moves backward; orchids list reappears without network reload!</td>
              </tr>
              <tr>
                <td>5</td>
                <td>Click browser <strong>Forward</strong> button or button below</td>
                <td><code>/orchids/phalaenopsis-amabilis</code></td>
                <td>Pointer moves forward; detail view restores without network reload!</td>
              </tr>
            </tbody>
          </Table>

          <h5 className="h6 fw-bold mb-2">Interactive Navigation Buttons:</h5>
          <div className="d-flex gap-2">
            <Button variant="outline-primary" size="sm" className="rounded-pill px-3" onClick={() => navigate(-1)}>
              ← Trigger navigate(-1) [Back]
            </Button>
            <Button variant="outline-primary" size="sm" className="rounded-pill px-3" onClick={() => navigate(1)}>
              → Trigger navigate(1) [Forward]
            </Button>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}
