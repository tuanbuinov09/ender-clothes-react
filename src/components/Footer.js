import {
    Link
} from "react-router-dom";
import legalImage from './assets/img/dang-ky-website-thuong-mai-dien-tu-1024x388-1024x388.png';
import Icon from "react-hero-icon";
function Footer() {
    return (
        <footer className="footer">
            <div className="footer__wrapper">
                <div className="subscribe">
                    <h2 className="footer__title">SUBSCRIBE TO OUR NEWS</h2>
                    <div className="footer__intput-container">
                        <input type="text" placeholder="Type your email" />
                        <Link to="/subscribe"><Icon icon="mail"></Icon></Link>

                    </div>
                    <p>
                        CLOTHES CO,. LTD
                    </p>
                    <p>
                        Tax Number: 124214214
                    </p>
                    <p>
                        Office: 16 SomeWhere, SomeWhere District, SomeWhere City
                    </p>
                    <ul className="socials row">
                        <li><i className="fa fa-facebook-square"></i></li>
                        <li><i className="fa fa-instagram-square"></i></li>
                        <li><i className="fa fa-twitter-square"></i></li>
                    </ul>
                    <Link to="/nowhere" className="footer__img-container"><img
                        src={legalImage} alt="legal" /></Link>
                </div>
                <div className="footer__right">
                    <div className="col-third">
                        <h3 className="footer__title">COMPANY</h3>
                        <ul>
                            <li><Link to="/nowhere"><span>-</span>Introduction</Link></li>
                            <li><Link to="/nowhere"><span>-</span>Hiring</Link></li>
                            <li><Link to="/nowhere"><span>-</span>News</Link></li>
                            <li><Link to="/nowhere"><span>-</span>Customer Services</Link></li>
                            <li><Link to="/nowhere"><span>-</span>Contact</Link></li>
                        </ul>
                    </div>
                    <div className="col-third">
                        <h3 className="footer__title">CUSTOMER SERVICES</h3>
                        <ul>
                            <li><Link to="/nowhere"><span>-</span>Loyalty</Link></li>
                            <li><Link to="/nowhere"><span>-</span>Return Product</Link></li>
                            <li><Link to="/nowhere"><span>-</span>Guarantee</Link></li>
                            <li><Link to="/nowhere"><span>-</span>Privacy</Link></li>
                            <li><Link to="/nowhere"><span>-</span>Question</Link></li>
                        </ul>
                    </div>
                    <div className="col-third">
                        <h3 className="footer__title">STORES INFORMATION</h3>
                        <h3 className="footer__sub-title">STORE Nth</h3>
                        <p>16 SomeWhere, SomeWhere District, SomeWhere City</p>
                        <h3 className="footer__sub-title">STORE Nth</h3>
                        <p>16 SomeWhere, SomeWhere District, SomeWhere City</p>
                    </div>
                </div>
            </div>
        </footer >
    );
}

export default Footer;
