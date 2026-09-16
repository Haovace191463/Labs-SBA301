import AppNavbar from "./components/AppNavbar.jsx";
import HeroSection from "./components/HeroSection.jsx";
import EventList from "./components/EventList";
import AppFooter from "./components/AppFooter";
import {events} from "./data/events";

function App() {
    return (
        <>
            <AppNavbar/>
            <HeroSection/>
            <EventList events={events}/>
            <AppFooter/>
        </>
    );
}

export default App;