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
import ProductManagement from "./Admin/Product/ProductManagement";
import ProductDetail from "./ProductDetail/ProductDetail";
import Login from "./Login/Login";
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
    return (
        <BrowserRouter>
            <div className={clsx(style.main, { [style.active]: pushMain })}>
                <Header
                    toggleSearchBox={handleOpenSearchBox}
                    toggleShoppingBag={handleOpenShoppingBag}
                    pushMain={togglePushMain}
                />
                <div className={clsx(style.container)}>
                    <Routes>
                        <Route path="" element={<Content />} />
                        {/* <Route path="/admin/product" element={<ProductManagement />} /> */}
                        {/* <Route path="/home" element={<Content />} /> */}
                        <Route path="/about" element={<About />} />
                        <Route path="/product/:productId" element={<ProductDetail />} />
                        <Route path="/user/login" element={<Login />} />
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
