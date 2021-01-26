import { returnPieceEmoji } from '../../helper/boardHelp.js';
import { Link } from 'react-router-dom';

function Header() {

    return (
        <>
            <div className="header">
                <Link to="/">
                    <img className="piece-image" src={returnPieceEmoji("queen")} />
                    <img className="piece-image" src={returnPieceEmoji("knight")} />
                </Link>
            </div>
        </>
    )
}
export default Header;