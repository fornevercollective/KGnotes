const IndexPage = () => {
    return (
        <main>
            <h1>Notes</h1>

            <p>A tiny realtime notepad/pastebin.</p>

            <button onClick={() => window.location = '/api/create'}>
                Create page
            </button>
        </main>
    )
}

export default IndexPage