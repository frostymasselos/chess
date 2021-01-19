export default function Instructions({ url }) {
    return (
        <div className="instructions">
            {/* <p>Instructions</p> */}
            <p>
                Save before adding in castling.
                Clicking Start New Game will direct you to a random url.
                Share this url with another player for them to join.
                {url ? <span><br></br>Url: {window.location.origin}/{url}</span> : null}
            </p>
        </div>
    )
}
// export default Instructions;
// A player may only be part of one game at any time.
// Once the other player navigates to the url, the match will begin. 