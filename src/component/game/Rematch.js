import {useState} from 'react';

export default function Rematch({indicateInterestInRematch}) {

    return (
        <>
            <div onClick={indicateInterestInRematch}>Request to user, rematch</div>
        </>
    )
}