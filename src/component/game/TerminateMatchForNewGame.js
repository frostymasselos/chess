import {Link} from 'react-router-dom';
import {useState, useEffect, useRef} from 'react';

function TerminateMatchForNewGame({intruderInfo, setArbitrary, db, auth, firebase}) { 

    async function backToIntrudersGame() {
        window.location.replace(`/${intruderInfo.email.slice(0, 6)}`); //Using `Link` to nav to new url doesn't 'update' Game.
    }
    function terminateMatchForNewGame() { //SAME AS TERMINATE MATCH EXCEPT DONT NAV HOME: UPDATE PAGE.
        async function next() {
            authListener();
            const intruderGameUrl = intruderInfo.email.slice(0, 6);
            const credential = firebase.auth.EmailAuthProvider.credential(`${intruderInfo.email}`, `${intruderGameUrl}`);
            await auth.currentUser.reauthenticateWithCredential(credential);
            //SIGNAL TO OPPONENT QUITTING?
            await db.ref(`matches/${intruderGameUrl}/${intruderInfo.user}`).update({
                quit: true
            })
            //DELETE INTRUDER DB
            await db.ref(`matches/${intruderGameUrl}`).remove();
            //DELETE INTRUDER AUTH
            await auth.currentUser.delete();
            //ARBRITRARILY TRIGGER STATE IN GAME
            setArbitrary(Math.random().toFixed(3));
        }
        let authListener = auth.onAuthStateChanged(next);
    }
        
    // useEffect(() => {
    //     console.log("terminate match for new game:", intruderInfo);
    // }, []);

    return (
        <>
            <div>You are currently signed in...A user can only...Would you like to?...</div>
            <button onClick={backToIntrudersGame}>Go back to your game</button>
            <button onClick={terminateMatchForNewGame}>Join this game</button>
        </>
    )
}

export default TerminateMatchForNewGame