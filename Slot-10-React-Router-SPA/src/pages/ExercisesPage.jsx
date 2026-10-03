import { useState } from 'react';
import { Row, Col, Card, Nav, Badge } from 'react-bootstrap';
import Breadcrumbs from '../components/Breadcrumbs';

// Import all 10 exercise components
import SpaMpaExercise from '../exercises/SpaMpaExercise';
import BasicRoutesExercise from '../exercises/BasicRoutesExercise';
import NavLinkExercise from '../exercises/NavLinkExercise';
import DynamicRouteExercise from '../exercises/DynamicRouteExercise';
import QueryParamsExercise from '../exercises/QueryParamsExercise';
import NavigateExercise from '../exercises/NavigateExercise';
import LocationExercise from '../exercises/LocationExercise';
import NestedRoutesExercise from '../exercises/NestedRoutesExercise';
import HistoryExercise from '../exercises/HistoryExercise';
import DeepLinkExercise from '../exercises/DeepLinkExercise';

const EXERCISES = [
  { id: 'ex1', number: '01', title: 'SPA vs MPA Trace', component: SpaMpaExercise, category: 'Fundamentals' },
  { id: 'ex2', number: '02', title: 'Basic Routes', component: BasicRoutesExercise, category: 'Core Routing' },
  { id: 'ex3', number: '03', title: 'NavLink & Active State', component: NavLinkExercise, category: 'Core Routing' },
  { id: 'ex4', number: '04', title: 'Dynamic Routes (:id)', component: DynamicRouteExercise, category: 'Parameters' },
  { id: 'ex5', number: '05', title: 'Query Parameters', component: QueryParamsExercise, category: 'Parameters' },
  { id: 'ex6', number: '06', title: 'useNavigate & Redirects', component: NavigateExercise, category: 'Navigation' },
  { id: 'ex7', number: '07', title: 'Location & useLocation', component: LocationExercise, category: 'Navigation' },
  { id: 'ex8', number: '08', title: 'Nested Routes & Outlet', component: NestedRoutesExercise, category: 'Layouts' },
  { id: 'ex9', number: '09', title: 'Browser History Stack', component: HistoryExercise, category: 'Browser APIs' },
  { id: 'ex10', number: '10', title: 'Deep Linking & Direct URLs', component: DeepLinkExercise, category: 'Browser APIs' },
];

export default function ExercisesPage() {
  const [activeExerciseId, setActiveExerciseId] = useState('ex1');

  const currentExercise = EXERCISES.find((e) => e.id === activeExerciseId) || EXERCISES[0];
  const ActiveComponent = currentExercise.component;

  return (
    <div>
      <Breadcrumbs items={[{ label: '10 Hands-on Exercises' }]} />

      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4 pb-3 border-bottom">
        <div>
          <h1 className="h2 fw-bold text-dark mb-1">
            🧪 Practical Routing Exercises (01 – 10)
          </h1>
          <p className="text-muted mb-0">
            Interactive laboratory workbook for SBA301 Slot 10. Select any module to view guidelines and live tests.
          </p>
        </div>
        <div className="d-flex align-items-center gap-2">
          <Badge bg="success" className="px-3 py-2 rounded-pill fs-6">
            10 of 10 Modules Ready
          </Badge>
        </div>
      </div>

      <Row className="g-4">
        {/* Left Column: Exercise Table of Contents */}
        <Col lg={4} md={5}>
          <Card className="border-0 shadow-sm rounded-4 p-2 bg-white">
            <Card.Body className="p-2">
              <div className="small text-uppercase fw-bold text-muted px-3 py-2">
                Laboratory Modules
              </div>
              <Nav className="flex-column">
                {EXERCISES.map((ex) => {
                  const isCurrent = ex.id === activeExerciseId;
                  return (
                    <button
                      key={ex.id}
                      type="button"
                      className={`text-start w-100 border-0 p-3 rounded-3 mb-1 transition-all d-flex align-items-center justify-content-between ${
                        isCurrent
                          ? 'bg-success text-white shadow-sm fw-semibold'
                          : 'bg-transparent text-dark hover-bg-light'
                      }`}
                      style={{
                        backgroundColor: isCurrent ? '#2d6a4f' : 'transparent',
                        cursor: 'pointer'
                      }}
                      onClick={() => setActiveExerciseId(ex.id)}
                    >
                      <div className="d-flex align-items-center gap-2">
                        <span
                          className={`badge ${isCurrent ? 'bg-white text-success' : 'bg-light text-secondary'} rounded-pill`}
                        >
                          Ex {ex.number}
                        </span>
                        <span className="small">{ex.title}</span>
                      </div>
                      <span className={`badge ${isCurrent ? 'bg-success-subtle text-white' : 'bg-light text-muted'} rounded-pill small`}>
                        {ex.category}
                      </span>
                    </button>
                  );
                })}
              </Nav>
            </Card.Body>
          </Card>
        </Col>

        {/* Right Column: Active Exercise Interactive Content */}
        <Col lg={8} md={7}>
          <Card className="border-0 shadow-sm rounded-4 p-3 bg-white">
            <Card.Body>
              <div className="d-flex align-items-center gap-2 mb-3 pb-2 border-bottom">
                <span className="badge bg-success-subtle text-success fs-6 px-3 py-1 rounded-pill">
                  Module {currentExercise.number}
                </span>
                <span className="text-muted small">Category: <strong>{currentExercise.category}</strong></span>
              </div>

              {/* Render the selected active exercise component */}
              <ActiveComponent />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
