const API_URL = "https://jsonplaceholder.typicode.com/users";

const CACHE_KEY = "slot9-users-cache";
const CACHE_TTL = 30000; // 30 seconds

export async function fetchUsers({ signal, forceReload = false } = {}) {
    if (!forceReload) {
        const cached = sessionStorage.getItem(CACHE_KEY);

        if (cached) {
            const parsed = JSON.parse(cached);

            const isFresh = Date.now() - parsed.timestamp < CACHE_TTL;

            if (isFresh) {
                console.log("Cache HIT");
                return parsed.data;
            }
        }
    }

    console.log("Cache MISS - Fetch API");

    const response = await fetch(API_URL, {
        signal,
    });

    if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
    }

    const data = await response.json();

    sessionStorage.setItem(
        CACHE_KEY,
        JSON.stringify({
            timestamp: Date.now(),
            data,
        })
    );

    return data;
}