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
    
    const changeHeader = (type)=>{
        if(type==="user"){
            setHeaderMode('user')

        }
        if(type==="employee"){
            setHeaderMode('employee')
        }
    }
    return (
        <BrowserRouter>
            <div className={clsx(style.main, { [style.active]: pushMain })}>
                {headerMode==='user'?<><Header
                    toggleSearchBox={handleOpenSearchBox}
                    toggleShoppingBag={handleOpenShoppingBag}
                    pushMain={togglePushMain}
                /></>:<></>}
                {headerMode==='employee'?<><HeaderEmployee
                    
                /></>:<></>}
                <div className={clsx(style.container)}>
                    <Routes>
                        <Route path="" element={<Content />} />
                        <Route path="/admin/cart-management" element={<CartManagement changeHeader={changeHeader}/>} />
                        <Route path="/admin/dashboard" element={<DashBoard changeHeader={changeHeader} />} />
                        <Route path="/admin/report" element={<Report changeHeader={changeHeader} />} />
                        {/* <Route path="/home" element={<Content />} /> */}
                        <Route path="/about" element={<About />} />
                        <Route path="/product/:productId" element={<ProductDetail />} />
                        <Route path="/user/login" element={<Login type="customer" />} />
                        <Route path="/user/sign-up" element={<SignUp />} />
                        <Route path="/user/info" element={<UserInfo />}/>
                        <Route path="/user/purchased-cart" element={<UserPurchasedCart/>} />
                        <Route path="/employee/login" element={<Login type="employee" changeHeader={changeHeader} />} />
                        <Route path="/employee/info" element={<EmpInfo changeHeader={changeHeader} />}/>
                        <Route path="/purchase" element={<PayPal/>}/>
                        <Route path="/purchase/ship-info" element={<ShipInfo/>}/>
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
