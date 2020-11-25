import Test from '../component/Test.js';
import Instructions from '../element/instructions.js';
import NewGame from '../component/home/NewGame.js';
// import Reenter from '../component/home/Reenter.js';
// import RetrieveCode from '../component/home/RetrieveCode.js';
import {Link} from 'react-router-dom';
import {useState} from 'react';
import {useEffect} from 'react';

function Home(params) {

    let [matchUrl, setMatchUrl] = useState('');

    useEffect(() => {
        if (false) { //if FB displayName truthy - user1|2 have existing game.
            //retrieve matchURL & render Reenter
            setMatchUrl("12343");
        } else {
            //render NewGame
        }
    }, []);
    
    return ( 
        <>
            <h4>HomeContainer</h4>
            {Instructions()}
            {matchUrl && <div>Match url: {window.location.origin}/{matchUrl}</div>} 
            {matchUrl ? <Link to={matchUrl}>Resume Game</Link> : <NewGame></NewGame>}
        </> 
    )
  
}

export default Home