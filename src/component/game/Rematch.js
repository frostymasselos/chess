import { useState } from 'react';

export default function Rematch({ indicateInterestInRematch }) {

    return (
        <>
            <div className="floating-home-button request-rematch-button button" onClick={indicateInterestInRematch}>
                Request rematch
            </div>
        </>
    )
}
//request-rematch-button