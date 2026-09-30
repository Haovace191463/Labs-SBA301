import { useEffect, useRef, useState } from "react";

function RaceCondition() {
    const [userId, setUserId] = useState(1);
    const [user, setUser] = useState(null);
    const [status, setStatus] = useState("idle");
    const controllerRef = useRef(null);

    useEffect(() => {
        const controller = new AbortController();
        controllerRef.current = controller;

        const loadUser = async () => {
            setStatus("loading");
            setUser(null);

            try {
                const response = await fetch(
                    `https://jsonplaceholder.typicode.com/users/${userId}`,
                    {
                        signal: controller.signal,
                    }
                );

                if (!response.ok) {
                    throw new Error(`HTTP Error: ${response.status}`);
                }

                const data = await response.json();

                setUser(data);
                setStatus("success");
            } catch (error) {
                if (error.name === "AbortError") {
                    console.log(`Request for user ${userId} aborted`);
                    return;
                }

                setStatus("error");
            }
        };

        loadUser();

        return () => {
            controller.abort();
        };
    }, [userId]);

    return (
        <div>
            <h2>Bài 10 - Race Condition</h2>

            <p>
                Current user ID: <strong>{userId}</strong>
            </p>

            <button onClick={() => setUserId(1)}>User 1</button>
            <button onClick={() => setUserId(2)}>User 2</button>
            <button onClick={() => setUserId(3)}>User 3</button>

            <p>Status: {status}</p>

            {user && (
                <div>
                    <p>ID: {user.id}</p>
                    <p>Name: {user.name}</p>
                    <p>Email: {user.email}</p>
                </div>
            )}
        </div>
    );
}

export default RaceCondition;