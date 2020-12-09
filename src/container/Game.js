import bigObj from '../helper/secondDb';
import {useState, useEffect, useRef} from 'react';
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

    let [invalidRoute, setinvalidRoute] = useState(false);
    let [playing, setPlaying] = useState(false);
    let [canMove, setCanMove] = useState(false);
    let [user2SignedIn, setUser2SignedIn] = useState(false);
    let [waiting, setWaiting] = useState(false);
    let [onForeignMatch, setOnForeignMatch] = useState(false);
    let [opponentQuits, setOpponentQuits] = useState(false);
    let [arbitrary, setArbitrary] = useState(false);
    
    const [db, setDb] = useState(firebase.database());
    const [auth, setAuth] = useState(firebase.auth());

    let [authInfo, setAuthInfo] = useState({url: params.slice(1)});//make normal variable? Board relies on it...

    // function test(color, animal) {
    //     console.log(this);
    //     console.log(color);
    //     console.log(animal);
    //     // db.ref(`matches/template2`).set(bigObj);
    // }
    // function user2Moves(params) {
    //     console.log("button to make user2 move's been clicked");
    //     db.ref(`matches/${authInfo.url}/user2`).update({
    //         moved: Math.random().toFixed(5)
    //     })
    // }
    // async function user2QuitsAndDbDeletes(params) {
    //     console.log("button to make user2 quit's been clicked");
    //     await db.ref(`matches/${authInfo.url}/user2`).update({
    //         quit: true
    //     });
    //     await db.ref(`matches/${authInfo.url}`).remove();
    // }
    // async function user1QuitsAndDbDeletes(params) {
    //     console.log("button to make user1 quit's been clicked");
    //     await db.ref(`matches/${authInfo.url}/user1`).update({
    //         quit: true
    //     });
    //     await db.ref(`matches/${authInfo.url}`).remove();
    // }

    //should retrigger useEffect?
    function listenerForUser2SigningIn(game) {
        console.log(`listening for user2 signing in`);
        async function user2SignInHasChanged(e) {
            console.log(`callback fired for user2 signing in`, e.val());
            setWaiting(false);
            setUser2SignedIn(true);
        }
        game.child(`user2`).orderByKey().equalTo(`signedIn`).on('child_changed', user2SignInHasChanged);
    }
    function listenerForOpponentQuitting(game, you, opponent) {
        console.log(`${you} listening for ${opponent} quitting`);
        async function opponentHasQuit(e) {
            console.log(`${you} has registered ${opponent}'s quit`, authInfo);
            const credential = firebase.auth.EmailAuthProvider.credential(`${authInfo.email}`, `${authInfo.email.slice(0, 6)}`);
            await auth.currentUser.reauthenticateWithCredential(credential);
            await auth.currentUser.delete();
            setOpponentQuits(true);
        }
        game.child(`${opponent}`).orderByKey().equalTo('quit').on('child_changed', opponentHasQuit);
    }
    function listenerForOpponentMoving(game, you, opponent) {
        console.log(`listening for ${opponent} moving`);
        async function opponentHasMoved(e) {
            console.log(`callback fired for ${opponent} moving`, e.val());
            //CHANGE canMove IN DB
            await game.child(`${you}`).update({canMove: true});
            //CHANGE canMove IN STATE (should refresh board? Will it reexecute useEffect?🧪)
            setCanMove(true);
        }
        game.child(`${opponent}`).orderByKey().equalTo(`moved`).on('child_changed', opponentHasMoved);
    }
    async function initiateRematch(game, you, opponent) {//probably pass as prop 
        //make db
        if (Math.random() > 0.5) { 
            //userA is black. Black always starts on 2nd position in board. 
            await game.child(`${you}`).set(bigObj.user2); //works
            await game.child(`${opponent}`).set(bigObj.user1); //works
        } else { 
            //userA is white. White always starts on 1st position in board.
            await game.child('${you}').set(bigObj.user1); //works
            await game.child('${opponent}').set(bigObj.user2); //works
        }
        //black goes first
        game.child(`${you}`).orderByKey().on('value', (e) => {
            if (!e.val().white) {
                game.child(`${opponent}`).update({
                    canMove: true
                });
            } else {
                game.child(`${you}`).update({
                    canMove: true
                });
            }
        })
        //setArbitrary(Math.random());
        //console.log(`listening for ${opponent} requesting rematch`);
        //console.log(`callback fired for ${opponent} requesting rematch:`, e.val());
        // async function initiateRematch(e) {
        // }
        // initiateRematch();
        //game.child(`${opponent}`).orderByKey().equalTo(`requestRematch`).on('child_changed', opponentHasRequestedRematch);
    }
    
    useEffect(() => { 
        console.log("running useEffect");
        let game = db.ref(`matches/${authInfo.url}`);
        db.ref('matches').orderByKey().equalTo(`${authInfo.url}`).on('value', (e) => { 
            db.ref('matches').off(); console.log(e.val()); //remove previous listener
            if (e.val()) { 
                //THE GAME EXISTS
                let authListener = auth.onAuthStateChanged(() => { 
                    authListener(); //remove listener
                    if (auth.currentUser) { console.log("authSignedIn");
                        //USER1 1ST TIME OR USER1|2 RETURNING OR INTRUDING
                        if (auth.currentUser.email.includes(`${authInfo.url}`)) { 
                            //USER1 1ST TIME OR USER1|2 RETURNING  
                            setOnForeignMatch(false);
                            if (auth.currentUser.email.includes('user1')) { 
                                //USER1 1ST TIME OR RETURNING
                                game.child(`user1`).orderByKey().on('value', (e) => { 
                                    const user1 = e.val();
                                    game.child(`user1`).off(); console.log(e.val()); //remove listener
                                    if (user1.signedIn) {
                                        //USER1 RETURNING
                                        console.log("user1 returning");
                                        setAuthInfo({...authInfo, user: auth.currentUser.email.includes("user1") ? "user1" : "user2", email: auth.currentUser.email, color: e.val().white ? "white" : "black"});
                                        setPlaying(true); //BOARD IS RENDERED HERE
                                        game.child(`user2/signedIn`).orderByKey().on('value', (e) => {
                                            game.child(`user2/signedIn`).off(); console.log(e.val()); //remove listener
                                            if (e.val()) { 
                                                //USER2 SIGNED IN
                                                //CAN USER1 MOVE?
                                                setCanMove(user1.canMove ? true : false);
                                                setUser2SignedIn(true); console.log("user2 is signed in");
                                                setWaiting(false);
                                            } else { 
                                                //USER2 NOT SIGNED IN YET✅
                                                setWaiting(true); console.log("user2 not signed in");
                                                setUser2SignedIn(false);
                                            }
                                        });
                                    } else { //
                                        //USER1 1ST TIME
                                        console.log("user1 own game first-time");
                                        listenerForUser2SigningIn(game);//✅
                                        listenerForOpponentQuitting(game, "user1", "user2");//
                                        listenerForOpponentMoving(game, "user1", "user2");//
                                        async function next(e) {
                                            //DBuser1SignIn TRUE
                                            await game.child('user1').update({
                                                signedIn: true
                                            })
                                            //if black...
                                            if (!user1.white) { console.log(user1.white);
                                                //you are black
                                                await game.child(`user2`).update({
                                                    canMove: true
                                                })
                                            }
                                            // ARBRITRARILY UPDATE STATE THAT RETRIGGERS current UseEffect CALLBACK to process user1 for a 2nd time.
                                            setArbitrary(Math.random().toFixed(5));
                                        }
                                        next();
                                    }
                                })
                            } else { 
                                //USER2 RETURNING
                                console.log("user2 returning");
                                game.child(`user2`).on('value', (e) => { console.log(`is user2 white?`, e.val());
                                    setAuthInfo({...authInfo, user: auth.currentUser.email.includes("user1") ? "user1" : "user2", email: auth.currentUser.email, color: e.val().white ? "white" : "black"});
                                    setPlaying(true); //BOARD IS RENDERED HERE
                                    setUser2SignedIn(true);
                                    setWaiting(false);
                                    //setCanMove(e.val());
                                });
                            }  
                        } else { 
                            //SIGNED IN USER1|2 INTRUDING
                            console.log("signed in user1|2 intruding");
                            //IS GAME FULL?
                            game.child('user2/signedIn').orderByKey().on('value', (e) => {
                                game.child('user2/signedIn').off(); console.log(e.val()); //remove listener
                                if (e.val()) { 
                                    //game full (user has joined)
                                    setinvalidRoute(true); console.log("game full");//✅
                                } else {
                                    //game not full (user2 hasn't joined yet)
                                    setOnForeignMatch(true); console.log('on foreign match'); 
                                }
                            })
                        }
                    } else { 
                        //USER2 1ST TIME
                        console.log("user2 first time"); 
                        async function next(e) {
                            game.child(`user2`).off(); //remove listener
                            const user2 = e.val();
                            if (user2.signedIn) {
                                //INTRUDING ON ANOTHER GAME (USER2 ALREADY dB SIGNED IN)
                                setinvalidRoute(true); console.log("invalidRoute - user2 db already signed in");
                            } else { 
                                //WE CAN SIGN-IN USER2
                                console.log("signing in user2");
                                //auth sign in
                                await auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL); //might not need it.
                                await auth.createUserWithEmailAndPassword(`${authInfo.url}@user2.com`, `${authInfo.url}`);
                                listenerForOpponentQuitting(game, "user2", "user1");//✅
                                listenerForOpponentMoving(game, "user2", "user1");//✅
                                //db sign in
                                await game.child('user2').update({signedIn: true});
                                if (!user2.white) {
                                    //you are black. Artificially move.
                                    await game.child(`user1`).update({
                                        canMove: true
                                    })
                                }
                                setArbitrary(Math.random().toFixed(5)); //rerun useEffect.
                            }
                        }
                        game.child(`user2`).orderByKey().on('value', next);
                    }; 
                }); //no code should execute after this authListener.
            } else { 
                //THE GAME DOES NOT EXIST
                setPlaying(false);
                setUser2SignedIn(false);
                setWaiting(false);
                setOnForeignMatch(false); 
                setinvalidRoute(true); console.log("invalidRoute");
                // if (opponentQuits) {
                // //BECAUSE OPPONENT QUIT
                // } else {
                // //NOT BECAUSE OPPONENT QUIT
            } 
        }) //no code should execute after this dBListener
    }, [arbitrary]);
    
    return ( 
        <>
            <h4>GameContainer</h4>
            {opponentQuits && <OpponentQuits/>}
            {invalidRoute && <ErrorPage/>}
            {playing && <Exit/>}
            {waiting && <Waiting/>}
            {user2SignedIn && <TurnNotifier turn={canMove}/>}
            {playing && <Board db={db} authInfo={authInfo}/>}
            {playing && <TerminateMatch authInfo={authInfo}/>}
            {onForeignMatch && <TerminateMatchForNewGame intruderInfo={authInfo} setArbitrary={setArbitrary} db={db} auth={auth} firebase={firebase}/>}
            {/* {color && <Test color={color.current}/>} */}
            {/* <button onClick={user2QuitsAndDbDeletes}>Click to make user2 quit and db delete</button>
            <button onClick={user1QuitsAndDbDeletes}>Click to make user1 quit and db delete</button>
            <button onClick={user2Moves}>Click to make user2 'move'</button>
            <button onClick={test.bind("this", "blue", "fish")}>Click to execute 'test'</button>
            <button onClick={makeTestsTrue}>Make test1 and test2 true</button> */}
        </>
    )
}

export default Game



