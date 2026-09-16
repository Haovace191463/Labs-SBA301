import { Container } from "react-bootstrap";

function AppFooter() {
    return (
        <footer id="about" className="py-4 bg-dark text-white">
            <Container>
                <p className="mb-0 text-center">
                    EventHub — Campus Event Explorer
                </p>
            </Container>
        </footer>
    );
}

export default AppFooter;