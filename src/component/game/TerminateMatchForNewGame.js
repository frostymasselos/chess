import {Link} from 'react-router-dom';
import {useState, useEffect} from 'react';
import firebase from '../../helper/firebase.js'; 
import "firebase/auth";

function TerminateMatchForNewGame({url, setArbitrary}) {

    let [matchUrl, setMatchUrl] = useState('');

    let db = firebase.database(); 
    let auth = firebase.auth();

    // function greyInOut(params) {
        //     //execute prop with false arg
        // }
        // //mount executes prop with true arg

    async function terminateMatchForNewGame(params) {
        //SAME AS TERMINATE MATCH
        //SIGNAL TO OPPONENT QUITTING?
        // await db.ref(`matches/${matchUrl}/${user}`).update({
        //     quit: true
        // })
        // DELETE DB (SHOULD TIME ELAPSE BEFORE?)
        await db.ref(`matches/${matchUrl}`).remove();
        // await auth.signInWithEmailAndPassword("691080@user1position1.com", `${matchUrl}`);
        await auth.currentUser.delete();
        // ARBRITRARILY TRIGGER STATE IN GAME
        setArbitrary(Math.random().toFixed(3));
    }
        
    useEffect(() => {
        //get user1's original game url.
        console.log("terminate match for new game", url);
        setMatchUrl(url);
    }, []);

    return (
        <>
            <div>You are currently signed in...A user can only...Would you like to?...</div>
            <button onClick={terminateMatchForNewGame}>Join this game</button>
            <Link to={matchUrl}>Go back to your game</Link>
        </>
    )
}

export default TerminateMatchForNewGame