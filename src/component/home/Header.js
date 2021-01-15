import { returnPieceEmoji } from '../../helper/boardHelp.js';
import { Link } from 'react-router-dom';

function Header() {//onClick={() => window.location.replace(``)

    return (
        <>
            <div className="header">
                <Link to="/">
                    {/* <div> */}
                    {/* <span> */}
                    {returnPieceEmoji("pawn")}
                    {/* </span> */}
                    {/* <span> */}
                    {returnPieceEmoji("knight")}
                    {/* </span> */}
                    {/* </div> */}
                </Link>
                {/* <span>♖♜</span> */}
            </div>
        </>
    )
}
export default Header;