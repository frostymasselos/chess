import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

function ErrorPage({ cssFunctions, unmountCSSFunctions, roundCornersOfButtons }) {

    useEffect(() => {
        cssFunctions();
        return () => {
            console.log("unmounting");
            unmountCSSFunctions();
            // window.removeEventListener('resize', roundCornersOfButtons);✅
        };
    }, []);

    return (
        <>
            <div className="error-page-container">
                <div className="error-page-text-container">
                    <div>
                        <h1>404 Error</h1>
                        <p>The match does not exist or is in use.</p>
                    </div>
                </div>
                <Link className="floating-home-button button" to="/">
                    Return Home
                </Link>
            </div>
        </>
    )
}

export default ErrorPage
