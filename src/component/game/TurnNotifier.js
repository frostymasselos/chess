function TurnNotifier({canMove, check}) {
    return (
        <>
            <p>{check ? "You are in check" : canMove ? "Your Turn" : "Opponent's Turn"} </p>
        </>
    )
}

export default TurnNotifier