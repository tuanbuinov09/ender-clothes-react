import Header from "./Header/Header";
import Content from "./HomePage/Home";
import Footer from "./Footer/Footer";
import About from "./AboutPage/About"
import {
    BrowserRouter, Route, Routes,
} from "react-router-dom";
function Main() {
    return (
        <BrowserRouter>
            <div className="main">
                <Header />
                <div className="container">
                    <Routes>
                        <Route path="" element={<Content />} />
                        <Route path="/home" element={<Content />} />
                        <Route path="/about" element={<About />} />
                    </Routes>
                    <Footer />
                </div>
            </div>
        </BrowserRouter>
    );
}

export default Main;
