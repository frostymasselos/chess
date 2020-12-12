import {useState} from 'react';

export default function Rematch({indicateInterestInRematch}) {

    let [waitingForOpponent, setWaitingForOpponent] = useState(false);

    return (
        <>
            <div onClick={indicateInterestInRematch}>Request to user, rematch</div>
        </>
    )
}