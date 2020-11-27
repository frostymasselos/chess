import Test from '../component/Test.js';
import bigObj from '../helper/secondDb';
import Instructions from '../element/instructions.js';
import NewGame from '../component/home/NewGame.js';
// import Reenter from '../component/home/Reenter.js';
// import RetrieveCode from '../component/home/RetrieveCode.js';
import firebase from '../helper/firebase.js'; 
import "firebase/auth";
import {Link} from 'react-router-dom';
import {useState} from 'react';
import {useEffect} from 'react';

function Home(params) {

    let db = firebase.database(); 
    let auth = firebase.auth();

    let [notSignedIn, setNotSignedIn] = useState(false);
    let [matchUrl, setMatchUrl] = useState('');
    let [user, setUser] = useState('');

    async function startNewGame(params) { //MAYBE THIS SHOULD BELONG IN GAME
        //GENERATE CODE
        let code = '';
        for (let num = 0; num < 6; num++) {
            code += Math.round(Math.random() * 9);
        }
        
        // CREATE NEW GAME IN DB 
        let game = db.ref(`/matches/${code}`);
        game.set(bigObj); 
        // db.ref('matches/template2').on('value', e => { //FROM TEMPLATE2 IN DB
        //     game.set(e.val());
        // })
        
        
        // DECIDE WHO'S WHITE
        if (Math.random() > 0.5) { //if true, authUser1 should be black & start on 2nd position in board. 
            await game.child('user1').set(bigObj.user2); //works
            await game.child('user2').set(bigObj.user1); //works
            //SIGN USER1 IN
            await auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
            await auth.createUserWithEmailAndPassword(`${code}@user1Position2.com`, `${code}`);
            await auth.signInWithEmailAndPassword(`${code}@user1Position2.com`, `${code}`);
        } else { //authUser1 is white & starts on 1st position in board.
            //SIGN USER1 IN
            await auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
            await auth.createUserWithEmailAndPassword(`${code}@user1Position1.com`, `${code}`);
            await auth.signInWithEmailAndPassword(`${code}@user1Position1.com`, `${code}`);
        }
        
        //DBuser1SignIn TRUE?
        await game.child('user1').update({
            signedIn: true
        })
        
        //NAV TO GAME
        window.location = `/${code}`;
    }

    async function terminateGame(params) {
        //SIGNAL TO OPPONENT QUITTING?
        // await db.ref(`matches/${matchUrl}/${user}`).update({
        //     quit: true
        // })
        // DELETE DB (SHOULD TIME ELAPSE BEFORE?)
        await db.ref(`matches/${matchUrl}`).remove();
        // await auth.signInWithEmailAndPassword("691080@user1position1.com", `${matchUrl}`);
        await auth.currentUser.delete();
        // CHANGE STATE
        setNotSignedIn('');
        setMatchUrl('');
        setUser('');
    }

    //RENDER MATCHURL IF USER1|2 FBSIGNEDIN - ELSE RENDER NewGame
    auth.onAuthStateChanged(() => {
        if (auth.currentUser) { 
            setMatchUrl(auth.currentUser.email.slice(0, 6));
            auth.currentUser.email.includes('user1') ? setUser('user1') : setMatchUrl('user2')
            setNotSignedIn(false);
        } else {
            setNotSignedIn(true);
        }
    })

    useEffect(() => {
    }, []);
    
    return ( 
        <>
            <h4>HomeContainer</h4>
            {Instructions()}
            {notSignedIn && <NewGame startNewGame={startNewGame}></NewGame>}
            {matchUrl && <div>Match url: {window.location.origin}/{matchUrl}</div>} 
            {matchUrl && <Link to={`/${matchUrl}`}>Resume Game</Link>}
            {matchUrl && <button onClick={terminateGame}>Terminate Game</button>}
        </> 
    )
  
}

export default Home