import {Link} from 'react-router-dom';
import {useState} from 'react';

function ErrorPage(params) {

    return (
        <>
            <div>ErrorPage. The match does not exist.</div>
            <Link to="/">Return to Homepage</Link>
        </>
    ) 
}

export default ErrorPage
