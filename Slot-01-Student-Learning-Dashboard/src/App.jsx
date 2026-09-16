import ArchitectureFlow from "./components/ArchitectureFlow";
import CourseHeader from "./components/CourseHeader";
import EnvironmentStatus from "./components/EnvironmentStatus";
import Footer from "./components/Footer";
import LearningChecklist from "./components/LearningChecklist";
import ProjectSummary from "./components/ProjectSummary";
import StudentProfile from "./components/StudentProfile";
import CourseResources from "./components/CourseResources.jsx";
import DebugEvidence from "./components/DebugEvidence.jsx";

function App() {
    return (
        <>
            <CourseHeader/>
            <main className="dashboard">
                <StudentProfile/>
                <EnvironmentStatus/>
                <LearningChecklist/>
                <ProjectSummary/>
                <ArchitectureFlow/>
                <CourseResources/>
                <DebugEvidence/>
            </main>
            <Footer/>
        </>
    );
}

export default App;