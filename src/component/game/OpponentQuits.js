import {Link} from 'react-router-dom';
import {useState, useEffect, useRef} from 'react';

function OpponentQuits() { //🐉refactor to use useRef & arbitrarily rerun page (to have UI display updated time)

    let [time, setTime] = useState(5);

    useEffect(() => {
        let timer = setTimeout(() => {
            if (time >= 1) {
                setTime(time - 1);
            } else {
                console.log("done");
                window.location.replace(`/`);
            }
        }, 1000)
        return () => clearTimeout(timer);
    }, );

    return (
        <>
            <div>{time}</div>
            {/* <div>OpponentQuits. Redirecting to Homepage in {time} seconds</div> */}
            <Link to="/">Return to Homepage</Link>
        </>
    )
}

export default OpponentQuits