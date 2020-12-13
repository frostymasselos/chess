import {useState, useEffect} from 'react';
import firebase from '../../helper/firebase.js'; 
import "firebase/auth";
import userEvent from '@testing-library/user-event';

function TerminateMatch({authInfo, db, auth}) {

    function terminateMatch() {
        async function next(params) {
            authListener();
            const credential = firebase.auth.EmailAuthProvider.credential(`${authInfo.email}`, `${authInfo.url}`);
            await auth.currentUser.reauthenticateWithCredential(credential);
            await db.ref(`matches/${authInfo.url}/${authInfo.user}`).update({quit: true});
            await db.ref(`matches/${authInfo.url}`).remove();
            await auth.currentUser.delete();
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