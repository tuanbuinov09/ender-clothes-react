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
                    <h2 className={clsx(style.title)}>ĐĂNG KÍ NHẬN TIN TỨC</h2>
                    <form className={clsx(style.form)}>
                        <input type="email" placeholder="Nhập email..." className={clsx(style.input)} />
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
                        Mã số thuế: 16021602
                    </p>
                    <p>
                        Văn phòng: 16/02 Đâu đó, Quận 9, tp Hồ Chí Minh
                    </p>

                    {/* <Link to="/nowhere" className="footer__img-container"><img
                        src={legalImage} alt="legal" /></Link> */}
                </div>
                <div className={clsx(style.right)}>
                    <div className={clsx(style.colThird)}>
                        <h3 className={clsx(style.title)}>CÔNG TY</h3>
                        <ul>
                            <li><Link to="/nowhere" className={clsx(style.navLink)}><span>-</span>Giới thiệu</Link></li>
                            <li><Link to="/nowhere" className={clsx(style.navLink)}><span>-</span>Tuyển dụng</Link></li>
                            <li><Link to="/nowhere" className={clsx(style.navLink)}><span>-</span>Tin tức</Link></li>
                            <li><Link to="/nowhere" className={clsx(style.navLink)}><span>-</span>Chăm sóc khách hàng</Link></li>
                            <li><Link to="/nowhere" className={clsx(style.navLink)}><span>-</span>Liên hệ</Link></li>
                        </ul>
                    </div>
                    <div className={clsx(style.colThird)}>
                        <h3 className={clsx(style.title)}>CHĂM SÓC KH</h3>
                        <ul>
                            <li><Link to="/nowhere" className={clsx(style.navLink)}><span>-</span>Ưu đãi</Link></li>
                            <li><Link to="/nowhere" className={clsx(style.navLink)}><span>-</span>Chính sách trả hàng</Link></li>
                            <li><Link to="/nowhere" className={clsx(style.navLink)}><span>-</span>Đảm bảo chất lượng</Link></li>
                            <li><Link to="/nowhere" className={clsx(style.navLink)}><span>-</span>Chính sách riêng tư</Link></li>
                            <li><Link to="/nowhere" className={clsx(style.navLink)}><span>-</span>Hỏi đáp</Link></li>
                        </ul>
                    </div>
                    <div className={clsx(style.colThird)}>
                        <h3 className={clsx(style.title)}>THÔNG TIN CỬA HÀNG</h3>
                        <h3 className={clsx(style.subTitle)}>STORE Nth</h3>
                        <p>16 Hiệp Phú, Quận 9, tp Hồ Chí Minh</p>
                        <h3 className={clsx(style.subTitle)}>STORE Nth</h3>
                        <p>22 Hiệp Phú, Quận 9, tp Hồ Chí Minh</p>
                    </div>
                </div>
            </div>
        </footer >
    );
}

export default Footer;
