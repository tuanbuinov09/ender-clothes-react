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
        axios.get(`http://localhost:8000/end-clothes/product/`)
            .then(res => {
                const productsFromApi = res.data;
                console.log(productsFromApi);
                setproducts2(productsFromApi);
            });
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