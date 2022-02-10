import {
    Link
} from "react-router-dom";
import Icon from "react-hero-icon";
import { useRef, useState } from "react";
import { useEffect } from "react/cjs/react.development";
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
    const mobileMenuButton = useRef();
    const handleMenuButton = () => {
        console.log(mobileMenuButton.current.classList.toggle("active"));

    }

    return (
        <div>
            <header className="header row bg-dark p-x-32">
                <div className="header__logo-container">
                    <div className="mobile-menu-button test-ani" ref={mobileMenuButton} onClick={() => { handleMenuButton() }}>
                        <div className="bar-top">

                        </div>
                        <div className="bar-middle">

                        </div>
                        <div className="bar-bottom">

                        </div>
                    </div>
                    <Link to="" className="header__logo">CLO<span>T</span>HES</Link>
                </div>

                <ul className="header__nav-list row">

                    <li className="nav__item submenu-container"><Link to="/product">Products<Icon icon="chevron-down" className="chevron-down-icon" />
                    </Link>
                        <ul className="submenu bg-dark">
                            {categories.map((category, index) => {
                                return (<li key={index}><Link to={"/category/" + index}>{category.substring(0, 1).toUpperCase() + category.substring(1, category.length)}</Link></li>)
                            })}
                            <li><Link to="/all">All products</Link></li>
                            {/* <li><Link to="/pants">Pants</Link></li>
                            <li><Link to="/shoes">Shoes</Link></li>
                            <li><Link to="/accessories">Accessories</Link></li>
                            <li><Link to="/others">Others</Link></li> */}
                        </ul>
                    </li>
                    <li className="nav__item"><Link to="/new-arrivals">New Arrivals</Link></li>
                    <li className="nav__item"><Link to="/helps">Helps</Link></li>
                    <li className="nav__item"><Link to="/collection">Collection</Link></li>
                    <li className="nav__item"><Link to="/about">About Us</Link></li>
                </ul>
                <div className="row header__right">
                    <Link to="/users" className="header-icon"><Icon icon="user-circle" className="header-icon-svg" /></Link>
                    <Link to="/search" className="header-icon"><Icon icon="search" className="header-icon-svg" /></Link>
                    <Link to="/shopping-bag" className="header-icon shopping-bag-icon"><Icon icon="shopping-bag" className="header-icon-svg" /><span className="bag__count">0</span></Link>
                </div>

            </header >
        </div >
    );
}

export default Header;
