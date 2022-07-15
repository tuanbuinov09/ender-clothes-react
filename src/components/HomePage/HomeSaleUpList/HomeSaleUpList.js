import React from 'react';
import Item from '../Item/Item';
import { Link } from 'react-router-dom';
import style from './HomeSaleUpList.module.css';
import { useState, useEffect } from 'react';
import axios from 'axios';
import clsx from 'clsx';
function HomeSaleUpList({ products }) {
    const [saleOff, setSaleOff] = useState([]);
    useEffect(() => {
        // axios.get(`http://localhost:8000/end-clothes/product/`)
        //     .then(res => {
        //         const productsFromApi = res.data;
        //         console.log(productsFromApi);
        //         setproducts2(productsFromApi);
        //     });
        
            try{
                axios.get(`http://localhost:22081/api/SanPham/sale-off?offset=0&limit=4`).then(res => {
                    const saleOffFromApi = res.data;
                     console.log(saleOffFromApi);
                    setSaleOff(saleOffFromApi);
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
            <div className={clsx(style.itemList)}>
                {/* {products.map((product, index) => {
                    if (index === 0 || index === 2) {
                        return (<Item key={index} product={product} type={2} />)
                    } else {
                        return (<Item key={index} product={product} type={3} />)
                    }
                })} */}
                  {saleOff.map((product, index) => {
                    if (index === 0 || index === 2) {
                        return (<Item key={index} product={product} type={2} />)
                    } else {
                        return (<Item key={index} product={product} type={3} />)
                    }
                })}
                <>{/* <div className="sale-off__img-container col-third">
                        <Link to="nowhere" className="item__img-container">
                            <img src="./assets/img/item-1.webp" alt="item" />
                        </Link>
                    </div>
                    <div className="item col-1per5 p-x-16">
                        <Link to="nowhere" className="item__img-container">
                            <img src="./assets/img/item-1.webp" alt="item" />
                        </Link>
                        <Link to="nowhere" className="item__label">Product Product Product</Link>
                        <p className="item__price">300,000₫</p>
                        <Link to="nowhere" className="btn bg-dark">SEE DETAILS</Link>
                    </div>
                    <div className="sale-off__img-container col-third">
                        <Link to="nowhere" className="item__img-container">
                            <img src="./assets/img/item-3.jpg" alt="item" />
                        </Link>
                    </div>
                    <div className="item col-1per5 p-x-16">
                        <Link to="nowhere" className="item__img-container">
                            <img src="./assets/img/item-3.jpg" alt="item" />
                        </Link>
                        <Link to="nowhere" className="item__label">Product Product Product</Link>
                        <p className="item__price">300,000₫</p>
                        <Link to="nowhere" className="btn bg-dark">SEE DETAILS</Link>
                    </div> */}</>
            </div>
            <div className={clsx(style.btnContainer)}><Link to={`/sale-up`} className={clsx(style.btn)}>SEE DETAILS</Link></div>

        </div>
    );
}

export default HomeSaleUpList;