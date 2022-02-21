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
function Main() {
    const [activeOverCoat, setActiveOverCoat] = useState(false);
    const toggleOverCoat = () => {
        setActiveOverCoat(!activeOverCoat);
    }
    return (

        <BrowserRouter>
            <div className="main">
                <Header activeOverCoat={toggleOverCoat} />
                <div className="container">
                    <Routes>
                        <Route path="" element={<Content />} />
                        {/* <Route path="/home" element={<Content />} /> */}
                        <Route path="/about" element={<About />} />
                    </Routes>
                    <Footer />
                </div>
                <OverCoat active={activeOverCoat} />
                <SideBarComponents />
            </div>
        </BrowserRouter>
    );
}

export default Main;
