import {Link} from 'react-router-dom';
import {useState} from 'react';

function ErrorPage(params) {

    // useState();

    return (
        <>
            <div>ErrorPage</div>
            <Link to="/">Return to Homepage</Link>
        </>
    ) 
}

export default ErrorPage

// {"ErrorPage": "red"}