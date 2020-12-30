import {useEffect} from 'react';

function StartNewGame({startNewGame}) {

    return (
        <>
            <div className="new-game button" onClick={startNewGame}>
                Start new game 
            </div>
        </>
    )
}

export default StartNewGame;