import {
    Link
} from "react-router-dom";
import style from './Header.module.css';
import Icon from "react-hero-icon";
import { useEffect, useRef, useState } from "react";
// import { useEffect } from "react/cjs/react.development";
import MobileMenuButton from "./MobileMenuButton/MobileMenuButton";
import clsx from "clsx";
import OverCoat from "../SideBarComponents/OverCoat";

const categoriesArray = [
    {
        id: "C01",
        name: "Top",
        subCategories: [{ id: "C01S01", name: "Shirt" }, { id: "C01S02", name: "Jacket" }]
    },
    {
        id: "C02",
        name: "Bottom",
        subCategories: [{ id: "C02S01", name: "Pant" }, { id: "C02S02", name: "Short" }]
    },
    {
        id: "C03",
        name: "Accessories"
    }
]
function Header(props) {
    const [categories, setCategories] = useState([]);
    useEffect(function () {
        // fetch('https://fakestoreapi.com/products/categories')
        //     .then(res => res.json())
        //     .then(json => setCategories(json));
        setCategories(categoriesArray);
    }, []);
    const [overActive, setOverActive] = useState(false);
    const toggleOverActive = () => {
        setOverActive(!overActive);
    }
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
    const right = useRef();
    useEffect(() => {
        if (showNavListResponsive) { right.current.classList.add(style.hide); }
        else {
            right.current.classList.remove(style.hide);
        }
    }, [showNavListResponsive])

    const mobileButton = useRef();

    return (
        <>
            <header className={clsx(style.header)}>
                <div className={clsx(style.logo_Container)}>
                    <MobileMenuButton
                        showNavListResponsive={toggleShowNavListResponsive}
                        toggleOverCoat={toggleOverActive}
                        ref={mobileButton}
                    />
                    <Link to="" className={style.logo} onClick={activeLinkStyle}>CLO<span>T</span>HES</Link>
                </div>

                <ul className={clsx(style.nav, style.navList, { [style.active]: showNavListResponsive })}
                    ref={navbar}>
                    {/* <li className={clsx(style.navItem, style.active)}><Link to="/home" onClick={activeLinkStyle}>Home</Link></li> */}
                    <li className={clsx(style.navItem, style.submenuContainer)}><div className={clsx(style.navLink, style.nowhere)}>Products<Icon icon="chevron-down" className={clsx(style.chevronDown)} />
                    </div>
                        <ul className={clsx(style.submenu)} >
                            {categories.map((category, index) => {
                                return (
                                    <li key={category.id}>
                                        <Link to={"/category/" + category.id} className={clsx(style.navLink, style.submenuContainer)}>
                                            {category.name.substring(0, 1).toUpperCase() + category.name.substring(1, category.name.length)}
                                        </Link>
                                        {/* {category.subCategories ?
                                            <ul className={clsx(style.subSubmenu)} >
                                                {category.subCategories.map((subCategory, index) => {
                                                    return (<li key={subCategory.id}>
                                                        <Link to={"/category/" + category.id + "/" + subCategory.id}
                                                            className={clsx(style.navLink, style.submenuContainer)}>
                                                            {subCategory.name.substring(0, 1).toUpperCase() + subCategory.name.substring(1, subCategory.name.length)}
                                                        </Link></li>)
                                                })}
                                            </ul>
                                            : <></>} */}
                                    </li>)
                            })}
                            <li><Link to="/all" className={clsx(style.navLink)}>All products</Link></li>
                        </ul>
                    </li>
                    <li className={clsx(style.navItem)}><Link to="/new-arrivals" className={clsx(style.navLink)} onClick={activeLinkStyle}>New Arrivals</Link></li>
                    <li className={clsx(style.navItem)}><Link to="/sale-up" className={clsx(style.navLink)} onClick={activeLinkStyle}>Sale Up</Link></li>
                    <li className={clsx(style.navItem)}><Link to="/helps" className={clsx(style.navLink)} onClick={activeLinkStyle}>Helps</Link></li>
                    <li className={clsx(style.navItem)}><Link to="/about" className={clsx(style.navLink)} onClick={activeLinkStyle}>About Us</Link></li>
                </ul >

                <div className={clsx(style.right)} ref={right}>
                    <Link to="/users" className={clsx(style.iconWrapper)}><Icon icon="user-circle" className={clsx(style.iconSvg)} /></Link>
                    <button className={clsx(style.iconWrapper, style.searchIcon)}
                        onClick={() => {
                            // //neu menu header dang mo thi dong lai
                            // if (showNavListResponsive) {
                            //     mobileButton.current.toggleActive();
                            //     toggleShowNavListResponsive();
                            // }
                            props.toggleSearchBox();
                            props.pushMain();
                        }}>
                        <Icon icon="search" className={clsx(style.iconSvg)} />
                    </button>
                    <button className={clsx(style.iconWrapper, style.bagIcon)}
                        onClick={() => {
                            // if (showNavListResponsive) {
                            //     mobileButton.current.toggleActive();
                            //     toggleShowNavListResponsive();
                            // }
                            props.toggleShoppingBag();
                            props.pushMain();
                        }}>
                        <Icon icon="shopping-bag" className={clsx(style.iconSvg)} />
                        <span className={clsx(style.bagCount)}>0</span>
                    </button>
                </div>

            </header >

            <OverCoat active={overActive} ofNavList={true} />
        </>
    );
}

export default Header;
