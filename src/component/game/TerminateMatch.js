import {useState, useEffect} from 'react';
import firebase from '../../helper/firebase.js'; 
import "firebase/auth";

function TerminateMatch({authInfo}) {
    
    let db = firebase.database(); 
    let auth = firebase.auth();

    async function terminateMatch() {
        //SIGNAL TO OPPONENT QUITTING? WILL OPPONENT'S LISTENER BE ABLE TO DELETE OPPONENTAUTH? IF NOT, PERHAPS THEN THE HONOUS IS ON THE OPPONENT TO QUICKLY DELETE DB
        await db.ref(`matches/${authInfo.authCode}/${authInfo.authUser}`).update({
            quit: true
        })
        // DELETE DB (SHOULD TIME ELAPSE BEFORE?)
        await db.ref(`matches/${authInfo.authCode}`).remove();
        await auth.currentUser.delete();
        // NAV HOME
        window.location.replace('/'); 
    }
        
    // useEffect(() => {
    // }, []);

    return (
        <>
        <div onClick={terminateMatch}>Terminate match (link)</div>
        </>
    )
}

export default TerminateMatch