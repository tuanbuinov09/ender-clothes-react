import {
    Link
} from "react-router-dom";
import React from 'react';
import Icon from 'react-hero-icon';
import style from './Item.module.css';
function Item(props) {
    if (props.type === 1) {
        return (
            <div className="item col-1per5 p-x-16">
                <Link to={`/products/${props.product.id}`} className="item__img-container">
                    <img src={props.product.image} alt={`product:${props.product.id}`} />
                </Link>
                <Link to={`/products/${props.product.id}`} className="item__label">{props.product.title}</Link>
                <div className="bottom-of-item-container">
                    <div className="bottom-of-item"><p className="item__price"><span>{props.product.price} $</span> <Link to={`/add-to-bag?productId=${props.product.id}`} className="header-icon shopping-bag-icon"><Icon icon="shopping-bag" className="header-icon-svg" /><b className="plus-text">+</b></Link></p>
                        {/* <div className="add-to-cart-button">Add to cart</div> */}
                    </div>
                </div>
            </div>
        );
    }
    if (props.type === 2) {
        return (
            <div className="item sale-off__img-container col-third">
                <Link to={`/products/${props.product.id}`} className="item__img-container">
                    <img src={props.product.image} alt="item" />
                </Link>
            </div>
        );
    }
    if (props.type === 3) {
        return (
            <div className="item col-1per5 p-x-16">
                <Link to={`/products/${props.product.id}`} className="item__img-container">
                    <img src={props.product.image} alt="item" />
                </Link>
                <Link to={`/products/${props.product.id}`} className="item__label">{props.product.title}</Link>
                <div className="bottom-of-item-container">
                    <div className="bottom-of-item"><p className="item__price"><span>{props.product.price} $</span> <Link to={`/add-to-bag?productId=${props.product.id}`} className="header-icon shopping-bag-icon"><Icon icon="shopping-bag" className="header-icon-svg" /><b className="plus-text">+</b></Link></p>
                        {/* <div className="add-to-cart-button">Add to cart</div> */}
                    </div>
                </div>
                <Link to={`/products/${props.product.id}`} className="btn bg-dark">SEE DETAILS</Link>
            </div>
        );
    }
}

export default Item;