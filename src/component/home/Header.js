import {Link} from 'react-router-dom';

function Header() {//onClick={() => window.location.replace(``)

    return (
        <>
            <div className="header"> 
                <Link to="/">
                    <span>♛</span><span>♘</span>
                </Link>
                {/* <span>♖♜</span> */}
            </div>
        </>
    )
}
export default Header;