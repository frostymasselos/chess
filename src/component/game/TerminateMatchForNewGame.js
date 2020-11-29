import {Link} from 'react-router-dom';
import {useState, useEffect} from 'react';
import firebase from '../../helper/firebase.js'; 
import "firebase/auth";

function TerminateMatchForNewGame({nativeUrl, intruderInfo, setArbitrary}) {

    let db = firebase.database(); 
    let auth = firebase.auth();

    async function backToIntruderGame(params) {
        window.location.replace(`/${intruderInfo.intruderCode}`); //Using `Link` to nav to new url doesn't 'update' Game.
    }

    async function terminateMatchForNewGame(params) {
        //SAME AS TERMINATE MATCH EXCEPT DONT NAV HOME: UPDATE PAGE.
        //SIGNAL TO OPPONENT QUITTING? WILL OPPONENT'S LISTNER BE ABLE TO DELETE OPPONENTAUTH? IF NOT, PERHAPS THEN THE HONOUS IS ON THE OPPONENT TO QUICKLY DELETE DB
        await db.ref(`matches/${intruderInfo.intruderCode}/${intruderInfo.intruderUser}`).update({
            quit: true
        })
        //DELETE INTRUDER DB
        await db.ref(`matches/${intruderInfo.intruderCode}`).remove();
        //DELETE INTRUDER AUTH
        await auth.currentUser.delete();
        //ARBRITRARILY TRIGGER STATE IN GAME
        setArbitrary(Math.random().toFixed(3));
    }
        
    useEffect(() => {
        console.log("terminate match for new game:", nativeUrl);
    }, []);

    return (
        <>
            <div>You are currently signed in...A user can only...Would you like to?...</div>
            <button onClick={backToIntruderGame}>Go back to your game</button>
            <button onClick={terminateMatchForNewGame}>Join this game</button>
        </>
    )
}

export default TerminateMatchForNewGame