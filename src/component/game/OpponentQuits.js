import {Link} from 'react-router-dom';
import {useState, useEffect, useRef} from 'react';
import { unstable_renderSubtreeIntoContainer } from 'react-dom';

function OpponentQuits() { //refactor so that its a pop-up with everything unclickable behind it

    let time = useRef(5);
    let [arbitrarilyRefresh, setArbitrarilyRefresh] = useState(false);

    useEffect(() => {
        //ui
        // const root = document.querySelector(`#root`);
        // root.classList.add(`unclickable`);
        //timer
        let timer = setInterval(() => {
            if (time.current > 1) {
                time.current = time.current - 1;
                setArbitrarilyRefresh(Math.random());
            } else {
                time.current = time.current - 1;
                setArbitrarilyRefresh(Math.random());
                clearInterval(timer);
                console.log("done");
                window.location.replace(`/`);
            }
        }, 1000)
    }, []);

    return (
        <>
            <div>Opponent quit - returning to homepage in {time.current} seconds</div>
            <Link to="/">Return to Homepage</Link>
        </>
    )
}

export default OpponentQuits