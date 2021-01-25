import { returnPieceEmoji } from '../../helper/boardHelp.js';
import { Link } from 'react-router-dom';

function Header() {//onClick={() => window.location.replace(``)

    return (
        <>
            <div className="header">
                <Link to="/">
                    {/* <div> */}
                    {/* <span> */}

                    {/* {returnPieceEmoji("pawn")} */}
                    <img className="piece-image" src={returnPieceEmoji("queen")} />

                    {/* </span> */}
                    {/* <span> */}

                    {/* {returnPieceEmoji("knight")} */}
                    <img className="piece-image" src={returnPieceEmoji("knight")} />

                    {/* </span> */}
                    {/* </div> */}
                </Link>
                {/* <span>♖♜</span> */}
            </div>
        </>
    )
}
export default Header;