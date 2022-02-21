import {
    Link
} from "react-router-dom";
import style from './Header.module.css';
import Icon from "react-hero-icon";
import { useRef, useState } from "react";
// import { useEffect } from "react/cjs/react.development";
import MobileMenuButton from "./MobileMenuButton/MobileMenuButton";
import clsx from "clsx";

const categoriesArray = [
    "Top",
    "Bottom",
    "Set",
    "Accessories"
]
function Header(props) {
    const [categories, setCategories] = useState(categoriesArray);
    // useEffect(function () {
    //     fetch('https://fakestoreapi.com/products/categories')
    //         .then(res => res.json())
    //         .then(json => setCategories(json));
    // }, []);
    const navbar = useRef();
    const activeLinkStyle = (e) => {
        // console.log(navbar.current);
        const links = navbar.current.childNodes;
        for (var i = 0; i < links.length; i++) {
            links[i].classList.remove(style.active);
        }
        e.target.parentNode.classList.add(style.active);
    }

    const [showNavListResponsive, setShowNavListResponsive] = useState(false);
    const toggleShowNavListResponsive = () => {
        setShowNavListResponsive(!showNavListResponsive);
    }

    return (
        <div>
            <header className={clsx(style.header)}>
                <div className={clsx(style.logo_Container)}>
                    <MobileMenuButton showNavListResponsive={toggleShowNavListResponsive} activeOverCoat={props.activeOverCoat} />
                    <Link to="" className={style.logo} onClick={activeLinkStyle}>CLO<span>T</span>HES</Link>
                </div>

                <ul className={clsx(style.nav, style.navList, { [style.active]: showNavListResponsive })} ref={navbar}>
                    {/* <li className={clsx(style.navItem, style.active)}><Link to="/home" onClick={activeLinkStyle}>Home</Link></li> */}
                    <li className={clsx(style.navItem, style.submenuContainer)}><div className={clsx(style.navLink, style.nowhere)}>Products<Icon icon="chevron-down" className={clsx(style.chevronDown)} />
                    </div>
                        <ul className={clsx(style.submenu)} >
                            {categories.map((category, index) => {
                                return (<li key={index}><Link to={"/category/" + index} className={clsx(style.navLink)}>{category.substring(0, 1).toUpperCase() + category.substring(1, category.length)}</Link></li>)
                            })}
                            <li><Link to="/all" className={clsx(style.navLink)}>All products</Link></li>
                        </ul>
                    </li>
                    <li className={clsx(style.navItem)}><Link to="/new-arrivals" className={clsx(style.navLink)} onClick={activeLinkStyle}>New Arrivals</Link></li>
                    <li className={clsx(style.navItem)}><Link to="/sale-up" className={clsx(style.navLink)} onClick={activeLinkStyle}>Sale Up</Link></li>
                    <li className={clsx(style.navItem)}><Link to="/helps" className={clsx(style.navLink)} onClick={activeLinkStyle}>Helps</Link></li>
                    <li className={clsx(style.navItem)}><Link to="/about" className={clsx(style.navLink)} onClick={activeLinkStyle}>About Us</Link></li>
                </ul >

                <div className={clsx(style.right)}>
                    <Link to="/users" className={clsx(style.iconWrapper)}><Icon icon="user-circle" className={clsx(style.iconSvg)} /></Link>
                    <Link to="/search" className={clsx(style.iconWrapper)}><Icon icon="search" className={clsx(style.iconSvg)} /></Link>
                    <Link to="/shopping-bag" className={clsx(style.iconWrapper, style.bagIcon)}><Icon icon="shopping-bag" className={clsx(style.iconSvg)} /><span className={clsx(style.bagCount)}>0</span></Link>
                </div>

            </header >
        </div >
    );
}

export default Header;
