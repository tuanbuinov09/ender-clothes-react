// import {
//     Link
// } from "react-router-dom";
// import bannerImage from '../assets/img/slider/xmodel_3.png.pagespeed.ic.IuWWDLqA4l.webp';
import { useState } from "react";
import Banner from './Banner/Banner';
// import { useEffect } from "react/cjs/react.development";
import SectionTitle from "./SectionTitle/SectionTitle";
import products from "../products";
import HomeSaleUpList from "./HomeSaleUpList/HomeSaleUpList";
import NewArrivalList from "./NewArrivalList/NewArrivalList";
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
    function compareByRate(a, b) {
        if (a.rating.rate < b.rating.rate) {
            return -1;
        }
        if (a.rating.rate > b.rating.rate) {
            return 1;
        }
        return 0;
    }
    const [top4products, setTop4products] = useState(productsArray.sort(compareByRate).slice(0, 4));
    return (

        <div className="">
            <Banner />
            <SectionTitle title="new arrivals" />
            <NewArrivalList products={products} />
            <SectionTitle title="Sale up" />
            {/* <h1 className="section section-title">HIGH RATING</h1> */}
            <HomeSaleUpList products={top4products} />
        </div >
    );
}

export default Home;
