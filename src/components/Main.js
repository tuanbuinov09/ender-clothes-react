import Header from "./Header/Header";
import Content from "./HomePage/Home";
import Footer from "./Footer/Footer";
import About from "./AboutPage/About"
import { useState } from "react";
import {
    BrowserRouter, Route, Routes,
} from "react-router-dom";
import SideBox from "./SideBarComponents/SideBox";
import clsx from "clsx";
import style from "./Main.module.css"
import ProductDetail from "./ProductDetail/ProductDetail";
import Login from "./Login/Login";
import PayPal from "./PayPal/PayPal";
import ShipInfo from "./ShipInfo/ShipInfo";
import CartManagement from "./Admin/Cart/CartManagement";
import UserPurchasedCart from "./Admin/UserPurchasedCart/UserPurchasedCart";
import DashBoard from "./Admin/DashBoard/DashBoard";
import HeaderEmployee from "./Header/HeaderEmployee";
import Report from "./Admin/Report/Report";
import UserInfo from "./UserInfo/UserInfo";
import EmpInfo from "./EmpInfo/EmpInfo";
import SignUp from "./SignUp/SignUp";
import NewArrivalsList from "./HomePage/NewArrivalsList/NewArrivalsList";
import ItemListWithTitle from "./HomePage/NewArrivalsList/ItemListWithTitle";
import ProductManagement from './Admin/ProductManagement/ProductManagement'
import ProductImportManagement from "./Admin/ProductImportManagement/ProductImportManagement";
import ProductReturnManagement from "./Admin/ProductReturnManagement/ProductReturnManagement";
import ProductPriceChangeManagement from "./Admin/ProductPriceChangeManagement/ProductPriceChangeManagement";
import ProductSaleOffManagement from "./Admin/ProductSaleOffManagement/ProductSaleOffManagement";
import ItemListWithTitle2 from "./HomePage/NewListByCategory/ItemListWithTitle2";
import SizeManagement from "./Admin/SizeManagement/SizeManagement";
import ColorManagement from "./Admin/ColorManagement/ColorManagement";
import CustomerManagement from "./Admin/CustomerManagement/CustomerManagement";
import EmployeeManagement from "./Admin/EmployeeManagement/EmployeeManagement";

function Main() {
    const [pushMain, setPushMain] = useState(false);
    const togglePushMain = () => {
        setPushMain(!pushMain);
    }
    const [openSearchBox, setOpenSearchBox] = useState(false);
    const handleOpenSearchBox = () => {
        setOpenSearchBox(!openSearchBox);
    }
    const mountSearchBox = function () {
        if (openSearchBox === true) {
            return <SideBox
                pushMain={togglePushMain}
                toggleSearchBox={handleOpenSearchBox}
                type={"searchBox"} />;
        }
    }

    const [openShoppingBag, setOopenShoppingBag] = useState(false);
    const handleOpenShoppingBag = () => {
        setOopenShoppingBag(!openShoppingBag);
    }
    const mountShoppingBag = function () {
        if (openShoppingBag === true) {
            return <SideBox
                pushMain={togglePushMain}
                toggleShoppingBag={handleOpenShoppingBag} type={"shoppingBag"} />;
        }
    }
    const [headerMode, setHeaderMode] = useState('user');

    const changeHeader = (type) => {
        if (type === "user") {
            setHeaderMode('user');

        }
        if (type === "employee") {
            setHeaderMode('employee');
        }
    }
    return (
        <BrowserRouter>
            <div className={clsx(style.main, { [style.active]: pushMain })}>
                {headerMode === 'user' ? <><Header
                    toggleSearchBox={handleOpenSearchBox}
                    toggleShoppingBag={handleOpenShoppingBag}
                    pushMain={togglePushMain}
                /></> : <></>}
                {headerMode === 'employee' ? <><HeaderEmployee

                /></> : <></>}
                <div className={clsx(style.container)}>
                    <Routes>
                        <Route path="" element={<Content />} />
                        <Route path="/admin/cart-management" element={<CartManagement changeHeader={changeHeader} />} />
                        <Route path="/admin/dashboard" element={<DashBoard changeHeader={changeHeader} />} />
                        <Route path="/admin/product-management" element={<ProductManagement changeHeader={changeHeader} />} />
                        <Route path="/admin/product-import-management" element={<ProductImportManagement changeHeader={changeHeader} />} />
                        <Route path="/admin/product-return-management" element={<ProductReturnManagement changeHeader={changeHeader} />} />
                        <Route path="/admin/product-price-management" element={<ProductPriceChangeManagement changeHeader={changeHeader} />} />
                        <Route path="/admin/sale-off-management" element={<ProductSaleOffManagement changeHeader={changeHeader} />} />
                        <Route path="/admin/size-management" element={<SizeManagement changeHeader={changeHeader} />} />
                        <Route path="/admin/color-management" element={<ColorManagement changeHeader={changeHeader} />} />
                        <Route path="/admin/customer-management" element={<CustomerManagement changeHeader={changeHeader} />} />
                        <Route path="/admin/employee-management" element={<EmployeeManagement changeHeader={changeHeader} />} />
                        <Route path="/admin/report" element={<Report changeHeader={changeHeader} />} />
                        {/* <Route path="/home" element={<Content />} /> */}
                        <Route path="/about" element={<About />} />
                        <Route path="/product/:productId" element={<ProductDetail />} />
                        <Route path="/user/login" element={<Login type="customer" />} />
                        <Route path="/user/sign-up" element={<SignUp />} />
                        <Route path="/user/info" element={<UserInfo />} />
                        <Route path="/user/purchased-cart" element={<UserPurchasedCart />} />
                        <Route path="/employee/login" element={<Login type="employee" changeHeader={changeHeader} />} />
                        <Route path="/employee/info" element={<EmpInfo changeHeader={changeHeader} />} />
                        <Route path="/purchase" element={<PayPal />} />
                        <Route path="/purchase/ship-info" element={<ShipInfo />} />

                        <Route path="/new-arrivals" element={<ItemListWithTitle type="new-arrivals" />} />
                        <Route path="/most-viewed" element={<ItemListWithTitle type="most-viewed" />} />
                        <Route path="/best-seller" element={<ItemListWithTitle type="best-seller" />} />
                        <Route path="/sale-off" element={<ItemListWithTitle type="sale-off" />} />

                        <Route path="/products/category/:categoryId/" element={<ItemListWithTitle2 />} />

                        <Route path="/user/favorite" element={<ItemListWithTitle type="favorite" />} />
                    </Routes>
                    <Footer />
                </div>
                {mountSearchBox()}
                {mountShoppingBag()}
            </div>
        </BrowserRouter>
    );
}

export default Main;
