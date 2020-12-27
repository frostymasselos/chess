function Instructions({url}) {
    return (
        <div className="instructions">
            <div>
                <h2>Instructions</h2>
                <div>
                    Clicking Start New Game will direct you to a random url. Share this url with one other player.
                </div>
                <div>
                    Once the other player navigates to the url, the match will begin. 
                </div>
                {url ? <div>Match url: {window.location.origin}/{url}</div> : null}
            </div>
        </div>
    )
}

export default Instructions;

// A player may only be part of one game at any time.