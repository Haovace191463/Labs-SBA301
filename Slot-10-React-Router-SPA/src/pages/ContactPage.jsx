import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import Breadcrumbs from '../components/Breadcrumbs';

export default function ContactPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [navigationMode, setNavigationMode] = useState('push'); // 'push' or 'replace'
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Please enter your full name.';
    if (!formData.email.trim()) {
      errs.email = 'Please enter your email address.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = 'Please enter a valid email format (e.g. name@example.com).';
    }
    if (!formData.subject.trim()) errs.subject = 'Please enter a subject.';
    if (!formData.message.trim() || formData.message.trim().length < 10) {
      errs.message = 'Message must be at least 10 characters long.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    // Simulate programmatic client-side navigation using useNavigate
    // Demonstrating standard push vs replace: true (FR06)
    if (navigationMode === 'replace') {
      navigate('/about?submitted=true&navMode=replace', { replace: true });
    } else {
      navigate('/about?submitted=true&navMode=push');
    }
  };

  return (
    <div>
      <Breadcrumbs items={[{ label: 'Contact Us' }]} />

      <div className="mb-4">
        <h1 className="h2 fw-bold text-dark mb-1">Contact Botanical Support</h1>
        <p className="text-muted">
          Practice programmatic navigation with <code className="code-badge">useNavigate()</code> and explore History API modes.
        </p>
      </div>

      <Row className="g-4">
        <Col lg={7}>
          <Card className="border-0 shadow-sm rounded-4 p-3 bg-white">
            <Card.Body>
              <h2 className="h5 fw-bold text-dark mb-3">Send a Message (Demo Form)</h2>

              <Alert variant="info" className="small border-0 shadow-sm rounded-3 mb-4">
                <strong>Simulated Submission:</strong> This form does not send HTTP requests to an external server. Upon validation,
                it uses React Router&apos;s <code className="code-badge">useNavigate()</code> hook to transition to the About page.
              </Alert>

              <Form onSubmit={handleSubmit} noValidate>
                <Form.Group className="mb-3" controlId="contactName">
                  <Form.Label className="fw-semibold small">Full Name *</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    isInvalid={!!errors.name}
                    placeholder="e.g. Võ Anh Hào"
                  />
                  <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3" controlId="contactEmail">
                  <Form.Label className="fw-semibold small">Email Address *</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    isInvalid={!!errors.email}
                    placeholder="e.g. hao@example.com"
                  />
                  <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3" controlId="contactSubject">
                  <Form.Label className="fw-semibold small">Subject *</Form.Label>
                  <Form.Control
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    isInvalid={!!errors.subject}
                    placeholder="e.g. Question regarding Phalaenopsis watering"
                  />
                  <Form.Control.Feedback type="invalid">{errors.subject}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-4" controlId="contactMessage">
                  <Form.Label className="fw-semibold small">Message *</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    isInvalid={!!errors.message}
                    placeholder="Describe your inquiry or notes here..."
                  />
                  <Form.Control.Feedback type="invalid">{errors.message}</Form.Control.Feedback>
                </Form.Group>

                {/* History Mode Experiment Selector */}
                <div className="p-3 bg-light rounded-3 mb-4 border">
                  <Form.Label className="fw-bold small text-dark d-block mb-2">
                    🧪 Programmatic Navigation Mode (History Experiment):
                  </Form.Label>
                  <Form.Check
                    type="radio"
                    id="nav-mode-push"
                    name="navMode"
                    label={
                      <span>
                        <strong>Standard Push</strong> (<code>navigate(&apos;/about&apos;)</code>) — Adds new entry to history stack. Clicking <em>Back</em> in browser returns here.
                      </span>
                    }
                    checked={navigationMode === 'push'}
                    onChange={() => setNavigationMode('push')}
                    className="mb-2 small"
                  />
                  <Form.Check
                    type="radio"
                    id="nav-mode-replace"
                    name="navMode"
                    label={
                      <span>
                        <strong>Replace Current Entry</strong> (<code>navigate(&apos;/about&apos;, &#123; replace: true &#125;)</code>) — Overwrites current entry. Clicking <em>Back</em> skips this contact form!
                      </span>
                    }
                    checked={navigationMode === 'replace'}
                    onChange={() => setNavigationMode('replace')}
                    className="small"
                  />
                </div>

                <div className="d-flex gap-2">
                  <Button type="submit" variant="success" className="rounded-pill px-4 fw-semibold">
                    Submit &amp; Navigate →
                  </Button>
                  <Button
                    type="button"
                    variant="outline-secondary"
                    className="rounded-pill px-3"
                    onClick={() => navigate(-1)}
                  >
                    ← Cancel (Back)
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={5}>
          <Card className="border-0 shadow-sm rounded-4 p-3 bg-white h-100">
            <Card.Body>
              <h2 className="h6 fw-bold text-dark mb-3">Understanding useNavigate vs &lt;Link&gt;</h2>
              <div className="small text-muted d-flex flex-column gap-3">
                <p>
                  <strong>When to use &lt;Link&gt;:</strong>
                  <br />
                  For standard user-driven navigation (menus, buttons, lists) where the user clicks directly on an element to change views. It renders semantic <code className="code-badge">&lt;a&gt;</code> tags with accessible keyboard focus.
                </p>
                <p>
                  <strong>When to use useNavigate():</strong>
                  <br />
                  For imperatively triggered navigation that depends on code logic — such as after validating and submitting a form, checking an authorization rule, or completing a timer.
                </p>
                <div className="p-3 bg-light rounded-3">
                  <div className="fw-semibold text-dark mb-1">History Behavior Comparison:</div>
                  <ul className="mb-0 ps-3">
                    <li><code className="code-badge">navigate(url)</code> uses <code className="code-badge">history.pushState()</code></li>
                    <li><code className="code-badge">navigate(url, &#123; replace: true &#125;)</code> uses <code className="code-badge">history.replaceState()</code></li>
                    <li><code className="code-badge">navigate(-1)</code> goes back one step in browser history stack.</li>
                  </ul>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
