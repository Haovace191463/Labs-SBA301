import {useState} from "react";
import LoginPage from "./pages/Login/LoginPage";
import Header from "./components/layout/Header";
import Sidebar from "./components/layout/Sidebar";
import DashboardPage from "./pages/Dashboard/DashboardPage";
import CategoryManagement from "./pages/Categories/CategoryManagement";
import NewsManagement from "./pages/News/NewsManagement";
import UserManagement from "./pages/Users/UserManagement";
import SettingsPage from "./pages/Settings/SettingsPage";

function App() {
    const [currentUser, setCurrentUser] = useState(null);
    const [activePage, setActivePage] = useState("dashboard");

    const handleLogin = (user) => {
        setCurrentUser(user);
        setActivePage("dashboard");
    };

    const handleLogout = () => {
        setCurrentUser(null);
    };

    if (!currentUser) {
        return <LoginPage onLogin={handleLogin}/>;
    }

    return (
        <div className="app">
            <Header
                currentUser={currentUser}
                onLogout={handleLogout}
            />

            <div className="app-body">
                <Sidebar
                    activePage={activePage}
                    onNavigate={setActivePage}
                />

                <main className="main-content">
                    {activePage === "dashboard" && <DashboardPage/>}

                    {activePage === "categories" && <CategoryManagement/>}

                    {activePage === "news" && <NewsManagement/>}

                    {activePage === "users" && <UserManagement />}

                    {activePage === "settings" && (<SettingsPage currentUser={currentUser} />)}

                    {activePage !== "dashboard" &&
                        activePage !== "categories" &&
                        activePage !== "news" &&
                        activePage !== "users" &&
                        activePage !== "settings" &&(
                            <div>
                                <h1>{activePage}</h1>
                                <p>This page is under development.</p>
                            </div>
                        )}
                </main>
            </div>
        </div>
    );
}

export default App;