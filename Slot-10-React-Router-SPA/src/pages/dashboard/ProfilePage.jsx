import { Card, Row, Col, Alert, Badge } from 'react-bootstrap';

export default function ProfilePage() {
  return (
    <div>
      <div className="mb-4">
        <h2 className="h4 fw-bold text-dark mb-1">Student Profile (Demo)</h2>
        <p className="text-muted small">
          Demonstrating route parameters, nested routes, and state representation in React Router.
        </p>
      </div>

      <Alert variant="warning" className="border-0 shadow-sm rounded-3 mb-4">
        <strong>Note:</strong> This profile displays mock educational data for SBA301 Slot 10. No actual backend authentication or server-side session is implemented in this SPA module.
      </Alert>

      <Row className="g-4">
        <Col md={12}>
          <Card className="border-0 shadow-sm rounded-4 p-3 bg-white">
            <Card.Body>
              <div className="d-flex align-items-center gap-3 mb-4">
                <div
                  className="rounded-circle bg-success text-white d-flex align-items-center justify-content-center fw-bold fs-3"
                  style={{ width: 64, height: 64 }}
                >
                  VH
                </div>
                <div>
                  <h3 className="h5 fw-bold mb-0">Võ Anh Hào</h3>
                  <div className="text-muted small">Student ID: CE191463</div>
                  <Badge bg="success" className="mt-1">Active SBA301 Student</Badge>
                </div>
              </div>

              <Row className="g-3">
                <Col sm={6}>
                  <div className="p-3 bg-light rounded-3">
                    <span className="text-muted small d-block">Course</span>
                    <strong>SBA301 – Single Page App with Spring Boot</strong>
                  </div>
                </Col>
                <Col sm={6}>
                  <div className="p-3 bg-light rounded-3">
                    <span className="text-muted small d-block">Lab / Assignment</span>
                    <strong>Slot 10 – React Router &amp; SPA Architecture</strong>
                  </div>
                </Col>
                <Col sm={6}>
                  <div className="p-3 bg-light rounded-3">
                    <span className="text-muted small d-block">Frontend Framework</span>
                    <strong>React 19 + Vite 8 + React Router DOM v7</strong>
                  </div>
                </Col>
                <Col sm={6}>
                  <div className="p-3 bg-light rounded-3">
                    <span className="text-muted small d-block">UI Components</span>
                    <strong>React-Bootstrap 2.10 + Bootstrap 5.3</strong>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
