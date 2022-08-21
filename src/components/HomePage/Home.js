// import {
//     Link
// } from "react-router-dom";
// import bannerImage from '../assets/img/slider/xmodel_3.png.pagespeed.ic.IuWWDLqA4l.webp';
import { useState } from "react";
import Banner from './Banner/Banner';
// import { useEffect } from "react/cjs/react.development";
import SectionTitle from "./SectionTitle/SectionTitle";
import products from "../../products.js";
import HomeSaleUpList from "./HomeSaleUpList/HomeSaleUpList";
import NewArrivalsList from "./NewArrivalsList/NewArrivalsList";
const productsArray = products;

function Home() {
    const [products, setProducts] = useState(productsArray);

    // function compareByRate(a, b) {
    //     if (a.rating.rate < b.rating.rate) {
    //         return -1;
    //     }
    //     if (a.rating.rate > b.rating.rate) {
    //         return 1;
    //     }
    //     return 0;
    // }
    // const [top4products, setTop4products] = useState(productsArray.sort(compareByRate).slice(0, 4));
    return (

        <div className="">
            <Banner />
            <SectionTitle title="Hàng mới về" />
            <NewArrivalsList products={products} type={'new-arrivals'} />
            <SectionTitle title="Sản phẩm bán chạy" />
            <NewArrivalsList products={products} type={'best-seller'} />
            <SectionTitle title="Được xem nhiều" />
            <NewArrivalsList products={products} type={'most-viewed'} />
            {/* <SectionTitle title="Khuyến mãi" />
            {/* <h1 className="section section-title">HIGH RATING</h1> */}
            {/* <NewArrivalsList products={top4products} type={'sale-off'}/> */}
            <SectionTitle title="Khuyến mãi" />
            {/* <h1 className="section section-title">HIGH RATING</h1> */}
            <HomeSaleUpList products={products} />
        </div >
    );
}

export default Home;
