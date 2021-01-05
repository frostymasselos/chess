import {Link} from 'react-router-dom';

function Header() {//onClick={() => window.location.replace(``)

    return (
        <>
            <div className="header"> 
                <Link to="/">
                    <div>
                        <span>♛</span><span>♘</span>
                    </div>
                </Link>
                {/* <span>♖♜</span> */}
            </div>
        </>
    )
}
export default Header;