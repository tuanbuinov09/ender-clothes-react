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
    "Shoes",
    "Accessories"
]
function Header() {
    const [categories, setCategories] = useState(categoriesArray);
    // useEffect(function () {
    //     fetch('https://fakestoreapi.com/products/categories')
    //         .then(res => res.json())
    //         .then(json => setCategories(json));
    // }, []);

    return (
        <div>
            <header className={clsx(style.header)}>
                <div className={clsx(style.logo_Container)}>
                    <MobileMenuButton />
                    <Link to="" className={style.logo}>CLO<span>T</span>HES</Link>
                </div>

                <ul className={clsx(style.nav, style.navList)}>
                    <li className={clsx(style.navItem, style.submenuContainer)}><Link to="/product">Products<Icon icon="chevron-down" className="chevron-down-icon" />
                    </Link>
                        <ul className={clsx(style.submenu)}>
                            {categories.map((category, index) => {
                                return (<li key={index}><Link to={"/category/" + index}>{category.substring(0, 1).toUpperCase() + category.substring(1, category.length)}</Link></li>)
                            })}
                            <li><Link to="/all">All products</Link></li>
                        </ul>
                    </li>
                    <li className={clsx(style.navItem)}><Link to="/new-arrivals">New Arrivals</Link></li>
                    <li className={clsx(style.navItem)}><Link to="/helps">Helps</Link></li>
                    <li className={clsx(style.navItem)}><Link to="/collection">Collection</Link></li>
                    <li className={clsx(style.navItem)}><Link to="/about">About Us</Link></li>
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
