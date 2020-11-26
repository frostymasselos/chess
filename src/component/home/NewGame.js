import bigObj from '../../helper/originalDb.js';
import secondBigObj from '../../helper/secondDb.js';
import firebase from '../../helper/firebase.js';
import "firebase/auth";
import {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';

function NewGame(params) {

    // let [code, setcode] = useState('/');
    
    async function startNewGame(params) { //MAYBE THIS SHOULD BELONG IN GAME
        //GENERATE CODE
        let code = '';
        for (let num = 0; num < 6; num++) {
            code += Math.round(Math.random() * 9);
        }
        
        // CREATE NEW GAME IN DB 
        let auth = firebase.auth(); //works
        let db = firebase.database(); //works

        let game = db.ref(`/matches/${code}`)
        game.set(secondBigObj); 
        // db.ref('matches/template2').on('value', e => { //FROM TEMPLATE2 IN DB
        //     game.set(e.val());
        // })
        
        // DECIDE WHO'S WHITE
        if (Math.random() > 0.5) { //if true, authUser1 is black & starts on 2nd position in board. 
            await game.child('user1').set(secondBigObj.user2); //works
            await game.child('user2').set(secondBigObj.user1); //works
            //SIGN USER1 IN
            await auth.createUserWithEmailAndPassword(`${code}@user1Position2.com`, `${code}`);
        } else { //authUser1 is white & starts on 1st position in board.
            //SIGN USER1 IN
            await auth.createUserWithEmailAndPassword(`${code}@user1Position1.com`, `${code}`);
        }

        //NAV TO GAME
        window.location = `/${code}`// nav to url
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

