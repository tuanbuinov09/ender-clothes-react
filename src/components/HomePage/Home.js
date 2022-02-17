import {
    Link
} from "react-router-dom";
// import bannerImage from '../assets/img/slider/xmodel_3.png.pagespeed.ic.IuWWDLqA4l.webp';
import { useState } from "react";
import Item from './Item/Item';
import Banner from './Banner/Banner';
// import { useEffect } from "react/cjs/react.development";
import Icon from "react-hero-icon";
import SectionTitle from "./SectionTitle/SectionTitle";
import products from "../products";
import HomeSaleUpList from "./HomeSaleUpList/HomeSaleUpList";
const productsArray = products;
function Home() {
    const [products, setProducts] = useState(productsArray);
    // useEffect(function () {
    //     fetch('https://fakestoreapi.com/products?limit=10')
    //         .then(res => res.json())
    //         .then(json => setProducts(json));
    // }, []);

    // useEffect(function () {
    //     fetch('https://fakestoreapi.com/products')
    //         .then(res => res.json())
    //         .then((json) => {
    //             setTop2products(json.sort(compareByRate).slice(0, 2));
    //         });
    // }, []);
    // console.log(top2products);

    return (
        <div className="">
            <Banner />
            <SectionTitle title="new arrivals" />
            <div className="section">
                <div className="new-arrivals item__list row">
                    {products.map((product, index) => {
                        return (<Item key={index} product={product} type={1} />);
                    })}
                </div>
                <div className="section__btn-container"><Link to="/new-arrivals" className="btn bg-dark">SHOP NOW</Link></div>
            </div>
            <SectionTitle title="Sale up" />
            {/* <h1 className="section section-title">HIGH RATING</h1> */}
            <HomeSaleUpList />
        </div >
    );
}

export default Home;
