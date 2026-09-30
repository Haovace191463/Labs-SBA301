import {useEffect, useMemo, useRef, useState} from "react";
import {fetchUsers} from "./userApi";

function UserListDataClient() {
    const [users, setUsers] = useState([]);
    const [status, setStatus] = useState("loading");
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");

    const controllerRef = useRef(null);

    const loadUsers = async (forceReload = false) => {
        controllerRef.current?.abort();

        const controller = new AbortController();
        controllerRef.current = controller;

        setStatus("loading");
        setError("");

        try {
            const data = await fetchUsers({
                signal: controller.signal,
                forceReload,
            });

            setUsers(data);
            setStatus("success");
        } catch (err) {
            if (err.name === "AbortError") {
                console.log("Request aborted");
                return;
            }

            setError(err.message);
            setStatus("error");
        }
    };

    useEffect(() => {
        const controller = new AbortController();
        controllerRef.current = controller;

        const loadInitialUsers = async () => {
            setStatus("loading");
            setError("");

            try {
                const data = await fetchUsers({
                    signal: controller.signal,
                });

                setUsers(data);
                setStatus("success");
            } catch (err) {
                if (err.name === "AbortError") {
                    console.log("Request aborted");
                    return;
                }

                setError(err.message);
                setStatus("error");
            }
        };

        loadInitialUsers();

        return () => {
            controller.abort();
        };
    }, []);

    const filteredUsers = useMemo(() => {
        const keyword = search.toLowerCase().trim();

        if (!keyword) {
            return users;
        }

        return users.filter(
            (user) =>
                user.name.toLowerCase().includes(keyword) ||
                user.email.toLowerCase().includes(keyword)
        );
    }, [users, search]);

    return (
        <div>
            <h2>Mini Project - User List Data Client</h2>

            <div>
                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search name or email..."
                />

                <button onClick={() => loadUsers(true)}>
                    Reload
                </button>
            </div>

            {status === "loading" && (
                <p>Loading users...</p>
            )}

            {status === "error" && (
                <div>
                    <p>Error: {error}</p>

                    <button onClick={() => loadUsers(true)}>
                        Retry
                    </button>
                </div>
            )}

            {status === "success" && filteredUsers.length === 0 && (
                <p>No users found.</p>
            )}

            {status === "success" && filteredUsers.length > 0 && (
                <ul>
                    {filteredUsers.map((user) => (
                        <li key={user.id}>
                            <strong>{user.name}</strong>
                            {" - "}
                            {user.email}
                        </li>
                    ))}
                </ul>
            )}

            <p>
                Status: <strong>{status}</strong>
            </p>

            <p>
                Showing {filteredUsers.length} / {users.length} users
            </p>
        </div>
    );
}

export default UserListDataClient;