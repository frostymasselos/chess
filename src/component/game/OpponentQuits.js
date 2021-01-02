import {Link} from 'react-router-dom';
import {useState, useEffect, useRef} from 'react';
import { unstable_renderSubtreeIntoContainer } from 'react-dom';

function OpponentQuits({cssFunctions, unmountCSSFunctions}) { //refactor so that its a pop-up with everything unclickable behind it

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
        cssFunctions();
        return () => {
            console.log("unmounting");
            unmountCSSFunctions();
        }
    }, []);

    return (
        <>
            <div className="opponent-quits-page-container">
                <p>Opponent quit - returning to homepage in {time.current} seconds</p>
                <Link className="floating-home-button button" to="/">
                    Return to Homepage
                </Link>
            </div>
        </>
    )
}

export default OpponentQuits