import {Link} from 'react-router-dom';

function Header() {//onClick={() => window.location.replace(``)
    return (
        <>
            <div className="header"> 
                <div>
                    <Link to="/">♛</Link><Link to="/">♘</Link>
                </div>
                {/* <span>♖♜</span> */}
            </div>
        </>
    )
}
export default Header;