import React from 'react';
import Item from '../Item/Item';
import { Link } from 'react-router-dom';
import style from './NewArrivalsList.module.css';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import axios from 'axios';
import LoadingAnimation from '../../LoadingAnimation/LoadingAnimation';
import SectionTitle from '../SectionTitle/SectionTitle';
function ItemListWithTitle({ products, type , top}) {
    const [products2, setproducts2] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        // axios.get(`http://localhost:8000/end-clothes/product/`)
        //     .then(res => {
        //         const productsFromApi = res.data;
        //         console.log(productsFromApi);
        //         setproducts2(productsFromApi);
        //     });
        let topToFind;
        if(!top){
            topToFind = '';
        }else{
            topToFind = top;
        }
        console.log(topToFind)
        console.log(`http://localhost:22081/api/SanPham/new-arrivals?top=${topToFind}`)
        setIsLoading(true);
        if (type === 'new-arrivals') {
            try {
                axios.get(`http://localhost:22081/api/SanPham/new-arrivals?top=${topToFind}`).then(res => {
                    const productsFromApi = res.data;
                    // console.log(productsFromApi);
                    setproducts2(productsFromApi);
                    setIsLoading(false);

                });
                // let client = new SanPhamClient(undefined, axios);
                // let result2 = client.newArrivals("0","10");
                // console.log("1: ", result);
                // console.log("2: ", result2);
            } catch (error) {
                console.error(error);
            }
        }
        if (type === 'most-viewed') {
            try {
                axios.get(`http://localhost:22081/api/SanPham/most-viewed?${topToFind}`).then(res => {
                    const productsFromApi = res.data;
                    // console.log(productsFromApi);
                    setproducts2(productsFromApi);
                    setIsLoading(false);
                });

            } catch (error) {
                console.error(error);
            }
        }
        if (type === 'sale-off') {
            try {
                axios.get(`http://localhost:22081/api/SanPham/sale-off?top=${topToFind}`).then(res => {
                    const productsFromApi = res.data;
                    // console.log(productsFromApi);
                    setproducts2(productsFromApi);
                    setIsLoading(false);
                });
            } catch (error) {
                console.error(error);
            }
        }
        if (type === 'best-seller') {
            try {
                axios.get(`http://localhost:22081/api/SanPham/best-seller?top=${topToFind}&month=6`).then(res => {
                    const productsFromApi = res.data;
                    // console.log(productsFromApi);
                    setproducts2(productsFromApi);
                    setIsLoading(false);
                });

            } catch (error) {
                console.error(error);
            }
        }
    }, []);
    return (
        <><SectionTitle title={type==='new-arrivals'?"HÀNG MỚI VỀ":
        type==='best-seller'?"SẢN PHẨM BÁN CHẠY":
        type==='sale-off'?"KHUYẾN MÃI":
        type==='most-viewed'?"ĐƯỢC XEM NHIỀU":""} />
        <div className="section">
            
            {isLoading ? <div className={clsx(style.flex_1, style.list)}>
                <LoadingAnimation />
            </div> : <div className={style.itemList}>
                {products2.map((product, index) => {
                    return (<Item key={index} product={product} type={1} />);
                })}
            </div>}

            {top?<div className={clsx(style.btnContainer)}><Link to={type === 'new-arrivals' ? "/new-arrivals" : type === 'most-viewed' ? "/most-viewed" : type === "sale-off" ? '/sale-off' : type === "best-seller" ? '/best-seller' : {}} className={clsx(style.btn)}>XEM THÊM</Link></div>:<></>}
        </div>
        </>);
}

export default ItemListWithTitle;