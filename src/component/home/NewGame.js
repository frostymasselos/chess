import {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';

function NewGame(params) {

    let [fiveDC, setFiveDC] = useState('/');
    
    function fBSignIn(params) {
        console.log(5);
    }

    useEffect(() => {
        setFiveDC("12345");
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

