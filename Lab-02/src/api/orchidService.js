let orchidCache = null;

let cacheTime = 0;

const CACHE_DURATION = 30_000;

async function fetchOrchids() {
    const response = await fetch('/orchids.json', {
        headers: {
            Accept: 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error(
            `HTTP ${response.status}: Không thể tải orchids.json`
        );
    }

    return response.json();
}

const orchidService = {
    async getOrchids({ force = false } = {}) {
        const now = Date.now();

        const validCache =
            orchidCache &&
            (now - cacheTime < CACHE_DURATION);

        if (!force && validCache) {
            return orchidCache;
        }

        const data = await fetchOrchids();

        orchidCache = data;
        cacheTime = now;

        return data;
    },

    clearCache() {
        orchidCache = null;
        cacheTime = 0;
    },
};

export default orchidService;