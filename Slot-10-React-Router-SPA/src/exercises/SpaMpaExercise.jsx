import { Card, Table, Alert } from 'react-bootstrap';

export default function SpaMpaExercise() {
  return (
    <div>
      <h3 className="h5 fw-bold text-dark mb-2">Exercise 01: SPA vs MPA Document Request Trace</h3>
      <p className="text-muted small">
        Compare single-page application client routing against traditional multi-page architecture.
      </p>

      <Alert variant="success" className="border-0 shadow-sm rounded-3 mb-4">
        <strong>Core Concept:</strong> In an MPA, clicking a standard <code className="code-badge">&lt;a href=&quot;...&quot;&gt;</code> makes
        the browser request an entire new HTML document from the server, causing a blank screen flash and full re-initialization of JavaScript.
        In an SPA with React Router, internal navigation updates the URL via the HTML5 History API (<code className="code-badge">pushState</code>)
        and swaps React components in memory without requesting a new HTML document.
      </Alert>

      <Card className="border-0 shadow-sm rounded-4 mb-4 bg-white">
        <Card.Body>
          <h4 className="h6 fw-bold mb-3">Navigation Architecture Comparison Matrix</h4>
          <Table responsive bordered hover className="align-middle small mb-0">
            <thead className="table-light">
              <tr>
                <th>Criterion</th>
                <th>Single Page Application (SPA)</th>
                <th>Multi Page Application (MPA)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Navigation Mechanism</strong></td>
                <td>Client-side JavaScript (<code className="code-badge">Link</code>, <code className="code-badge">NavLink</code>)</td>
                <td>Server-side roundtrip via browser HTTP GET</td>
              </tr>
              <tr>
                <td><strong>HTML Document Reload</strong></td>
                <td><span className="badge bg-success">NO document reload</span></td>
                <td><span className="badge bg-danger">YES full document reload</span></td>
              </tr>
              <tr>
                <td><strong>State Persistence</strong></td>
                <td>In-memory React state (e.g. context, forms) is maintained across views</td>
                <td>All memory state is destroyed and re-initialized on every page</td>
              </tr>
              <tr>
                <td><strong>Network Tab Observation</strong></td>
                <td>Zero Document requests (<code className="code-badge">Doc</code> filter is empty). Only async JSON / assets if fetched.</td>
                <td>A new <code className="code-badge">Type: document</code> HTTP request appears on every navigation.</td>
              </tr>
              <tr>
                <td><strong>Rendering Speed</strong></td>
                <td>Near instantaneous DOM updates; smooth transitions</td>
                <td>Browser white screen flash during HTML parsing &amp; stylesheet re-evaluations</td>
              </tr>
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <Card className="border-0 shadow-sm rounded-4 bg-white p-3">
        <Card.Body>
          <h4 className="h6 fw-bold mb-2">Hands-on Verification Instructions (DevTools Network):</h4>
          <ol className="small text-muted mb-0 ps-3">
            <li className="mb-2">
              Open Chrome / Edge Developer Tools (<kbd>F12</kbd> or <kbd>Ctrl+Shift+I</kbd>) and select the <strong>Network</strong> tab.
            </li>
            <li className="mb-2">
              Check the <strong>Doc</strong> filter button in the Network toolbar and check <strong>Preserve log</strong>.
            </li>
            <li className="mb-2">
              Click the top navigation links: <em>Home</em> → <em>Orchids</em> → <em>About</em> → <em>Dashboard</em>.
            </li>
            <li className="mb-2">
              <strong>Observation:</strong> Verify that NO new HTML document requests appear in the list. The URL changes, the view updates, but the initial HTML document remains intact!
            </li>
          </ol>
        </Card.Body>
      </Card>
    </div>
  );
}
