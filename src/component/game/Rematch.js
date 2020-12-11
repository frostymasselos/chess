import {useState} from 'react';

export default function Rematch({authInfo, db, auth, firebase, indicateInterestInRematch}) {

    let [waitingForOpponent, setWaitingForOpponent] = useState(false);

    function terminateMatch() {
        async function next() {
            authListener();
            const credential = firebase.auth.EmailAuthProvider.credential(`${authInfo.email}`, `${authInfo.url}`);
            await auth.currentUser.reauthenticateWithCredential(credential);
            //SIGNAL TO OPPONENT QUITTING? WILL OPPONENT'S LISTENER BE ABLE TO DELETE OPPONENTAUTH? IF NOT, PERHAPS THEN THE HONOUS IS ON THE OPPONENT TO QUICKLY DELETE DB
            await db.ref(`matches/${authInfo.url}/${authInfo.user}`).update({
                quit: true
            })
            // DELETE DB (SHOULD TIME ELAPSE BEFORE?)
            await db.ref(`matches/${authInfo.url}`).remove();
            await auth.currentUser.delete();
            // NAV HOME
            window.location.replace('/'); 
        }
        let authListener = auth.onAuthStateChanged(next);
    }

    return (
        <>
            <div onClick={indicateInterestInRematch}>Request to user, rematch</div>
            {/* <div onClick={terminateMatch}>Quit match</div> */}
        </>
    )
}