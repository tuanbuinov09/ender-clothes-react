import React from 'react';
import Item from '../Item/Item';
import { Link } from 'react-router-dom';
import style from './NewArrivalsList.module.css';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import axios from 'axios'
function NewArrivalsList({ products }) {
    const [products2, setproducts2] = useState([]);
    useEffect(() => {
        // axios.get(`http://localhost:8000/end-clothes/product/`)
        //     .then(res => {
        //         const productsFromApi = res.data;
        //         console.log(productsFromApi);
        //         setproducts2(productsFromApi);
        //     });
            try{
                axios.get(`http://localhost:22081/api/SanPham/new-arrivals?offset=0&limit=10`).then(res => {
                    const productsFromApi = res.data;
                    console.log(productsFromApi);
                    setproducts2(productsFromApi);
                });
                // let client = new SanPhamClient(undefined, axios);
                // let result2 = client.newArrivals("0","10");
                // console.log("1: ", result);
                // console.log("2: ", result2);
                
                        }catch(error){
                console.error(error);
                        }
    }, []);
    return (
        <div className="section">
            <div className={style.itemList}>
                {products2.map((product, index) => {
                    return (<Item key={index} product={product} type={1} />);
                })}
            </div>
            <div className={clsx(style.btnContainer)}><Link to="/new-arrivals" className={clsx(style.btn)}>SHOP NOW</Link></div>
        </div>);
}

export default NewArrivalsList;