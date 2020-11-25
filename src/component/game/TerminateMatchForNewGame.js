import {Link} from 'react-router-dom';
import {useState, useEffect} from 'react';

function TerminateMatchForNewGame() {

    let [matchUrl, setMatchUrl] = useState('/');

    // function greyInOut(params) {
        //     //execute prop with false arg
        // }
        // //mount executes prop with true arg

        
        function terminateMatchForNewGame(params) {
            //same as terminateMatch
            window.location.reload();
        }
        
    useEffect(() => {
        //get user1's original game url.
        setMatchUrl("/12344");
    });

    return (
        <>
            <div>You are currently signed in...A user can only...Would you like to?...</div>
            <button onClick={terminateMatchForNewGame}>Join this game</button>
            <Link to={matchUrl}>Go back to your game</Link>
        </>
    )
}

export default TerminateMatchForNewGame