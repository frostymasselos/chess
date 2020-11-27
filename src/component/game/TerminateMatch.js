import {Link} from 'react-router-dom';

function TerminateMatch(params) {

    function terminateMatch(params) {
        // window.location = '/';
        // console.log("red");
    }

    return (
        <>
        <div onClick={terminateMatch}> 
        <Link to="/">Terminate match (link)</Link>
        </div>
        </>
    )
}

export default TerminateMatch