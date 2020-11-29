function TurnNotifier({turn}) {
    return (
        <div>It is {turn? "your" : "your opponent's"} turn</div>
    )
}

export default TurnNotifier