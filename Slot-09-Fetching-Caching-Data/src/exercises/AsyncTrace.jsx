import { useEffect } from "react";

function AsyncTrace() {
    useEffect(() => {
        console.clear();

        console.log("1. Sync - Start");

        setTimeout(() => {
            console.log("4. setTimeout - Macrotask");
        }, 0);

        Promise.resolve().then(() => {
            console.log("3. Promise - Microtask");
        });

        console.log("2. Sync - End");
    }, []);

    return (
        <div>
            <h2>Bài 1 - Async Trace</h2>
            <p>Mở DevTools → Console để xem thứ tự thực thi.</p>
        </div>
    );
}

export default AsyncTrace;