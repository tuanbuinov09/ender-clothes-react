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
import mesIMG from '../icons8_facebook_messenger_60px.png';
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

            <button style={{ position: 'fixed', bottom: '12vh', right: '16px', width: 60, height: 60, zIndex: 10, backgroundColor: 'white', appearance: "none", border: '2px solid', borderRadius: '50%', borderColor: '#ff7faa', cursor: 'pointer' }} id="myBtn2" onClick={() => {
                window.open('https://m.me/end.clothes.2022', '_blank');
            }}><img src={mesIMG} title='Chat với END_CLOTHES' width='64px' style={{ marginBottom: -4 }} alt='messenger' /></button>

            <Banner />
            <SectionTitle title="Hàng mới về" />
            <NewArrivalsList products={products} type={'new-arrivals'} top={'10'} />
            <SectionTitle title="Sản phẩm bán chạy" />
            <NewArrivalsList products={products} type={'best-seller'} top={'5'} />
            <SectionTitle title="Được xem nhiều" />
            <NewArrivalsList products={products} type={'most-viewed'} top={'10'} />
            {/* <SectionTitle title="Khuyến mãi" />
            {/* <h1 className="section section-title">HIGH RATING</h1> */}
            {/* <NewArrivalsList products={top4products} type={'sale-off'}/> */}
            <SectionTitle title="Khuyến mãi" />
            {/* <h1 className="section section-title">HIGH RATING</h1> */}
            <HomeSaleUpList products={products} top={'5'} />
        </div >
    );
}

export default Home;
