import { useState } from "react";

function createTask(name, delay, shouldFail = false) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (shouldFail) {
                reject(new Error(`${name} failed`));
                return;
            }

            resolve(`${name} completed`);
        }, delay);
    });
}

function PromiseComposition() {
    const [result, setResult] = useState("");

    const runAll = async () => {
        setResult("Running Promise.all...");

        try {
            const results = await Promise.all([
                createTask("Task A", 1000),
                createTask("Task B", 2000),
                createTask("Task C", 1500),
            ]);

            setResult(results.join(" | "));
        } catch (error) {
            setResult(`Promise.all error: ${error.message}`);
        }
    };

    const runAllSettled = async () => {
        setResult("Running Promise.allSettled...");

        const results = await Promise.allSettled([
            createTask("Task A", 1000),
            createTask("Task B", 2000, true),
            createTask("Task C", 1500),
        ]);

        setResult(
            results
                .map((item) =>
                    item.status === "fulfilled"
                        ? `SUCCESS: ${item.value}`
                        : `ERROR: ${item.reason.message}`
                )
                .join(" | ")
        );
    };

    const runRace = async () => {
        setResult("Running Promise.race...");

        try {
            const result = await Promise.race([
                createTask("Task A", 1000),
                createTask("Task B", 2000),
                createTask("Task C", 1500),
            ]);

            setResult(`Winner: ${result}`);
        } catch (error) {
            setResult(`Race error: ${error.message}`);
        }
    };

    return (
        <div>
            <h2>Bài 3 - Promise Composition</h2>

            <button onClick={runAll}>Promise.all()</button>
            <button onClick={runAllSettled}>Promise.allSettled()</button>
            <button onClick={runRace}>Promise.race()</button>

            <p>{result}</p>
        </div>
    );
}

export default PromiseComposition;