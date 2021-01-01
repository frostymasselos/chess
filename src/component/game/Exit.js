import {Link} from 'react-router-dom';

function Exit(params) {
    return (
        <>
            <Link className="exit-game button" to="/">
                Exit
            </Link>
        </>
    )
}

export default Exit