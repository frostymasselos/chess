function TurnNotifier({canMove}) {
    return (
        <p>{canMove? "Your" : "Opponent's"} Turn</p>
    )
}

export default TurnNotifier