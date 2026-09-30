import { useState } from "react";

function HttpCache() {
    const [result, setResult] = useState(null);
    const [requestCount, setRequestCount] = useState(0);

    const handleRequest = async () => {
        setRequestCount((count) => count + 1);

        try {
            const response = await fetch(
                "https://jsonplaceholder.typicode.com/users"
            );

            const data = await response.json();

            setResult({
                status: response.status,
                cacheControl: response.headers.get("cache-control"),
                users: data.length,
            });
        } catch (error) {
            setResult({
                error: error.message,
            });
        }
    };

    return (
        <div>
            <h2>Bài 8 - HTTP Cache</h2>

            <button onClick={handleRequest}>
                Request Users
            </button>

            <p>Client request count: {requestCount}</p>

            {result && (
                <pre>
          {JSON.stringify(result, null, 2)}
        </pre>
            )}

            <p>
                Mở DevTools → Network để quan sát request và cache behavior.
            </p>
        </div>
    );
}

export default HttpCache;