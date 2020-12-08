import {useState, useEffect} from 'react';
import firebase from '../../helper/firebase.js'; 
import "firebase/auth";
import userEvent from '@testing-library/user-event';

function TerminateMatch({authInfo}) {
    
    let db = firebase.database(); 
    let auth = firebase.auth();

    function terminateMatch() {
        async function next(params) {
            authListener();
            const credential = firebase.auth.EmailAuthProvider.credential(`${authInfo.authCode}@${authInfo.authUser}.com`, `${authInfo.authCode}`);
            await auth.currentUser.reauthenticateWithCredential(credential);
            // console.log("auth.currentUser", auth.currentUser); //console.log("am terminating match");
            //SIGNAL TO OPPONENT QUITTING? WILL OPPONENT'S LISTENER BE ABLE TO DELETE OPPONENTAUTH? IF NOT, PERHAPS THEN THE HONOUS IS ON THE OPPONENT TO QUICKLY DELETE DB
            await db.ref(`matches/${authInfo.authCode}/${authInfo.authUser}`).update({
                quit: true
            })
            // DELETE DB (SHOULD TIME ELAPSE BEFORE?)
            await db.ref(`matches/${authInfo.authCode}`).remove();
            await auth.currentUser.delete();
            // auth.signOut();
            // NAV HOME
            window.location.replace('/'); 
        }
        let authListener = auth.onAuthStateChanged(next);
    }

    return (
        <>
        <div onClick={terminateMatch}>Terminate match (link)</div>
        </>
    )
}

export default TerminateMatch