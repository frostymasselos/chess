function StartNewGame({startNewGame}) {
    return (
        <>
            <div className="new-game">
                <div onClick={startNewGame}>
                    <span>Start new game</span>
                </div>
            </div>
        </>
    )
}

export default StartNewGame;