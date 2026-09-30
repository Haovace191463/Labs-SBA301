import { useState } from "react";

function FetchPost() {
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleCreateUser = async () => {
        setLoading(true);
        setError("");
        setResult(null);

        try {
            const response = await fetch(
                "https://jsonplaceholder.typicode.com/users",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        name: "SBA301 Student",
                        username: "sba301",
                        email: "student@example.com",
                    }),
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP Error: ${response.status}`);
            }

            const data = await response.json();
            setResult(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>Bài 6 - Fetch POST</h2>

            <button onClick={handleCreateUser} disabled={loading}>
                {loading ? "Creating..." : "Create User"}
            </button>

            {error && <p>Error: {error}</p>}

            {result && (
                <pre>
          {JSON.stringify(result, null, 2)}
        </pre>
            )}
        </div>
    );
}

export default FetchPost;