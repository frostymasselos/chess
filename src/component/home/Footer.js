import githubPNG from '../../asset/images/github_white.png';
import githubSVG from '../../asset/images/github_black.svg';
import soPNG from '../../asset/images/so.png';
import LinkedInPNG from '../../asset/images/linkedin.png'

function Footer(params) {
    return (
        <>
            <div className="footer">
                <div className="footer-info">
                    <p>
                        Created by Ryan Frost.<br></br>e: ryanfrost2015@gmail.com.
                    </p>
                </div>
                <div className="icons">
                    <a href="https://github.com/frostymasselos" target="_blank">
                        <img src={githubPNG} className="github-img" />
                    </a>
                    <a href="https://stackoverflow.com/users/14037283/tonitone120?tab=summary" target="_blank">
                        <img src={soPNG} className="so-image" />
                    </a>
                    <a href="https://rhcp.com" target="_blank">
                        <img src={LinkedInPNG} className="linked-image" />
                    </a>
                </div>
            </div>
        </>
    )
}

export default Footer;