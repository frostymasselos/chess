export default function TerminateGame({terminateGame}) {
    return (
        <>
            <div className="home-terminate-game button warning-button" onClick={terminateGame}>
                    End Game
            </div>
        </>
    )
}