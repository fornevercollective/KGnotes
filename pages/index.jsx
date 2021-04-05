const IndexPage = () => {
    return (
        <main>
            <h1>Notes</h1>

            <p>A tiny realtime notetaking program.</p>

            <button onClick={() => window.location = '/api/create'}>
                Create page
            </button>
        </main>
    )
}

export default IndexPage