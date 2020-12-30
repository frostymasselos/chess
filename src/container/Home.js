// import Test from '../component/Test.js';
import bigObj from '../helper/secondDb';
import Header from '../component/home/Header';
import Instructions from '../component/home/Instructions';
import StartNewGame from '../component/home/StartNewGame';
import ResumeGame from '../component/home/ResumeGame';
import TerminateGame from '../component/home/TerminateGame';
import firebase from '../helper/firebase.js'; 
import "firebase/auth";
import {Link} from 'react-router-dom';
import {useState, useEffect, useRef} from 'react';

function Home() {

    const [db, setDb] = useState(firebase.database());
    const [auth, setAuth] = useState(firebase.auth());
    let [notSignedIn, setNotSignedIn] = useState(false);
    let [url, setUrl] = useState('');
    let [user, setUser] = useState('');

    let cssUseEffectFirstTime = useRef(true);

    async function startNewGame() {
        let url = '';
        for (let num = 0; num < 6; num++) {
            url += Math.round(Math.random() * 9);
        }
        
        let game = db.ref(`/matches/${url}`);
        game.set(bigObj); 
        
        // DECIDE WHO'S WHITE
        if (Math.random() > 0.5) { console.log("user1 is black");
            //user1 is black. Black always starts on 2nd position in board. 
            await game.child('user1').set(bigObj.user2); //works
            await game.child(`user1/recentlyReset`).remove();
            await game.child('user2').set(bigObj.user1); //works
            await game.child(`user2/recentlyReset`).set(false);
            //SIGN USER1 IN
            await auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
            await auth.createUserWithEmailAndPassword(`${url}@user1.com`, `${url}`);
        } else { console.log("user1 is white");
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
            //#1 stay on same page & change state
            setNotSignedIn(true);
            setUrl('');
            //#2 manually refresh page
            // window.location.reload();
        }
        let authListener = auth.onAuthStateChanged(next);
    }
    //CSS
    function roundCornersOfButtons() {
        const buttons = Array.from(window.document.querySelectorAll(`.button`)); 
        for (let index = 0; index < buttons.length; index++) {
            const button = buttons[index]; 
            const theClassName = Array.from(button.classList)[0];
            button.style.setProperty(`--${theClassName}-button-height`, `${button.offsetHeight}px`);
        }
    };

    useEffect(() => {
        let authListener = auth.onAuthStateChanged(() => {
            authListener();//removes listener
            if (auth.currentUser) { 
                setUser(auth.currentUser.email.slice(7, 12));
                setUrl(auth.currentUser.email.slice(0, 6));
                setNotSignedIn(false);
            } else {
                setNotSignedIn(true);
            }
        });
    }, []);
    //CSS
    useEffect(() => {
        if (cssUseEffectFirstTime.current) {
            cssUseEffectFirstTime.current = false; return;
        }
        //consistently round corners of buttons
        roundCornersOfButtons(); window.addEventListener('resize', roundCornersOfButtons);
    }, [notSignedIn, url]);
    
    return ( 
        <>
            <div className="home-grid-container">
                {notSignedIn && <Instructions url={url}/>}
                {notSignedIn && <StartNewGame startNewGame={startNewGame}/>}
                {url && <ResumeGame url={url}/>}
                {url && <TerminateGame terminateGame={terminateGame}/>}
            </div>
        </> 
    )
  
}

export default Home;

// useEffect(() => {
//     //creating CSS variables
//     const root = window.document.querySelector(`#root`);
//     //#1 
//     // root.style.setProperty(`--line-height`, `${window.getComputedStyle(root).getPropertyValue(`line-height`)}`);
//     //#2
//     var style = document.createElement('style');
//     style.innerHTML = `
//         #root {
//             --line-height: ${window.getComputedStyle(root).getPropertyValue(`line-height`)};
//         }
//     `;
//     var ref = document.querySelector('script');
//     ref.parentNode.insertBefore(style, ref);
// }, []);