import Header from "./Header/Header";
import Content from "./HomePage/Home";
import Footer from "./Footer/Footer";
import About from "./AboutPage/About"
import OverCoat from "./SideBarComponents/OverCoat";
import { useState } from "react";
import {
    BrowserRouter, Route, Routes,
} from "react-router-dom";
import SideBarComponents from "./SideBarComponents/SideBarComponents";
import SearchBox from "./SideBarComponents/SearchBox";
import clsx from "clsx";
import style from "./Main.module.css"
function Main() {
    const [activeOverCoat, setActiveOverCoat] = useState(false);
    const toggleOverCoat = () => {
        setActiveOverCoat(!activeOverCoat);
    }
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
            return <SearchBox
                activeOverCoat={toggleOverCoat}
                pushMain={togglePushMain}
                openSearchBox={handleOpenSearchBox} />;
        }
    }
    return (
        <BrowserRouter>
            <div className={clsx(style.main, { [style.active]: pushMain })}>
                <Header
                    activeOverCoat={toggleOverCoat}
                    openSearchBox={handleOpenSearchBox}
                    pushMain={togglePushMain}
                />
                <div className="container">
                    <Routes>
                        <Route path="" element={<Content />} />
                        {/* <Route path="/home" element={<Content />} /> */}
                        <Route path="/about" element={<About />} />
                    </Routes>
                    <Footer />
                </div>
                <OverCoat active={activeOverCoat} />
                {mountSearchBox()}
                <SideBarComponents />
            </div>
        </BrowserRouter>
    );
}

export default Main;
