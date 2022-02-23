import clsx from 'clsx';
import React from 'react';
import style from './ShoppingBagList.module.css';
import Icon from 'react-hero-icon';
function ShoppingBagList(props) {
    return (
        <div className={clsx(style.list)}>
            <>{/* <!-- <div className="cart-list__item">
                        <a href="#" className="item__img-container">
                            <img src="./assets/img/item-9.jpg" alt="item">
                        </a>
                        <div className="item__detail">
                            <a href="#" className="item__label">Product Product Product</a>
                            <p className="item__price">300,000₫</p>
                            <div className="input-group">
                                <input type="button" value="-" className="button-minus" data-field="quantity">
                                    <input type="number" step="1" max="" min="1" value="1" name="quantity" className="quantity-field">
                                        <input type="button" value="+" className="button-plus" data-field="quantity">
                                        </div>
                                        <a href="#" className="btn--danger">Remove</a>
                                    </div>
                            </div>

                            <div className="cart-list__item">
                                <a href="#" className="item__img-container">
                                    <img src="./assets/img/item-9.jpg" alt="item">
                                </a>
                                <div className="item__detail">
                                    <a href="#" className="item__label">Product Product Product</a>
                                    <p className="item__price">300,000₫</p>
                                    <div className="input-group">
                                        <input type="button" value="-" className="button-minus" data-field="quantity">
                                            <input type="number" step="1" max="" min="1" value="1" name="quantity" className="quantity-field">
                                                <input type="button" value="+" className="button-plus" data-field="quantity">
                                                </div>
                                                <a href="#" className="btn--danger">Remove</a>
                                            </div>
                                    </div> --> */}</>
        </div>
    );
}

export default ShoppingBagList;