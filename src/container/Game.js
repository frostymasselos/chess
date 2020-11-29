import bigObj from '../helper/secondDb';
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

function Game({params}) {

    let [arbitrary, setArbitrary] = useState(0);
    let [invalidRoute, setinvalidRoute] = useState(false);
    let [playing, setPlaying] = useState(false);
    let [user2SignedIn, setUser2SignedIn] = useState(false);
    let [waiting, setWaiting] = useState(false);
    let [onForeignMatch, setOnForeignMatch] = useState(false);
    let [opponentQuits, setOpponentQuits] = useState(false);
    let [matchUrl, setMatchUrl] = useState("");
    let [authInfo, setAuthInfo] = useState({});

    let db = firebase.database(); 
    let auth = firebase.auth();

    function test(color, animal) {
        console.log(this);
        console.log(color);
        console.log(animal);
        // db.ref(`matches/template2`).set(bigObj);
    }

    function user2Moves(params) {
        console.log("button to make user2 move's been clicked");
        db.ref(`matches/${matchUrl}/user2`).update({
            moved: Math.random().toFixed(3)
        })
    }

    async function user2QuitsAndDbDeletes(params) {
        console.log("button to make user2 quit's been clicked");
        db.ref(`matches/${matchUrl}/user2`).update({
            quit: true
        });
        await db.ref(`matches/${matchUrl}`).remove();
    }

    async function user1QuitsAndDbDeletes(params) {
        console.log("button to make user1 quit's been clicked");
        db.ref(`matches/${matchUrl}/user1`).update({
            quit: true
        });
        await db.ref(`matches/${matchUrl}`).remove();
    }

    function listenerForUser2SigningIn(game) {
        console.log(`listening for user2 signing in`);
        async function next(e) {
            console.log(`callback fired for user2 signing in`);
            setWaiting(false);
        }
        game.child(`user2`).orderByKey().equalTo(`signedIn`).on('child_changed', next);
    }

    function listenerForOpponentQuitting(game, you, opponent) {
        console.log(`${you} listening for ${opponent} quitting`);
        async function next(e) {
            console.log(`registered ${opponent}'s quit`);
            await auth.currentUser.delete();
            setOpponentQuits(true);
            // ARBITRARILY UPDATE STATE
            setArbitrary(Math.random().toFixed(3));
        }
        game.child(`${opponent}`).orderByKey().equalTo('quit').on('child_changed', next);
        // auth.onAuthStateChanged(() => {}); don't need this as already have it in mount
    }

    function mount() {
        let code = params.slice(1); console.log(code); setMatchUrl(code);
        let game = db.ref(`matches/${code}`);
        db.ref('matches').orderByKey().equalTo(`${code}`).on('value', (e) => { 
            db.ref('matches').off(); console.log(e.val()); //remove previous listener
            if (e.val()) { 
                //THE GAME EXISTS
                let authListener = auth.onAuthStateChanged(() => { 
                    authListener(); //remove listener
                    if (auth.currentUser) { 
                        // USER1 1ST TIME OR USER1|2 RETURNING OR INTRUDING
                        //PASS PROPS FOR TerminateMatch & TerminateMatchForNewGame
                        console.log("authSignedIn"); 
                        let user = "";
                        auth.currentUser.email.includes("user1") ? user = "user1" : user = "user2";
                        setAuthInfo({authCode: auth.currentUser.email.slice(0, 6), authUser: user});
                        if (auth.currentUser.email.includes(`${code}`)) { 
                            //USER1 1ST TIME OR USER1|2 RETURNING  
                            if (auth.currentUser.email.includes('user1')) { 
                                //USER1 1ST TIME OR RETURNING
                                game.child(`user1/signedIn`).orderByKey().on('value', (e) => { 
                                    game.child(`user1/signedIn`).off(); console.log(e.val()); //remove listener
                                    if (e.val()) {
                                        //USER1 RETURNING
                                        setPlaying(true); console.log("user1 returning");
                                        game.child(`user2/signedIn`).orderByKey().on('value', (e) => {
                                            game.child(`user2/signedIn`).off(); //remove listener
                                            console.log(e.val());
                                            if (e.val()) { 
                                                //USER2 SIGNED IN
                                                setUser2SignedIn(true); console.log("user2 is signed in");
                                            } else { 
                                                //USER2 NOT SIGNED IN YET✅
                                                setWaiting(true); console.log("user2 not signed in");
                                            }
                                        })
                                    } else { //
                                        //USER1 1ST TIME
                                        console.log("user1 own game first-time");
                                        // listenerForUser2SigningIn(game);
                                        listenerForOpponentQuitting(game, "user1", "user2");
                                        async function next(params) {
                                            //i-v
                                            //LISTENER FOR OPPONENT QUITTING
                                            //DBuser1SignIn TRUE
                                            await game.child('user1').update({
                                                signedIn: true
                                            })
                                            // ARBRITRARILY TRIGGER STATE IN GAME
                                            setArbitrary(Math.random().toFixed(1));
                                        }
                                        next();
                                    }
                                })
                            } else { 
                                //USER2 RETURNING✅
                                console.log("user2 returning");
                                setPlaying(true); 
                                setUser2SignedIn(true);
                                setWaiting(false);
                            }  
                        } else { 
                            //SIGNED IN USER1|2 INTRUDING
                            //IS GAME FULL?
                            console.log("signed in user1|2 intruding");
                            let dBUser2SignedIn = game.child('user2/signedIn');
                            dBUser2SignedIn.orderByKey().on('value', (e) => {
                                dBUser2SignedIn.off();
                                console.log(e.val());
                                if (e.val()) { 
                                    //GAME FULL
                                    setinvalidRoute(true); console.log("game full"); 
                                } else {
                                    //GAME NOT FULL
                                    //RENDER TerminateMatchForNewGame
                                    setOnForeignMatch(true); console.log('on foreign match'); 
                                }
                            })
                        }
                    } else { 
                        //USER2 1ST TIME
                        console.log("user2 first time"); //remove listener
                        game.child('user2').orderByKey().equalTo('signedIn').on('value', (e) => {
                            game.child('user2').off(); console.log(e.val().signedIn); //remove listener
                            if (e.val().signedIn) { 
                                //USER2 ALREADY dB SIGNED IN
                                setinvalidRoute(true); console.log("invalidRoute");
                            } else { 
                                //WE CAN SIGN-IN USER2
                                console.log("we can sign in user2");
                                async function next() {
                                    //AUTH SIGN IN
                                    await auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL); //might not need it.
                                    await auth.createUserWithEmailAndPassword(`${code}@user2.com`, `${code}`);
                                    //DB SIGN IN
                                    await game.child('user2').update({
                                        signedIn: true
                                    })
                                    //LISTEN FOR OPPONENT QUITTING
                                    listenerForOpponentQuitting(game, "user2", "user1");
                                    //CHANGE STATE
                                    setArbitrary(Math.random().toFixed(3));
                                }
                                next();
                            }
                        })
                    }; 
                }); //no code should execute after this authListener.
            } else { 
                //THE GAME DOES NOT EXIST
                setinvalidRoute(true); console.log("invalidRoute");
                setPlaying(false);
                setUser2SignedIn(false);
                setWaiting(false);
                setOnForeignMatch(false);
            } 
        }) //no code should execute after this dBListener
    }
    
    useEffect(mount, [arbitrary]);
    
    return ( 
        <>
            <h4>GameContainer</h4>
            {opponentQuits && <OpponentQuits/>}
            {invalidRoute && <ErrorPage/>}
            {playing && <Exit/>}
            {waiting && <Waiting/>}
            {user2SignedIn && <TurnNotifier/>}
            {playing && <Board/>}
            {playing && <TerminateMatch authInfo={authInfo}/>}
            {onForeignMatch && <TerminateMatchForNewGame nativeUrl={matchUrl} intruderInfo={authInfo} setArbitrary={setArbitrary}/>}
            <button onClick={user2QuitsAndDbDeletes}>Click to make user2 quit and db delete</button>
            <button onClick={user1QuitsAndDbDeletes}>Click to make user1 quit and db delete</button>
            <button onClick={user2Moves}>Click to make user2 'move'</button>
            <button onClick={test.bind("this", "blue", "fish")}>Click to execute 'test'</button>
        </>
    )
  
}

export default Game



