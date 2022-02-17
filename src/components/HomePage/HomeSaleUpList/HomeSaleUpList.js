import React from 'react';
import products from '../../products';
import { useState } from 'react';
import Item from '../Item/Item';
import { Link } from 'react-router-dom';
import style from './HomeSaleUpList.module.css';
import clsx from 'clsx';
const productsArray = products;
function HomeSaleUpList(props) {
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
        <div className="section">
            <div className={clsx(style.saleOff)}>
                {top4products.map((product, index) => {
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