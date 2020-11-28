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
import firebase from '../helper/firebase.js'; 
import "firebase/auth";
import { queryAllByDisplayValue } from '@testing-library/react';

function Game({params}) {

    let [invalidRoute, setinvalidRoute] = useState(false);
    let [playing, setPlaying] = useState(false);
    let [user2SignedIn, setUser2SignedIn] = useState(false);
    let [waiting, setwaiting] = useState(false);
    let [onForeignMatch, setOnForeignMatch] = useState(false);
    let [opponentQuits, setOpponentQuits] = useState(false);
    // let [matchUrl, setMatchUrl] = useState("54321");

    let db = firebase.database(); 
    let auth = firebase.auth();

    function fadeTags(boolean) {
        if (true) { 
            //assign all el (on this page)   into class which makes them unclickable & opacity greyed-out
        } else {
            
        }
    }
    
    
    useEffect(() => { 
        let code = params.slice(1); console.log(code);
        let game = db.ref(`matches/${code}`);
        db.ref(`matches`).orderByKey().equalTo(`${code}`).on('value', (e) => { //go back & revisit FBnotes.
            console.log(e.val());
            if (true) { // e.val() params match DB
                db.ref(`matches`).off(); //remove previous listener
                let authSignedInListener = auth.onAuthStateChanged(() => { 
                    if (false) { //auth.currentUser signed into FB - user1 first time or signed in user1|2 returning to own game or intruding on new url.
                        authSignedInListener(); console.log("authSignedIn"); //remove previous listener
                        if (auth.currentUser.email.includes(`${code}`)) { //correct 5DC - could be user1 first time or signed in user1|2 returning to own game
                            if (auth.currentUser.email.includes('user1')) { //are you user1 returning to own game? 
                                if (true) { //user1 returning to own game for 2+ time (DBsignIn true)
                                    setPlaying(true);
                                    if (false) { //user2 DBsignIn true
                                        setUser2SignedIn(true);
                                    } else { //user2 not signed in yet
                                        setwaiting(true);
                                    }
                                } else { //user1 venturing on own game for the first-time 
                                    setPlaying(true);
                                    //i-v
                                    //setMatchUrl(window.location.pathname);
                                }
                            } else { //user2 returning to own game
                                setPlaying(true);
                                setUser2SignedIn(true);
                            }  
                        } else { //signed in user1|2 intruding on new url. 
                            if (false) { //user2 DBsignIn true 
                                //render ErrorPage.
                                setinvalidRoute(true);
                            } else {
                                //render TerminateMatchForNewGame
                                setOnForeignMatch(true);
                            }
                        }
                    } else { //user2 first time 🐉 - test this by making & altering db
                        console.log("user2 first time");
                        game.child('user2').orderByKey().equalTo('signedIn').on('value', (e) => {
                            console.log(e.val());
                            if (e.val().signedIn) { //user2 DBSignedIn
                                console.log("invalidRoute");
                                setinvalidRoute(true);
                            } else { //we can sign in user2
                                console.log("we can sign in user2");
                                async function next(params) {
                                    // await auth.signOut();
                                    //SIGN IN - 🦑 might need to do more work to get address.
                                    await auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL); //might not need it.
                                    await auth.createUserWithEmailAndPassword(`code@nothing.com`, `codecode`); //${code}
                                    //CHANGE STATE
                                    // setPlaying(true);
                                    // setUser2SignedIn(true);
                                }
                                next();
                            }
                        })
                    }; authSignedInListener(); //remove listener
                }); //no code should execute after this authListener.
            } else {
                console.log("invalidRoute");
                setinvalidRoute(true);
            } 
        }) //no code should execute after this dBListener
    }, []);
    
    return ( 
        <>
            <h4>GameContainer</h4>
            {invalidRoute && <ErrorPage/>}
            {playing && <Exit/>}
            {waiting && <Waiting/>}
            {user2SignedIn && <TurnNotifier/>}
            {playing && <Board/>}
            {playing && <TerminateMatch/>}
            {onForeignMatch && <TerminateMatchForNewGame prop={fadeTags}/>}
            {opponentQuits && <OpponentQuits/>}
        </>
    )
  
}

export default Game

// db.ref(`a/b`).orderByKey().on('value', (e) => { //.equalTo('c')
// console.log(e.val()); //returns {b: "c"}
// })

