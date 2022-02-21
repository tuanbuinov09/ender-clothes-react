import {
    Link
} from "react-router-dom";
// import legalImage from './dang-ky-website-thuong-mai-dien-tu-1024x388-1024x388.png';
import Icon from "react-hero-icon";
import style from "./Footer.module.css";
import clsx from "clsx";
function Footer() {
    return (
        <footer>
            <div className={clsx(style.wrapper)}>
                <div className={clsx(style.subscribe)}>
                    <h2 className={clsx(style.title)}>SUBSCRIBE TO OUR NEWS</h2>
                    <form className={clsx(style.form)}>
                        <input type="email" placeholder="Type in your email..." className={clsx(style.input)} />
                        <button type='submit' className={clsx(style.btn)}><Icon icon="mail"></Icon></button>

                    </form>
                    <ul className={clsx(style.socials)}>
                        <li><a href="https://www.facebook.com/enderclothes/" target="_blank" rel="noreferrer"><i className={clsx(style.icon, "fab fa-facebook-square")}></i></a></li>
                        <li><a href="https://www.instagram.com/enderclothes/" target="_blank" rel="noreferrer"><i className={clsx(style.icon, "fab fa-instagram-square")}></i></a></li>
                        <li><a href="https://www.twitter.com/enderclothes/" target="_blank" rel="noreferrer"><i className={clsx(style.icon, "fab fa-twitter-square")}></i></a></li>
                    </ul>
                    <p>
                        END_CLOTHES CO,. LTD
                    </p>
                    <p>
                        Tax Number: 16021602
                    </p>
                    <p>
                        Office: 16/02 SomeWhere, SomeWhere District, SomeWhere City
                    </p>

                    {/* <Link to="/nowhere" className="footer__img-container"><img
                        src={legalImage} alt="legal" /></Link> */}
                </div>
                <div className={clsx(style.right)}>
                    <div className={clsx(style.colThird)}>
                        <h3 className={clsx(style.title)}>COMPANY</h3>
                        <ul>
                            <li><Link to="/nowhere" className={clsx(style.navLink)}><span>-</span>Introduction</Link></li>
                            <li><Link to="/nowhere" className={clsx(style.navLink)}><span>-</span>Hiring</Link></li>
                            <li><Link to="/nowhere" className={clsx(style.navLink)}><span>-</span>News</Link></li>
                            <li><Link to="/nowhere" className={clsx(style.navLink)}><span>-</span>Customer Services</Link></li>
                            <li><Link to="/nowhere" className={clsx(style.navLink)}><span>-</span>Contact</Link></li>
                        </ul>
                    </div>
                    <div className={clsx(style.colThird)}>
                        <h3 className={clsx(style.title)}>CUSTOMER SERVICES</h3>
                        <ul>
                            <li><Link to="/nowhere" className={clsx(style.navLink)}><span>-</span>Loyalty</Link></li>
                            <li><Link to="/nowhere" className={clsx(style.navLink)}><span>-</span>Return Product</Link></li>
                            <li><Link to="/nowhere" className={clsx(style.navLink)}><span>-</span>Guarantee</Link></li>
                            <li><Link to="/nowhere" className={clsx(style.navLink)}><span>-</span>Privacy</Link></li>
                            <li><Link to="/nowhere" className={clsx(style.navLink)}><span>-</span>Question</Link></li>
                        </ul>
                    </div>
                    <div className={clsx(style.colThird)}>
                        <h3 className={clsx(style.title)}>STORES INFORMATION</h3>
                        <h3 className={clsx(style.subTitle)}>STORE Nth</h3>
                        <p>16 SomeWhere, SomeWhere District, SomeWhere City</p>
                        <h3 className={clsx(style.subTitle)}>STORE Nth</h3>
                        <p>16 SomeWhere, SomeWhere District, SomeWhere City</p>
                    </div>
                </div>
            </div>
        </footer >
    );
}

export default Footer;
