import {Link} from 'react-router-dom';

export default function ResumeGame({url}) {
    return (
        <>
            <Link className="resume-game button" to={`/${url}`}>
                Resume Game
            </Link>
        </>
    )
}
