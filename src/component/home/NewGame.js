import bigObj from '../../helper/db.js';
import firebase from '../../helper/firebase.js';
import "firebase/auth";
import {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';

function NewGame(params) {

    // let [code, setcode] = useState('/');

    function generateCode(params) {
        let code = '/';
        for (let num = 0; num < 6; num++) {
            code += Math.round(Math.random() * 9);
        }
        return code;
    }
    
    function startNewGame(params) { 
        let code = generateCode();
        let auth = firebase.auth(); //works
        let db = firebase.database(); //works
        // point.set(bigObj);

        //FBsignIn
        // auth.createUserWithEmailAndPassword(`${code}@user1.com`, `${code}`).then(cred => {
        //     console.log(cred);
        // })

        db.ref('matches').set(bigObj);

        //create match in DB - how can we assign template outside callback?
        // db.ref().child('matches/color').set("red"); //try it with just '.ref()'.
        // let point = db.ref('matches/template');
        // point.on('value', e => {
        //     let template = e.val();
            
        // })
        // let template = 5;
            //when deciding who's white
                //will have to change white property.
                //will have to change colors of indivdual pieces.
                //will have to reverse the king & queen of white player.

        // window.location = `${code}`// nav to url
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

