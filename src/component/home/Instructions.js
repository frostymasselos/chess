export default function Instructions({ url }) {
    return (
        <div className="instructions">
            <p>
                Clicking Start New Game will direct you to a random url.
                Share this url with another player for them to join. Perfect castling branch.
                {url ? <span><br></br>Url: {window.location.origin}/{url}</span> : null}
            </p>
        </div>
    )
}