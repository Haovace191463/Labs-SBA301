function DebugEvidence() {
    const checks = [
        "Terminal checked",
        "Console checked",
        "Git committed"
    ];

    return (
        <section className="card">
            <h2>Debug Evidence</h2>

            <ul>
                {checks.map((check) =>(
                    <li key={check}>{check}</li>
                ))}
            </ul>
        </section>
    )
}

export default DebugEvidence;