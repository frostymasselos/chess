import bigObj from '../../helper/originalDb.js';
import secondBigObj from '../../helper/secondDb.js';
import firebase from '../../helper/firebase.js';
import "firebase/auth";
import {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';

function NewGame(params) {

    // let [code, setcode] = useState('/');
    
    function startNewGame(params) { 
        //generate code
        let code = '/';
        for (let num = 0; num < 6; num++) {
            code += Math.round(Math.random() * 9);
        }
        
        let auth = firebase.auth(); //works
        let db = firebase.database(); //works
        
        // FBsignIn - 🐉3 maybe this whole thing should be put in game!
        // auth.createUserWithEmailAndPassword(`${code}@user1.com`, `${code}`).then(cred => {
            //     console.log(cred);
            // })
            
            // let game = db.ref(`/matches/${code}`);
            // create match in DB 
            // db.ref('matches/template').on('value', e => {
            //     game.set(e.val());
            //     //decide who's white
            //     async function makeUserWhiteThenNavToGame(user) { 

            //         //nav to game
            //         // window.location = `${code}`// nav to url
            //     }
            //     if (Math.random() > 0.5) { //if true, user1 is white.
            //         makeWhite("user1");
            //     } else { //user2 is white
            //         makeWhite("user2");
            //     }    
            // })
        // game.set(bigObj); //creates match db with bigObj.



        // console.log(5);
    }

    // useEffect(() => {
    //     setcode(generateCode()); //set code
    // }, []);
    

    return ( 
        <>
            <span onClick={startNewGame}>Start new game</span>
            {/* <Link to={code}>Start new game (link).</Link> */}
        </>
    )
}

export default NewGame;

//CHANGING THE WHOLE DB - NOT THE USER (USES ORIGINAL TEMPLATE)

// //will have to change white property.

// await game.child(`${user}/white`).set(true);

// //will have to change colors of indivdual pieces.

// let piecesPoint = db.ref(`matches/${code}/${user}/pieces`);
// function makePiecesWhite(params) { // loop .set promises and make them async? (cumbersome).

//     db.ref(`matches/049625/user2/pieces`).on('value', e => {
//         let pieces = e.val();
//         for (const piece in pieces) {
//             pieces[piece]["white"] = "wurtle";
//         }
//         console.log(pieces);
//         db.ref(`/matches/049625/user2/pieces`).set(pieces);
//     }) 
// }

// //will have to reverse the king & queen of white player.

