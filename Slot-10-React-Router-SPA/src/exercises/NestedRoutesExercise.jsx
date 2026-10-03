import { Card, Table, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function NestedRoutesExercise() {
  const childRoutes = [
    {
      path: '/dashboard',
      type: 'Index Route',
      component: 'DashboardHomePage',
      description: 'Rendered when the exact parent path /dashboard is requested.'
    },
    {
      path: '/dashboard/favorites',
      type: 'Child Route',
      component: 'FavoritesPage',
      description: 'Rendered inside DashboardLayout <Outlet /> for saved favorites.'
    },
    {
      path: '/dashboard/profile',
      type: 'Child Route',
      component: 'ProfilePage',
      description: 'Rendered inside DashboardLayout <Outlet /> for student info.'
    }
  ];

  return (
    <div>
      <h3 className="h5 fw-bold text-dark mb-2">Exercise 08: Nested Routes &amp; Outlet Architecture</h3>
      <p className="text-muted small">
        Learn how React Router organizes master-detail and multi-level layout structures using <code className="code-badge">&lt;Outlet /&gt;</code>.
      </p>

      <Card className="border-0 shadow-sm rounded-4 mb-4 bg-white">
        <Card.Body>
          <h4 className="h6 fw-bold mb-3">Nested Route Hierarchy in This Project</h4>
          <Table responsive bordered hover className="align-middle small mb-4">
            <thead className="table-light">
              <tr>
                <th>URL Pattern</th>
                <th>Route Role</th>
                <th>Rendered Child Component</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {childRoutes.map((cr, idx) => (
                <tr key={idx}>
                  <td><code>{cr.path}</code></td>
                  <td><span className="badge bg-secondary">{cr.type}</span></td>
                  <td><code>{cr.component}</code></td>
                  <td>
                    <Button as={Link} to={cr.path} size="sm" variant="outline-success" className="rounded-pill px-3">
                      Visit View →
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          <h5 className="h6 fw-bold mb-2">Code Configuration Pattern:</h5>
          <pre className="bg-light p-3 rounded-3 small text-dark mb-0">
{`// src/routes/AppRoutes.jsx
<Route path="dashboard" element={<DashboardLayout />}>
  <Route index element={<DashboardHomePage />} />
  <Route path="favorites" element={<FavoritesPage />} />
  <Route path="profile" element={<ProfilePage />} />
</Route>`}
          </pre>
        </Card.Body>
      </Card>
    </div>
  );
}
