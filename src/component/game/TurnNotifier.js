function TurnNotifier({canMove}) {
    return (
        <div>It is {canMove? "your" : "your opponent's"} turn</div>
    )
}

export default TurnNotifier