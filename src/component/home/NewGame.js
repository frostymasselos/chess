import firebase from '../../helper/firebase.js';
import {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';

function NewGame(params) {

    let [fiveDC, setFiveDC] = useState('/');
    
    function fBSignIn(params) {
        console.log(5);
    }

    useEffect(() => {
        setFiveDC("12345");
        let db = firebase.database();
        let point = db.ref('matches');
        // point.set(bigObj);
        //when deciding who's white
            //will have to change white property.
            //will have to change colors of indivdual pieces.
            //will have to reverse the king & queen of white player.
        //FBsign
        //update displayName & photoURL
    }, []);
    

    return (
        <>
            <span onClick={fBSignIn}>
            <Link to={fiveDC}>Start new game (link).</Link>
            </span>
        </>
    )
}

export default NewGame;

