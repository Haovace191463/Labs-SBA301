import { useState } from "react";
import axios from "axios";

function AxiosDemo() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleFetchUsers = async () => {
        setLoading(true);
        setError("");

        try {
            const response = await axios.get(
                "https://jsonplaceholder.typicode.com/users"
            );

            setUsers(response.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>Bài 7 - Axios</h2>

            <button onClick={handleFetchUsers} disabled={loading}>
                {loading ? "Loading..." : "Fetch Users with Axios"}
            </button>

            {error && <p>Error: {error}</p>}

            <p>Total users: {users.length}</p>

            <ul>
                {users.map((user) => (
                    <li key={user.id}>
                        {user.name} - {user.email}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default AxiosDemo;