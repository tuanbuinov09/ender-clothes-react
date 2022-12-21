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
import { caculateTotalAmountAndPrice, initCart } from "../../features/shoppingBag/shoppingBagSlice";
import { store } from "../../store";
import axios from "axios";
// const input = [//this is what input look likes
//     {
//       "MA_TL": "TL01",
//       "TEN_TL": "Áo",
//       "CAP_TL": 1,
//       "MA_TL_CHA": null,
//       "SanPham": []
//     },
//     {
//       "MA_TL": "TL02",
//       "TEN_TL": "Áo thun",
//       "CAP_TL": 2,
//       "MA_TL_CHA": "TL01",
//       "SanPham": []
//     },
//     {
//       "MA_TL": "TL03",
//       "TEN_TL": "Áo khoác",
//       "CAP_TL": 2,
//       "MA_TL_CHA": "TL01",
//       "SanPham": []
//     },
//     {
//       "MA_TL": "TL04",
//       "TEN_TL": "Quần",
//       "CAP_TL": 1,
//       "MA_TL_CHA": null,
//       "SanPham": []
//     },
//     {
//       "MA_TL": "TL05",
//       "TEN_TL": "Quần kaki",
//       "CAP_TL": 2,
//       "MA_TL_CHA": "TL04",
//       "SanPham": []
//     },
//     {
//       "MA_TL": "TL06",
//       "TEN_TL": "Quần âu",
//       "CAP_TL": 2,
//       "MA_TL_CHA": "TL04",
//       "SanPham": []
//     },
//     {
//       "MA_TL": "TL07",
//       "TEN_TL": "Quần jean",
//       "CAP_TL": 2,
//       "MA_TL_CHA": "TL04",
//       "SanPham": []
//     },
//     {
//       "MA_TL": "TL08",
//       "TEN_TL": "Giày - dép",
//       "CAP_TL": 1,
//       "MA_TL_CHA": null,
//       "SanPham": []
//     },
//     {
//       "MA_TL": "TL09",
//       "TEN_TL": "Phụ kiện",
//       "CAP_TL": 1,
//       "MA_TL_CHA": null,
//       "SanPham": []
//     },
//     {
//       "MA_TL": "TL10",
//       "TEN_TL": "Nón",
//       "CAP_TL": 2,
//       "MA_TL_CHA": "TL09",
//       "SanPham": []
//     },
//     {
//       "MA_TL": "TL11",
//       "TEN_TL": "Thắt lưng",
//       "CAP_TL": 2,
//       "MA_TL_CHA": "TL09",
//       "SanPham": []
//     },
//     {
//       "MA_TL": "TL12",
//       "TEN_TL": "Túi - balo",
//       "CAP_TL": 2,
//       "MA_TL_CHA": "TL09",
//       "SanPham": []
//     },
//     {
//       "MA_TL": "TL13",
//       "TEN_TL": "Áo sơ mi",
//       "CAP_TL": 2,
//       "MA_TL_CHA": "TL01",
//       "SanPham": []
//     },
//     {
//       "MA_TL": "TL14",
//       "TEN_TL": "Áo polo",
//       "CAP_TL": 2,
//       "MA_TL_CHA": "TL01",
//       "SanPham": []
//     },
//     {
//       "MA_TL": "TL15",
//       "TEN_TL": "Áo thu đông",
//       "CAP_TL": 2,
//       "MA_TL_CHA": "TL01",
//       "SanPham": []
//     }
// ]
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
        axios.get(`http://localhost:22081/api/TheLoai`).then(res => {
            const categoriesFromAPI = res.data;
            // console.log(categoriesFromAPI);

            categoriesFromAPI.map((category, index) => {
                let subCategories;
                subCategories = res.data.filter((subCategory, index) => {
                    return subCategory.MA_TL_CHA === category.MA_TL;
                });
                category.subCategories = subCategories;
            })

            // console.log(categoriesFromAPI);

            let categoriesLevel1; // chỉ lấy thể loại cha, trong thể loại cha có thể loại con
            categoriesLevel1 = categoriesFromAPI.filter((category, index) => {
                return category.CAP_TL === 1;
            });

            // console.log(categoriesLevel1);

            setCategories(categoriesLevel1);
        });
    }, []);

    // calculate total amount and price every time you modify bagProducts
    useEffect(() => {
        dispatch(caculateTotalAmountAndPrice());
    }, [bagProducts]);
    useEffect(() => {
        dispatch(initCart(JSON.parse(localStorage.getItem('ccart')) || []));
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
                {/* nested menu */}
                <ul className={clsx(style.nav, style.navList, { [style.active]: showNavListResponsive })}
                    ref={navbar}>
                    {/* <li className={clsx(style.navItem, style.active)}><Link to="/home" onClick={activeLinkStyle}>Home</Link></li> */}
                    <li className={clsx(style.navItem, style.submenuContainer)}>
                        <div className={clsx(style.nowhere)}>Sản phẩm<Icon icon="chevron-down" className={clsx(style.chevronDown)} />
                        </div>
                        <ul className={clsx(style.submenu)} >
                            {
                                categories.map((category, index) => {
                                    let isSubmenuContainer = false;
                                    isSubmenuContainer = category.subCategories.length > 0;

                                    return (
                                        <Link key={index} to={"products/category/" + category.MA_TL} className={clsx(style.navLink, { [style.submenuContainer]: isSubmenuContainer, [style.submenuContainer2]: isSubmenuContainer })}>
                                            {category.TEN_TL.substring(0, 1).toUpperCase() + category.TEN_TL.substring(1, category.TEN_TL.length)}
                                            {isSubmenuContainer
                                                ?
                                                <>
                                                    <Icon icon="chevron-down" className={clsx(style.chevronDownToLeft)} />
                                                    <ul className={clsx(style.submenu2)} >
                                                        {
                                                            category.subCategories.map((subCategory, index) => {
                                                                return (
                                                                    <Link key={index} to={"products/category/" + subCategory.MA_TL} className={clsx(style.navLink)}>
                                                                        {subCategory.TEN_TL.substring(0, 1).toUpperCase() + subCategory.TEN_TL.substring(1, subCategory.TEN_TL.length)}

                                                                    </Link>
                                                                )
                                                            })}

                                                    </ul>
                                                </>
                                                :
                                                <></>}
                                        </Link>
                                    )
                                })}

                            <>
                                {/* <Link to={"products/category/"} className={clsx(style.navLink, style.submenuContainer2)}>
                                           qaaaaaaaaa
                                                    <Icon icon="chevron-down" className={clsx(style.chevronDownToLeft)} />
                                                    <ul className={clsx(style.submenu2)} >
                                                                    <Link to={"products/category/"} className={clsx(style.navLink)}>
                                                                       zzzzzzzzz
                                                                    </Link>
                                                                    <Link to={"products/category/"} className={clsx(style.navLink)}>
                                                                       zzzzzzzzz
                                                                    </Link>
                                                                    <Link to={"products/category/"} className={clsx(style.navLink)}>
                                                                       zzzzzzzzz
                                                                    </Link>
                                                                    <Link to={"products/category/"} className={clsx(style.navLink)}>
                                                                       zzzzzzzzz
                                                                    </Link>
                                                        
                                                    </ul>
                                        </Link> */
                                }</>
                            <Link to="/all" className={clsx(style.navLink, style.lastNavLink)}>Tất cả</Link>
                        </ul>
                    </li>
                    {/* <li className={clsx(style.navItem)}><Link to="/new-arrivals" className={clsx(style.navLink)} onClick={activeLinkStyle}>New Arrivals</Link></li>
                    <li className={clsx(style.navItem)}><Link to="/sale-up" className={clsx(style.navLink)} onClick={activeLinkStyle}>Sale Up</Link></li>
                    <li className={clsx(style.navItem)}><Link to="/helps" className={clsx(style.navLink)} onClick={activeLinkStyle}>Helps</Link></li>
                    <li className={clsx(style.navItem)}><Link to="/about" className={clsx(style.navLink)} onClick={activeLinkStyle}>About Us</Link></li> */}

                    <NavLink to="/new-arrivals" className={clsx(style.navItem)} activeClassName={clsx(style.active)}>Hàng mới về</NavLink>
                    <NavLink to="/sale-off" className={clsx(style.navItem)} activeClassName={clsx(style.active)}>Khuyến mãi</NavLink>
                    {/* <NavLink to="/user/purchased-cart" className={clsx(style.navItem)} activeClassName={clsx(style.active)}>Đơn đã mua</NavLink> */}
                    {/* <NavLink to="/about" className={clsx(style.navItem)} activeClassName={clsx(style.active)}>About Me</NavLink> */}
                    {<NavLink to="/helps" className={clsx(style.navItem)} activeClassName={clsx(style.active)}>Trợ giúp</NavLink>}
                    {<NavLink to="/about" className={clsx(style.navItem)} activeClassName={clsx(style.active)}>About Me</NavLink>}
                </ul >

                <div className={clsx(style.right)} ref={right}>
                    <Link to={"/user/login"} className={clsx(style.iconWrapper)}><Icon icon="user-circle" className={clsx(style.iconSvg)} /></Link>
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
