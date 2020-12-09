// import Test from '../component/Test.js';
import bigObj from '../helper/secondDb';
import Instructions from '../element/instructions.js';
import firebase from '../helper/firebase.js'; 
import "firebase/auth";
import {Link} from 'react-router-dom';
import {useState, useEffect} from 'react'; 

function Home() {

    const [db, setDb] = useState(firebase.database());
    const [auth, setAuth] = useState(firebase.auth());
    let [notSignedIn, setNotSignedIn] = useState(false);
    let [url, setUrl] = useState('');
    let [user, setUser] = useState('');

    async function startNewGame() {
        let url = '';
        for (let num = 0; num < 6; num++) {
            url += Math.round(Math.random() * 9);
        }
        
        let game = db.ref(`/matches/${url}`);
        game.set(bigObj); 
        
        // DECIDE WHO'S WHITE
        if (Math.random() > 0.5) { 
            //user1 is black. Black always starts on 2nd position in board. 
            await game.child('user1').set(bigObj.user2); //works
            await game.child('user2').set(bigObj.user1); //works
            //SIGN USER1 IN
            await auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
            await auth.createUserWithEmailAndPassword(`${url}@user1.com`, `${url}`);
        } else { 
            //user1 is white. White always starts on 1st position in board.
            //SIGN USER1 IN
            await auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
            await auth.createUserWithEmailAndPassword(`${url}@user1.com`, `${url}`);
        }
        
        //NAV TO GAME
        window.location.replace(`/${url}`);
    }
    function terminateGame() {
        async function next() {
            authListener();
            const credential = firebase.auth.EmailAuthProvider.credential(`${url}@${user}.com`, `${url}`);
            await auth.currentUser.reauthenticateWithCredential(credential);
            //signal to opponent quitting?
            await db.ref(`matches/${url}/${user}`).update({
                quit: true
            })
            // delete db
            await db.ref(`matches/${url}`).remove();
            await auth.currentUser.delete();
            // change state
            setNotSignedIn(true);
            setUrl('');
        }
        let authListener = auth.onAuthStateChanged(next);
    }
    useEffect(() => {
        let eventListener = auth.onAuthStateChanged(() => {
            eventListener();//removes listener
            if (auth.currentUser) { 
                setUser(auth.currentUser.email.slice(7, 12));
                setUrl(auth.currentUser.email.slice(0, 6));
                setNotSignedIn(false);
            } else {
                setNotSignedIn(true);
            }
        });
    }, []);
    
    return ( 
        <>
            <h4>HomeContainer</h4>
            {Instructions()}
            {notSignedIn && <div onClick={startNewGame}>Start new game</div>}
            {url && <div>Match url: {window.location.origin}/{url}</div>} 
            {url && <Link to={`/${url}`}>Resume Game</Link>}
            {url && <button onClick={terminateGame}>Terminate Game</button>}
        </> 
    )
  
}

export default Home;