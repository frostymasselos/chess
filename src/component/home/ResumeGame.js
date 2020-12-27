import {Link} from 'react-router-dom';

export default function ResumeGame({url}) {
    return (
        <>
            <div className="resume-game">
                <Link to={`/${url}`}>
                    Resume Game
                </Link>
            </div>
        </>
    )
}
