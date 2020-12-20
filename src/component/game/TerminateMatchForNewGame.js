import {Link} from 'react-router-dom';
import {useState, useEffect, useRef} from 'react';

function TerminateMatchForNewGame({intruderInfo, setArbitrary, db, auth, firebase}) { 

    const intruderUrl = useRef(intruderInfo.email.slice(0, 6));
    
    async function backToIntrudersGame() { //console.log(intruderInfo.url);
        window.location.replace(`/${intruderUrl.current}`); //using `Link` to nav to new url doesn't 'update' Game. Try arbitrarily refresh?🐉
    }
    function terminateMatchForNewGame() { //same as TerminateMatch except don't nav home: update page.
        async function next() {
            authListener();
            const credential = firebase.auth.EmailAuthProvider.credential(`${intruderInfo.email}`, `${intruderUrl.current}`);
            await auth.currentUser.reauthenticateWithCredential(credential);
            await db.ref(`matches/${intruderUrl.current}/${intruderInfo.user}`).update({quit: true});
            await db.ref(`matches/${intruderUrl.current}`).remove();
            await auth.currentUser.delete();
            //ARBRITRARILY TRIGGER STATE IN GAME
            setArbitrary(Math.random());
        }
        let authListener = auth.onAuthStateChanged(next);
    }
    return (
        <>
            <div>You are currently signed in...A user can only...Would you like to?...</div>
            <button onClick={backToIntrudersGame}>Go back to your game</button>
            <button onClick={terminateMatchForNewGame}>Join this game</button>
        </>
    )
}

export default TerminateMatchForNewGame