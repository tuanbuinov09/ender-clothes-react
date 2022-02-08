import {
    Link
} from "react-router-dom";
import legalImage from './assets/img/dang-ky-website-thuong-mai-dien-tu-1024x388-1024x388.png';

function Footer() {
    return (
        <footer className="container footer">
            <div className="footer__wrapper">
                <div className="subscribe">
                    <h2 className="footer__title">SUBSCRIBE TO OUR NEWS</h2>
                    <div className="footer__intput-container">
                        <input type="text" placeholder="Type your email" />
                        <a href="#"><i className="far fa-envelope"></i></a>

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
                    <a href="#" className="footer__img-container"><img
                        src={legalImage} alt="legal" /></a>
                </div>
                <div className="footer__right">
                    <div className="col-third">
                        <h3 className="footer__title">COMPANY</h3>
                        <ul>
                            <li><a href="#"><span>-</span>Introduction</a></li>
                            <li><a href="#"><span>-</span>Hiring</a></li>
                            <li><a href="#"><span>-</span>News</a></li>
                            <li><a href="#"><span>-</span>Customer Services</a></li>
                            <li><a href="#"><span>-</span>Contact</a></li>
                        </ul>
                    </div>
                    <div className="col-third">
                        <h3 className="footer__title">CUSTOMER SERVICES</h3>
                        <ul>
                            <li><a href="#"><span>-</span>Loyalty</a></li>
                            <li><a href="#"><span>-</span>Return Product</a></li>
                            <li><a href="#"><span>-</span>Guarantee</a></li>
                            <li><a href="#"><span>-</span>Privacy</a></li>
                            <li><a href="#"><span>-</span>Question</a></li>
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
