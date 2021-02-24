import { returnPieceEmoji } from '../../helper/boardHelp.js';
import { Link } from 'react-router-dom';

function Header() {

    return (
        <>
            <div className="header">
                <a href="https://www.youtube.com/watch?v=h7tQXFXTJ5k&feature=youtu.be" target="_blank">
                    Demonstration
                </a>
                <Link to="/">
                    <img className="piece-image" src={returnPieceEmoji("queen")} />
                    <img className="piece-image" src={returnPieceEmoji("knight")} />
                </Link>
            </div>
        </>
    )
}
export default Header;