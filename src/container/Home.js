import Instructions from '../element/instructions.js';
import Footer from '../element/footer.js';
import Test from '../component/Test.js';
import NewGame from '../component/home/NewGame.js';
import Reenter from '../component/home/Reenter.js';
import {useState} from 'react';
import {useEffect} from 'react';

function Home(params) {

    let [displayName, changeDisplayName] = useState(false);

    useEffect(() => {
        //if not FBsigned in, sign in.
        if (true) { //if FB displayName truthy, render Reenter. Else render NewGame
            changeDisplayName(false)
        } 
    }, []);
    
    return ( 
        <>
            {"I am HomeContainer"}
            {Instructions()}
            {displayName ? <Reenter></Reenter> : <NewGame></NewGame>}
            {Footer()}
        </>
    )
  
}

export default Home