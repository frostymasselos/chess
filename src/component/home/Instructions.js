export default function Instructions({url}) {
    return (
        <div className="instructions">
            <p>Instructions</p>
            <p>Clicking Start New Game will direct you to a random url.<br></br>Share this url with one other player for them to join.</p>
            {url ? <div>Match url: {window.location.origin}/{url}</div> : null}
        </div>
    )
}
// export default Instructions;
// A player may only be part of one game at any time.
// Once the other player navigates to the url, the match will begin. 