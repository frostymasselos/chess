// import bigObj from '../../helper/originalDb.js';
import bigObj from '../../helper/secondDb.js';
// import firebase from '../../helper/firebase.js';
// import "firebase/auth";
import {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';

function NewGame({startNewGame}) {
    
    function executeStartNewGame() {
        startNewGame();
    }
    
    return ( 
        <>
            <div onClick={executeStartNewGame}>Start new game</div>
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

