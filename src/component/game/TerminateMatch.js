import {useState, useEffect} from 'react';
import firebase from '../../helper/firebase.js'; 
import "firebase/auth";

function TerminateMatch({url}) {

    let [matchUrl, setMatchUrl] = useState('');
    
    let db = firebase.database(); 
    let auth = firebase.auth();
    
    function terminateMatch(params) {
        // window.location = '/';
        // console.log("red");
    }

    async function terminateMatch() {
        async function next(params) {
            authListener();
            //SIGNAL TO OPPONENT QUITTING? WILL OPPONENT'S LISTENER BE ABLE TO DELETE OPPONENTAUTH? IF NOT, PERHAPS THEN THE HONOUS IS ON THE OPPONENT TO QUICKLY DELETE DB
            let user = ""
            auth.currentUser.email.includes("user1") ? user = "user1" : user = "user2";
            await db.ref(`matches/${matchUrl}/${user}`).update({
                quit: true
            })
            // DELETE DB (SHOULD TIME ELAPSE BEFORE?)
            await db.ref(`matches/${matchUrl}`).remove();
            await auth.currentUser.delete();
            // NAV HOME
            window.location.replace('/'); 
        }
        let authListener = auth.onAuthStateChanged(next);
    }
        
    useEffect(() => {
        //get user1's original game url.
        // console.log("terminate match for new game", url);
        setMatchUrl(url);
    }, []);

    return (
        <>
        <div onClick={terminateMatch}>Terminate match (link)</div>
        </>
    )
}

export default TerminateMatch