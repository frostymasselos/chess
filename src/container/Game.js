import {useState} from 'react';
import {useEffect} from 'react';
import Test from '../component/Test.js';
import ErrorPage from '../component/game/ErrorPage.js';
import Exit from '../component/game/Exit.js';
import Waiting from '../component/game/Waiting.js';
import TurnNotifier from '../component/game/TurnNotifier.js';
import Board from '../component/game/Board.js';
import TerminateMatch from '../component/game/TerminateMatch.js';
import TerminateMatchForNewGame from '../component/game/TerminateMatchForNewGame.js';
import OpponentQuits from '../component/game/OpponentQuits.js';

function Game(params) {

    let [invalidRoute, setinvalidRoute] = useState(false);
    let [playing, setPlaying] = useState(false);
    let [user2SignedIn, setUser2SignedIn] = useState(false);
    let [onForeignMatch, setOnForeignMatch] = useState(false);
    let [opponentQuits, setOpponentQuits] = useState(false);

    // let [matchUrl, setMatchUrl] = useState("54321");

    function fadeTags(boolean) {
        if (true) { 
            //assign all el (on this page)   into class which makes them unclickable & opacity greyed-out
        } else {
            
        }
    }

    useEffect(() => { 
        if (true) { //params match DB
            if (true) { //signed into FB - could be user1 first time or user1|2 returning.
                if (true) { //correct 5DC - could be user1 first time or user1|2 returning.
                    if (true) { //are you user1? 
                        if (true) { //user1 DBsignIn true - user1 returning. 🐉
                            setPlaying(true);
                            if (false) { //user2 DBsignIn true
                                setUser2SignedIn(true);
                            } 
                        } else { //user1 first-time 
                            setPlaying(true);
                            //i-v
                            //setMatchUrl(window.location.pathname);
                        }
                    } else { //user2 returning 
                        setPlaying(true);
                        setUser2SignedIn(true);
                    }  
                } else { //user1|2 pursuing new url. 
                    if (false) { //user2 DBsignIn true 
                        //render ErrorPage.
                        setinvalidRoute(true);
                    } else {
                        //render TerminateMatchForNewGame
                        setOnForeignMatch(true);
                    }
                }
            } else { //user2 first time
                if (false) { //user2 DBSignedIn
                    setinvalidRoute(true);
                } else { //user2 successful
                    setPlaying(true);
                    setUser2SignedIn(true);
                }
            }
        } else {
            setinvalidRoute(true);
        } 
    });
    
    return ( 
        <>
            <h4>GameContainer</h4>
            {invalidRoute && <ErrorPage/>}
            {playing && <Exit/>}
            {!user2SignedIn && !invalidRoute && !onForeignMatch && <Waiting/>} 
            {user2SignedIn && <TurnNotifier/>}
            {playing && <Board/>}
            {playing && <TerminateMatch/>}
            {onForeignMatch && <TerminateMatchForNewGame prop={fadeTags}/>}
            {opponentQuits && <OpponentQuits/>}
        </>
    )
  
}

export default Game