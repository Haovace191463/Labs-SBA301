import { useState } from "react";

function fetchUser() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                id: 1,
                name: "SBA301 Student",
            });
        }, 1000);
    });
}

function AsyncAwait() {
    const [status, setStatus] = useState("Idle");
    const [user, setUser] = useState(null);
    const [error, setError] = useState("");

    const handleFetch = async () => {
        setStatus("Loading");
        setUser(null);
        setError("");

        try {
            const data = await fetchUser();
            setUser(data);
            setStatus("Success");
        } catch (err) {
            setError(err.message);
            setStatus("Error");
        } finally {
            console.log("Request finished");
        }
    };

    return (
        <div>
            <h2>Bài 4 - Async/Await</h2>

            <button onClick={handleFetch}>
                Fetch User
            </button>

            <p>Status: {status}</p>

            {user && (
                <pre>
          {JSON.stringify(user, null, 2)}
        </pre>
            )}

            {error && <p>Error: {error}</p>}
        </div>
    );
}

export default AsyncAwait;