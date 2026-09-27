import {useState} from "react";

function LoginPage({onLogin}) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const handleSubmit = (event) => {
        event.preventDefault();
        setError("");
        if (!username.trim() || !password.trim()) {
            setError("Please enter username and password.");
            return;
        }
        if (username === "Admin" && password === "123456") {
            onLogin({username: "Admin", role: 1,});
            return;
        }
        setError("Invalid username or password.");
    };
    return (<div className="login-page">
        <div className="login-card">
            <div className="login-header"><h1>FUNews</h1> <p>FUNews Management System</p></div>
            <form onSubmit={handleSubmit}>
                <div className="form-group"><label htmlFor="username">Username</label>
                    <input id="username" type="text"
                           value={username}
                           onChange={(event) => setUsername(event.target.value)}
                           placeholder="Enter username"/>
                </div>
                <div className="form-group"><label htmlFor="password">Password</label>
                    <input id="password"
                           type="password"
                           value={password}
                           onChange={(event) => setPassword(event.target.value)}
                           placeholder="Enter password"/>
                </div>
                {error && <div className="login-error">{error}</div>}
                <button type="submit" className="login-button"> Login</button>
            </form>
            <div className="login-hint"><small>Demo account: Admin / Admin</small></div>
        </div>
    </div>);
}

export default LoginPage;