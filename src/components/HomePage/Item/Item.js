import {
    Link
} from "react-router-dom";
import React from 'react';
// import Icon from 'react-hero-icon';
import style from './Item.module.css';
import clsx from "clsx";
function Item({ product, type }) {
    if (type === 1) {
        return (
            <div className={clsx(style.item, style.type1)} >
                <div>
                    <Link to={`/products/${product.id}`} className={clsx(style.imgContainer)}>
                        <img src={product.image} alt={`product:${product.id}`} />
                    </Link>
                    <Link to={`/products/${product.id}`} className={clsx(style.label)}>{product.title}</Link>
                </div>

                <p className={clsx(style.price)}><span>{product.price} $</span></p>
            </div >
        );
    }
    if (type === 2) {
        return (
            <div className={clsx(style.item, style.type2)} >
                <Link to={`/products/${product.id}`} className={clsx(style.imgContainer)}>
                    <img src={product.image} alt="item" />
                </Link>
            </div>
        );
    }
    if (type === 3) {
        return (
            <div className={clsx(style.item, style.type3)}>
                <div>
                    <Link to={`/products/${product.id}`} className={clsx(style.imgContainer)}>
                        <img src={product.image} alt="item" />
                    </Link>
                    <Link to={`/products/${product.id}`} className={clsx(style.label)}>{product.title}</Link>
                </div>
                <div>
                    <p className={clsx(style.price)}><span>{product.price} $</span></p>
                    {/* <div className="add-to-cart-button">Add to cart</div> */}

                </div>

            </div>
        );
    }
}

export default Item;