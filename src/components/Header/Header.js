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
// const input = [//this is what input look likes
//     {
//       "MaTl": "TL01",
//       "TenTl": "Áo",
//       "CapTl": 1,
//       "MaTlCha": null,
//       "SanPham": []
//     },
//     {
//       "MaTl": "TL02",
//       "TenTl": "Áo thun",
//       "CapTl": 2,
//       "MaTlCha": "TL01",
//       "SanPham": []
//     },
//     {
//       "MaTl": "TL03",
//       "TenTl": "Áo khoác",
//       "CapTl": 2,
//       "MaTlCha": "TL01",
//       "SanPham": []
//     },
//     {
//       "MaTl": "TL04",
//       "TenTl": "Quần",
//       "CapTl": 1,
//       "MaTlCha": null,
//       "SanPham": []
//     },
//     {
//       "MaTl": "TL05",
//       "TenTl": "Quần kaki",
//       "CapTl": 2,
//       "MaTlCha": "TL04",
//       "SanPham": []
//     },
//     {
//       "MaTl": "TL06",
//       "TenTl": "Quần âu",
//       "CapTl": 2,
//       "MaTlCha": "TL04",
//       "SanPham": []
//     },
//     {
//       "MaTl": "TL07",
//       "TenTl": "Quần jean",
//       "CapTl": 2,
//       "MaTlCha": "TL04",
//       "SanPham": []
//     },
//     {
//       "MaTl": "TL08",
//       "TenTl": "Giày - dép",
//       "CapTl": 1,
//       "MaTlCha": null,
//       "SanPham": []
//     },
//     {
//       "MaTl": "TL09",
//       "TenTl": "Phụ kiện",
//       "CapTl": 1,
//       "MaTlCha": null,
//       "SanPham": []
//     },
//     {
//       "MaTl": "TL10",
//       "TenTl": "Nón",
//       "CapTl": 2,
//       "MaTlCha": "TL09",
//       "SanPham": []
//     },
//     {
//       "MaTl": "TL11",
//       "TenTl": "Thắt lưng",
//       "CapTl": 2,
//       "MaTlCha": "TL09",
//       "SanPham": []
//     },
//     {
//       "MaTl": "TL12",
//       "TenTl": "Túi - balo",
//       "CapTl": 2,
//       "MaTlCha": "TL09",
//       "SanPham": []
//     },
//     {
//       "MaTl": "TL13",
//       "TenTl": "Áo sơ mi",
//       "CapTl": 2,
//       "MaTlCha": "TL01",
//       "SanPham": []
//     },
//     {
//       "MaTl": "TL14",
//       "TenTl": "Áo polo",
//       "CapTl": 2,
//       "MaTlCha": "TL01",
//       "SanPham": []
//     },
//     {
//       "MaTl": "TL15",
//       "TenTl": "Áo thu đông",
//       "CapTl": 2,
//       "MaTlCha": "TL01",
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
            console.log(categoriesFromAPI);

            categoriesFromAPI.map((category, index) => {
                let subCategories;
                subCategories = res.data.filter((subCategory, index) => {
                    return subCategory.MaTlCha === category.MaTl;
                });
                category.subCategories = subCategories;
            })

            console.log(categoriesFromAPI);

            let categoriesLevel1; // chỉ lấy thể loại cha, trong thể loại cha có thể loại con
            categoriesLevel1 = categoriesFromAPI.filter((category, index) => {
                return category.CapTl === 1;
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
                    {/* <li className={clsx(style.navItem, style.active)}><Link to="/home" onClick={activeLinkStyle}>Home</Link></li> */}
                    <li className={clsx(style.navItem, style.submenuContainer)}>
                        <div className={clsx(style.nowhere)}>Sản phẩm<Icon icon="chevron-down" className={clsx(style.chevronDown)} />
                        </div>
                        <ul className={clsx(style.submenu)} >
                            {
                                categories.map((category, index) => {
                                    let isSubmenuContainer = false;
                                    isSubmenuContainer = category.subCategories.length > 0;
                                    // console.log(isSubmenuContainer);
                                    return (
                                        <Link key={index} to={"products/category/" + category.MaTl} className={clsx(style.navLink, { [style.submenuContainer]: isSubmenuContainer, [style.submenuContainer2]: isSubmenuContainer })}>
                                            {category.TenTl.substring(0, 1).toUpperCase() + category.TenTl.substring(1, category.TenTl.length)}
                                            {isSubmenuContainer
                                                ?
                                                <>
                                                    <Icon icon="chevron-down" className={clsx(style.chevronDownToLeft)} />
                                                    <ul className={clsx(style.submenu2)} >
                                                        {
                                                            category.subCategories.map((subCategory, index) => {
                                                                return (
                                                                    <Link key={index} to={"products/category/" + subCategory.MaTl} className={clsx(style.navLink)}>
                                                                        {subCategory.TenTl.substring(0, 1).toUpperCase() + subCategory.TenTl.substring(1, subCategory.TenTl.length)}

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
                    <NavLink to="/sale-up" className={clsx(style.navItem)} activeClassName={clsx(style.active)}>Khuyến mãi</NavLink>
                    <NavLink to="/helps" className={clsx(style.navItem)} activeClassName={clsx(style.active)}>Trợ giúp</NavLink>
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
