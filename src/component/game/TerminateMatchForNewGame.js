import { Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';

function TerminateMatchForNewGame({ intruderInfo, setArbitrary, db, auth, firebase, cssFunctions, unmountCSSFunctions }) {

    const intruderUrl = useRef(intruderInfo.email.slice(0, 6));

    async function backToIntrudersGame() {
        window.location.replace(`/${intruderUrl.current}`);//even though you nav to a different url, using `Link` to nav doesn't 'update' Game. Try arbitrarily refresh?🐉
    }
    function terminateMatchForNewGame() {
        async function next() {
            authListener();
            const credential = firebase.auth.EmailAuthProvider.credential(`${intruderInfo.email}`, `${intruderUrl.current}`);
            await auth.currentUser.reauthenticateWithCredential(credential);
            await db.ref(`matches/${intruderUrl.current}/${intruderInfo.user}`).update({ quit: true });
            await db.ref(`matches/${intruderUrl.current}`).remove();
            await auth.currentUser.delete();
            //ARBRITRARILY TRIGGER STATE IN GAME
            setArbitrary(Math.random());
        }
        let authListener = auth.onAuthStateChanged(next);
    }

    useEffect(() => {
        cssFunctions();
        return () => {
            console.log("unmounting");
            unmountCSSFunctions();
        };
    }, []);

    return (
        <>
            <div className="quit-match-for-new-game-container">
                <div>
                    <p>You have navigated to a new game. A user can only play in one game.</p>
                </div>
                <div className="floating-home-button button" onClick={backToIntrudersGame}>
                    Go back to your game
                </div>
                <div className="floating-home-button button warning-button" onClick={terminateMatchForNewGame}>
                    Join this game<br></br>(WARNING: this deletes current game)
                </div>
            </div>
        </>
    )
}

export default TerminateMatchForNewGame