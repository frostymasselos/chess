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
import Rematch from '../component/game/Rematch.js';
import firebase from '../helper/firebase.js'; 
import "firebase/auth";

function Game({params}) {

    //presentational
    let [invalidRoute, setInvalidRoute] = useState(false);
    let [playing, setPlaying] = useState(false);
    let [canMove, setCanMove] = useState(false);
    let [user2SignedIn, setUser2SignedIn] = useState(false);
    let [waiting, setWaiting] = useState(false);
    let [onForeignMatch, setOnForeignMatch] = useState(false);
    let [opponentQuits, setOpponentQuits] = useState(false);
    let [winner, setWinner] = useState('');
    let [askForRematch, setAskForRematch] = useState('');
    let [waitingForOpponentToConfirmRematch, setWaitingForOpponentToConfirmRematch] = useState('');

    //retrigger useEffects
    let [arbitrary, setArbitrary] = useState(false);  
    let [triggerBoardUseEffect, setTriggerBoardUseEffect] = useState(``);
    
    //info
    let authInfo = useRef({url: params.slice(1)});
    const [auth, setAuth] = useState(firebase.auth()); //refactor to be useRef? Then put the function in useEffect?🐉 
    const [db, setDb] = useState(firebase.database());

    function turnAllPresentationalStateOnOrOffApartFrom(boolean, ...exceptions) { //as a string  
        const allSetStates = {setInvalidRoute, setPlaying, setCanMove, setUser2SignedIn, setWaiting, setOnForeignMatch, setOpponentQuits, setWinner, setAskForRematch, setWaitingForOpponentToConfirmRematch};
        const positiveArray = [];
        const negativeArray = [];
        for (const key in allSetStates) {
            for (const item of exceptions) {
                if (key !== item) {
                    positiveArray.push(allSetStates[key]); 
                } else {
                    negativeArray.push(allSetStates[key]);
                }
            }
        };
        positiveArray.forEach((item) => item.call(null, boolean)); //console.log(positiveArray, negativeArray);
        negativeArray.forEach((item) => item.call(null, !boolean)); //console.log(negativeArray);
    }
    function listenerForUser2SigningIn(game) {
        console.log(`listening for user2 signing in`);
        async function user2SignInHasChanged(e) {
            game.child(`user2`).off('child_changed', user2SignInHasChanged);//console.log(`callback fired for user2 signing in`, e.val());
            setWaiting(false); setUser2SignedIn(true);//setArbitrary(Math.random());//do we need this?
        }
        game.child(`user2`).orderByKey().equalTo(`signedIn`).on('child_changed', user2SignInHasChanged);
    }
    function listenerForOpponentQuitting(game, you, opponent) {
        console.log(`${you} listening for ${opponent} quitting`);
        async function opponentHasQuit(e) { console.log("callback executed for opponent ");
            game.child(`${opponent}`).off('child_changed', opponentHasQuit);//remove listener
            const credential = firebase.auth.EmailAuthProvider.credential(`${authInfo.current.email}`, `${authInfo.current.email.slice(0, 6)}`);
            await auth.currentUser.reauthenticateWithCredential(credential);
            await auth.currentUser.delete();
            game.remove();
            turnAllPresentationalStateOnOrOffApartFrom(false, "setOpponentQuits");//setOpponentQuits(true);
        }
        game.child(`${opponent}`).orderByKey().equalTo('quit').on('child_changed', opponentHasQuit);
    }
    function listenerForOpponentMoving(game, you, opponent) {
        console.log(`listening for ${opponent} moving`);
        async function opponentHasMoved(e) { console.log(`callback fired for ${opponent} moving`, e.val());
            await game.child(`${you}`).update({canMove: true});
            setCanMove(true); setTriggerBoardUseEffect(Math.random()); //only need use canMove?
        }
        game.child(`${opponent}`).orderByKey().equalTo(`moved`).on('child_changed', opponentHasMoved);
    }
    function listenerForWinner(game, you) { 
        console.log(`${you} listening for player winning`);
        async function endGame(e) { console.log("ending game");
            game.off('child_changed', endGame);//remove listener
            setWinner(e.val());
            setCanMove(false);
            await game.child(`${you}`).update({canMove: false});
            setAskForRematch(true);
        }
        db.ref(`matches/${authInfo.current.url}`).orderByKey().equalTo(`winner`).on('child_changed', endGame);
    }
    async function endGame(game, user, winner) {
        //game.orderByKey().equalTo(`winner`).off();//remove listener
        setAskForRematch(true);
        setWinner(winner);
        setCanMove(false);
        game.child(`${user}`).update({canMove: false});
    }
    async function indicateInterestInRematch() { console.log(`${authInfo.current.user} indicating interest in rematch`);
        await db.ref(`matches/${authInfo.current.url}/${authInfo.current.user}`).update({rematch: true});
        setAskForRematch(false); setWaitingForOpponentToConfirmRematch(true);
    }
    function listenerForRematch(game, you, opponent) { 
        console.log(`${you} listening for rematch`);
        async function seeWhoHasRequestedRematch(e) { console.log("someone has requested rematch");
            await game.orderByKey().on(`value`, (e) => { //game.orderByKey().off();
                if (e.val().user1.rematch && e.val().user2.rematch) { console.log("both players want rematch");
                    game.child(`${you}`).orderByKey().equalTo(`rematch`).off();
                    game.child(`${opponent}`).orderByKey().equalTo(`rematch`).off();
                    restartGame(game); 
                }
            })
        }
        game.child(`${you}`).orderByKey().equalTo(`rematch`).on(`child_changed`, seeWhoHasRequestedRematch);
        game.child(`${opponent}`).orderByKey().equalTo(`rematch`).on(`child_changed`, seeWhoHasRequestedRematch);
    }
    async function restartGame(game) {
        async function next(e) {
            game.child(`user1`).orderByKey().off(); console.log("executing restart game");
            //do same turning off listeners on dbopponent?🐉(test nd see if it'll work) 
            // reset db & decide who's white 
            await game.set(bigObj); //✅
            if (Math.random() > 0.5) { console.log('user1 is black');
                await game.child('user1/pieces').set(bigObj.user2.pieces); 
                await game.child('user2/pieces').set(bigObj.user1.pieces); 
                await game.child(`user1`).update({white: false});
                await game.child(`user2`).update({white: true, canMove: true});
            } else { console.log('user1 is white');
                await game.child('user1/pieces').set(bigObj.user1.pieces); 
                await game.child('user2/pieces').set(bigObj.user2.pieces);
                await game.child(`user1`).update({white: true, canMove: true});
                await game.child(`user2`).update({white: false});
            }
            await game.child(`user1`).update({signedIn: true});
            await game.child(`user2`).update({signedIn: true, recentlyReset: true}); //✅ (listener for user2 signing in IS retriggering mount).
            listenerForOpponentQuitting(game, "user1", "user2");//do we need this?🐉
            listenerForOpponentMoving(game, "user1", "user2");
            listenerForWinner(game, "user1");
            listenerForRematch(game, "user1", "user2");
            setWinner(false); setWaitingForOpponentToConfirmRematch(false);
            //reset state or rerun (get user2 to arbitrarily refresh?)
            setArbitrary(Math.random());
            setTriggerBoardUseEffect(Math.random());
        }
        game.child(`user1`).orderByKey().on(`value`, next); 
    }

    useEffect(() => { console.log("useEffect getting run");
        let game = db.ref(`matches/${authInfo.current.url}`);
        db.ref('matches').orderByKey().equalTo(`${authInfo.current.url}`).on('value', (e) => { 
        db.ref('matches').off(); console.log(e.val()); //remove previous listener
            if (e.val()) { 
                //THE GAME EXISTS
                const match = e.val()[authInfo.current.url]; const user1 = match.user1; const user2 = match.user2; //console.log("match:", match, "user1:", user1, "user2:", user2);
                let authListener = auth.onAuthStateChanged(() => { 
                    authListener(); //remove listener
                    if (auth.currentUser) { //console.log("authSignedIn");
                        //USER1 1ST TIME OR USER1|2 RETURNING OR INTRUDING
                        authInfo.current = {...authInfo.current, user: auth.currentUser.email.includes("user1") ? "user1" : "user2", email: auth.currentUser.email};
                        if (auth.currentUser.email.includes(`${authInfo.current.url}`)) { 
                            //USER1 1ST TIME OR USER1|2 RETURNING  
                            setOnForeignMatch(false);
                            if (auth.currentUser.email.includes('user1')) { 
                                //USER1 1ST TIME OR RETURNING
                                if (user1.signedIn) {
                                    //USER1 RETURNING
                                    console.log("user1 returning");
                                    if (match.winner) { console.log("mount recognises winner");
                                        endGame(game, "user1", match.winner);
                                        if (user1.rematch) {
                                            setWaitingForOpponentToConfirmRematch(true);
                                            setAskForRematch(false);
                                        }
                                    }
                                    listenerForUser2SigningIn(game);//✅
                                    listenerForOpponentQuitting(game, "user1", "user2");
                                    listenerForOpponentMoving(game, "user1", "user2");
                                    listenerForWinner(game, "user1");
                                    listenerForRematch(game, "user1", "user2");
                                    authInfo.current = {...authInfo.current, color: user1.white ? "white" : "black"};
                                    setCanMove(user1.canMove ? true : false); setPlaying(true); //BOARD IS RENDERED HERE
                                    if (user2.signedIn) { 
                                        //USER2 SIGNED IN
                                        setUser2SignedIn(true); console.log("user2 is signed in");
                                        setWaiting(false);
                                    } else { 
                                        //USER2 NOT SIGNED IN YET✅
                                        setWaiting(true); console.log("user2 not signed in");
                                        setUser2SignedIn(false);
                                    }
                                } else { //
                                    //USER1 1ST TIME
                                    console.log("user1 own game first-time");
                                    (async function next(e) {
                                        //if black...
                                        if (!user1.white) {
                                            await game.child(`user2`).update({canMove: true});
                                        }
                                        await game.child('user1').update({signedIn: true});
                                        // ARBRITRARILY UPDATE STATE THAT RETRIGGERS current UseEffect CALLBACK to process 'user1 for a 2nd time'.
                                        setArbitrary(Math.random().toFixed(5));
                                    })();
                                }
                            } else { 
                                //USER2 RETURNING
                                console.log("user2 returning");
                                if (match.winner) { console.log("mount recognises winner");
                                    endGame(game, "user2", match.winner);
                                    if (user2.rematch) {
                                        setWaitingForOpponentToConfirmRematch(true);
                                        setAskForRematch(false);
                                    }
                                }
                                listenerForOpponentQuitting(game, "user2", "user1");//✅
                                listenerForOpponentMoving(game, "user2", "user1");//✅
                                listenerForWinner(game, "user2");
                                authInfo.current = {...authInfo.current, color: user2.white ? "white" : "black"};
                                setCanMove(user2.canMove ? true : false);
                                setPlaying(true); //BOARD IS RENDERED HERE
                                setUser2SignedIn(true);
                                setWaiting(false);
                                if (user2.recentlyReset) {
                                    game.child(`user2`).update({recentlyReset: false});
                                    // listenerForWinner(game, "user2");
                                    // listenerForOpponentQuitting(game, "user2", "user1");
                                    // listenerForOpponentMoving(game, "user2", "user1"); 
                                }
                            }  
                        } else { 
                            //SIGNED IN USER1|2 INTRUDING 
                            console.log("signed in user1|2 intruding");
                            //IS GAME FULL?
                            if (user2.signedIn) {
                                turnAllPresentationalStateOnOrOffApartFrom(false, "setInvalidRoute");//setInvalidRoute(true); console.log("game full");//✅
                            } else {
                                turnAllPresentationalStateOnOrOffApartFrom(false, "setOnForeignMatch");//setOnForeignMatch(true); console.log('on foreign match'); 
                            }
                        }
                    } else { 
                        //USER2 1ST TIME
                        console.log("user2 first time"); 
                        if (user2.signedIn) {
                            //INTRUDING ON ANOTHER GAME (USER2 ALREADY dB SIGNED IN)
                            turnAllPresentationalStateOnOrOffApartFrom(false, "setInvalidRoute");//setInvalidRoute(true); console.log("invalidRoute - user2 db already signed in");
                        } else { console.log("signing in user2");
                            (async function name(params) {
                                //WE CAN SIGN-IN USER2
                                //auth sign in
                                await auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL); //might not need it.
                                await auth.createUserWithEmailAndPassword(`${authInfo.current.url}@user2.com`, `${authInfo.current.url}`);
                                //db sign in
                                if (!user2.white) {
                                    //you are black. Allow user1 to move.
                                    await game.child(`user1`).update({canMove: true});
                                }
                                await game.child('user2').update({signedIn: true});
                                setArbitrary(Math.random().toFixed(5)); //rerun useEffect.
                            })();
                        }
                    }; 
                }); //no code should execute after this authListener.
            } else { 
                //THE GAME DOES NOT EXIST
                //is user auth signedIn?
                turnAllPresentationalStateOnOrOffApartFrom(false, "setInvalidRoute");
                // setPlaying(false);
                // setUser2SignedIn(false);
                // setWaiting(false);
                // setOnForeignMatch(false); 
                // setInvalidRoute(true); console.log("invalidRoute");
                // if (opponentQuits) {
                // //BECAUSE OPPONENT QUIT
                // } else {
                // //NOT BECAUSE OPPONENT QUIT
            } 
        });
    }, [arbitrary]);

    return ( 
        <>
            <h4>GameContainer</h4>
            {waitingForOpponentToConfirmRematch && <div>Waiting for opponnent to confirm rematch</div>}
            {askForRematch && <Rematch indicateInterestInRematch={indicateInterestInRematch}/>}
            {winner && <div>{winner} wins</div>}
            {opponentQuits && <OpponentQuits/>}
            {invalidRoute && <ErrorPage/>}
            {playing && <Exit/>}
            {waiting && <Waiting/>}
            {user2SignedIn && <TurnNotifier canMove={canMove}/>}
            {playing && <Board db={db} authInfo={authInfo.current} canMove={canMove} setCanMove={setCanMove} setUser2SignedIn={setUser2SignedIn} triggerBoardUseEffect={triggerBoardUseEffect}/>}
            {playing && <TerminateMatch authInfo={authInfo.current} db={db} auth={auth}/>}
            {onForeignMatch && <TerminateMatchForNewGame intruderInfo={authInfo.current} setArbitrary={setArbitrary} db={db} auth={auth} firebase={firebase}/>}
        </>
    )
}

export default Game





