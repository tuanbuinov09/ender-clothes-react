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
import axios from "axios";

function HeaderEmployee(props) {
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
        axios.get(`http://localhost:22081/api/TheLoai`).then(res => {
            const categoriesFromAPI = res.data;
            console.log(categoriesFromAPI);

            categoriesFromAPI.map((category, index) => {
                let subCategories;
                subCategories = res.data.filter((subCategory, index) => {
                    return subCategory.MA_TL_CHA === category.MA_TL;
                });
                category.subCategories = subCategories;
            })

            console.log(categoriesFromAPI);

            let categoriesLevel1; // chỉ lấy thể loại cha, trong thể loại cha có thể loại con
            categoriesLevel1 = categoriesFromAPI.filter((category, index) => {
                return category.CAP_TL === 1;
            });

            console.log(categoriesLevel1);

            setCategories(categoriesLevel1);
        });
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
                {/* nested menu */}
                <ul className={clsx(style.nav, style.navList, { [style.active]: showNavListResponsive })}
                    ref={navbar}>
                    <NavLink to="/admin/dashboard" className={clsx(style.navItem)} activeClassName={clsx(style.active)}>Tổng quan</NavLink>

                    {/* <li className={clsx(style.navItem, style.active)}><Link to="/home" onClick={activeLinkStyle}>Home</Link></li> */}
                    {JSON.parse(localStorage.getItem('employee')) && JSON.parse(localStorage.getItem('employee')).MA_NV
                        && JSON.parse(localStorage.getItem('employee')).MA_QUYEN !== 'Q04' ? <li className={clsx(style.navItem, style.submenuContainer)}>
                        <div className={clsx(style.nowhere)}>Quản lý<Icon icon="chevron-down" className={clsx(style.chevronDown)} />
                        </div>
                        <ul className={clsx(style.submenu)} >
                            {JSON.parse(localStorage.getItem('employee')) && JSON.parse(localStorage.getItem('employee')).MA_NV
                                && JSON.parse(localStorage.getItem('employee')).MA_QUYEN === 'Q02' ? <Link to="/admin/customer-management" className={clsx(style.navLink, style.lastNavLink)}>Khách hàng</Link> : <></>}
                            {JSON.parse(localStorage.getItem('employee')) && JSON.parse(localStorage.getItem('employee')).MA_NV
                                && JSON.parse(localStorage.getItem('employee')).MA_QUYEN === 'Q02' ? <Link to="/admin/employee-management" className={clsx(style.navLink, style.lastNavLink)}>Nhân viên</Link> : <></>}

                            <Link to="/admin/product-management" className={clsx(style.navLink, style.lastNavLink)}>Sản phẩm</Link>
                            <Link to="/admin/product-price-management" className={clsx(style.navLink, style.lastNavLink)}>Thay đổi giá</Link>
                            <Link to="/admin/product-import-management" className={clsx(style.navLink, style.lastNavLink)}>Nhập hàng</Link>
                            <Link to="/admin/product-return-management" className={clsx(style.navLink, style.lastNavLink)}>Trả hàng</Link>
                            <Link to="/admin/sale-off-management" className={clsx(style.navLink, style.lastNavLink)}>Khuyến mãi</Link>
                            <Link to="/admin/size-management" className={clsx(style.navLink, style.lastNavLink)}>Bảng size</Link>
                            <Link to="/admin/color-management" className={clsx(style.navLink, style.lastNavLink)}>Bảng màu</Link>
                        </ul>
                    </li> : <></>
                    }

                    {/* <li className={clsx(style.navItem, style.submenuContainer, style.submenuContainer2)}>
                        <div className={clsx(style.nowhere)}>Danh mục<Icon icon="chevron-down" className={clsx(style.chevronDown)} />
                        </div>
                        <ul className={clsx(style.submenu)} >
                            <Link to="/admin/size-management" className={clsx(style.navLink, style.lastNavLink)}>Bảng size</Link>
                            <Link to="/admin/color-management" className={clsx(style.navLink, style.lastNavLink)}>Bảng màu</Link>
                        </ul>
                    </li> */}
                    {/* <li className={clsx(style.navItem)}><Link to="/new-arrivals" className={clsx(style.navLink)} onClick={activeLinkStyle}>New Arrivals</Link></li>
                    <li className={clsx(style.navItem)}><Link to="/sale-up" className={clsx(style.navLink)} onClick={activeLinkStyle}>Sale Up</Link></li>
                    <li className={clsx(style.navItem)}><Link to="/helps" className={clsx(style.navLink)} onClick={activeLinkStyle}>Helps</Link></li>
                    <li className={clsx(style.navItem)}><Link to="/about" className={clsx(style.navLink)} onClick={activeLinkStyle}>About Us</Link></li> */}

                    <NavLink to="/admin/cart-management" className={clsx(style.navItem)} activeClassName={clsx(style.active)}>Đơn hàng</NavLink>

                    {JSON.parse(localStorage.getItem('employee')) && JSON.parse(localStorage.getItem('employee')).MA_NV
                        && JSON.parse(localStorage.getItem('employee')).MA_QUYEN === 'Q02' ? <NavLink to="/admin/report" className={clsx(style.navItem)} activeClassName={clsx(style.active)}>Báo cáo</NavLink> : <></>}
                    <NavLink to="/helps" className={clsx(style.navItem)} activeClassName={clsx(style.active)}>Trợ giúp</NavLink>
                    <NavLink to="/about" className={clsx(style.navItem)} activeClassName={clsx(style.active)}>About Me</NavLink>
                </ul >

                <div className={clsx(style.right)} ref={right}>
                    <Link to={"/employee/login"} className={clsx(style.iconWrapper)}><Icon icon="user-circle" className={clsx(style.iconSvg)} /></Link>
                    {/* <button className={clsx(style.iconWrapper, style.searchIcon)}
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
                    </button> */}
                    {/* <button className={clsx(style.iconWrapper, style.bagIcon)}
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
                    </button> */}
                </div>

            </header >

            <OverCoat active={overActive} ofNavList={true} />
        </>
    );
}

export default HeaderEmployee;
