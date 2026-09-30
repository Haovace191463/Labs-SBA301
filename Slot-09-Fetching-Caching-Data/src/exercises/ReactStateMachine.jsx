import { useState } from "react";

function ReactStateMachine() {
    const [state, setState] = useState("idle");
    const [data, setData] = useState(null);
    const [error, setError] = useState("");

    const fetchUsers = async () => {
        setState("loading");
        setData(null);
        setError("");

        try {
            const response = await fetch(
                "https://jsonplaceholder.typicode.com/users"
            );

            if (!response.ok) {
                throw new Error(`HTTP Error: ${response.status}`);
            }

            const users = await response.json();

            setData(users);
            setState("success");
        } catch (err) {
            setError(err.message);
            setState("error");
        }
    };

    return (
        <div>
            <h2>Bài 9 - React State Machine</h2>

            <p>
                Current state: <strong>{state}</strong>
            </p>

            <button onClick={fetchUsers}>
                Fetch Users
            </button>

            {state === "idle" && (
                <p>Chưa thực hiện request.</p>
            )}

            {state === "loading" && (
                <p>Loading users...</p>
            )}

            {state === "success" && data && (
                <div>
                    <p>Loaded {data.length} users.</p>

                    <ul>
                        {data.map((user) => (
                            <li key={user.id}>
                                {user.name}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {state === "error" && (
                <p>Error: {error}</p>
            )}
        </div>
    );
}

export default ReactStateMachine;