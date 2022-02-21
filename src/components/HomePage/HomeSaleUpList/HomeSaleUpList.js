import React from 'react';
import Item from '../Item/Item';
import { Link } from 'react-router-dom';
import style from './HomeSaleUpList.module.css';
import clsx from 'clsx';
function HomeSaleUpList({ products }) {
    return (
        <div className="section">
            <div className={clsx(style.itemList)}>
                {products.map((product, index) => {
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