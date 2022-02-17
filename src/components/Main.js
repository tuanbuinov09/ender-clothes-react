import Header from "./Header/Header";
import Content from "./Content/Content";
import Footer from "./Footer";
import About from "./AboutPage/About"
import {
    BrowserRouter, Route, Routes,
} from "react-router-dom";
function Main() {
    return (
        <BrowserRouter>
            <div className="main">
                <Header />
                <Routes>
                    <Route path="" element={<Content />} />
                    <Route path="/about" element={<About />} />
                </Routes>

                <Footer />

            </div>
        </BrowserRouter>
    );
}

export default Main;
