import {Link} from 'react-router-dom';
import {useState, useEffect} from 'react';

function OpponentQuits(params) {

    let [time, setTime] = useState(10);

    useEffect(() => {
        setInterval(() => {
            setTime(time - 1);
        }, 1000)
    }, [])

    useEffect(() => {
        if (time <= 0) {
            window.location.replace(`/`);
        }
    }, [time])

    return (
        <>
        <div>OpponentQuits. Redirecting to Homepage in {time} seconds</div>
        <Link to="/">Return to Homepage</Link>
        </>
    )
}

export default OpponentQuits