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
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { caculateTotalAmountAndPrice } from "../../features/shoppingBag/shoppingBagSlice";
import { store } from "../../store";
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
    const amount = useSelector((store) => {
        console.log(store.shoppingBag); // we named shoppingBag for the shoppingBagReducer, see at store.js
        return store.shoppingBag.amount;
    });
    const bagProducts = useSelector((store) => {
        return store.shoppingBag.bagProducts;
    })
    const dispatch = useDispatch();
    //destructuring is ok too
    // const {amount} = useSelector((store) => store.shoppingBag)

    const [categories, setCategories] = useState([]);
    useEffect(function () {
        // fetch('https://fakestoreapi.com/products/categories')
        //     .then(res => res.json())
        //     .then(json => setCategories(json));
        setCategories(categoriesArray);
    }, []);

    // calculate total amount and price every time you modify bagProducts
    useEffect(() => {
        dispatch(caculateTotalAmountAndPrice());
    }, [bagProducts]);

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
                    <li className={clsx(style.navItem, style.submenuContainer)}>
                        <div className={clsx(style.nowhere)}>Products<Icon icon="chevron-down" className={clsx(style.chevronDown)} />
                        </div>
                        <ul className={clsx(style.submenu)} >
                            {categories.map((category, index) => {
                                return (
                                    <Link to={"/category/" + category.id} className={clsx(style.navLink)}>
                                        {category.name.substring(0, 1).toUpperCase() + category.name.substring(1, category.name.length)}
                                    </Link>
                                )
                            })}
                            <Link to="/all" className={clsx(style.navLink)}>All products</Link>
                        </ul>
                    </li>
                    {/* <li className={clsx(style.navItem)}><Link to="/new-arrivals" className={clsx(style.navLink)} onClick={activeLinkStyle}>New Arrivals</Link></li>
                    <li className={clsx(style.navItem)}><Link to="/sale-up" className={clsx(style.navLink)} onClick={activeLinkStyle}>Sale Up</Link></li>
                    <li className={clsx(style.navItem)}><Link to="/helps" className={clsx(style.navLink)} onClick={activeLinkStyle}>Helps</Link></li>
                    <li className={clsx(style.navItem)}><Link to="/about" className={clsx(style.navLink)} onClick={activeLinkStyle}>About Us</Link></li> */}

                    <NavLink to="/new-arrivals" className={clsx(style.navItem)} activeClassName={clsx(style.active)}>New arrivals</NavLink>
                    <NavLink to="/sale-up" className={clsx(style.navItem)} activeClassName={clsx(style.active)}>Sale Up</NavLink>
                    <NavLink to="/helps" className={clsx(style.navItem)} activeClassName={clsx(style.active)}>Helps</NavLink>
                    <NavLink to="/about" className={clsx(style.navItem)} activeClassName={clsx(style.active)}>About Me</NavLink>
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
                        <span className={clsx(style.bagCount)}>{amount}</span>
                    </button>
                </div>

            </header >

            <OverCoat active={overActive} ofNavList={true} />
        </>
    );
}

export default Header;
