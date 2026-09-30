import { useState } from "react";

function createPromise(input) {
    return new Promise((resolve, reject) => {
        if (!input || input.trim() === "") {
            reject(new Error("Input không hợp lệ"));
            return;
        }

        setTimeout(() => {
            resolve(`Promise resolved với input: "${input}"`);
        }, 1000);
    });
}

function PromiseCreation() {
    const [input, setInput] = useState("");
    const [result, setResult] = useState("");
    const [error, setError] = useState("");

    const handleResolve = async () => {
        setError("");
        setResult("");

        try {
            const message = await createPromise(input);
            setResult(message);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div>
            <h2>Bài 2 - Promise Creation</h2>

            <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Nhập dữ liệu"
            />

            <button onClick={handleResolve}>
                Run Promise
            </button>

            {result && <p>{result}</p>}
            {error && <p>{error}</p>}
        </div>
    );
}

export default PromiseCreation;