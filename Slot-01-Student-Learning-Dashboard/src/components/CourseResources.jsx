import {courseResources} from "../data/dashboardData.js";

function CourseResources() {
    return (
        <section className="card">
            <h2>Course Resources</h2>

            <ul>
                {courseResources.map((resource) => (
                    <li key={resource}>{resource}</li>
                ))}
            </ul>
        </section>
    );
}

export default CourseResources;