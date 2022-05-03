import clsx from 'clsx';
import React from 'react';
import style from './ShoppingBagList.module.css';
import Icon from 'react-hero-icon';
import { PlusIcon } from '../../icons';
import Item from '../HomePage/Item/Item';
import { useDispatch, useSelector } from 'react-redux';
import { clearBag } from '../../features/shoppingBag/shoppingBagSlice.js';
import { Button } from '../Button/Button';
function ShoppingBagList(props) {

    const dispatch = useDispatch();

    const { bagProducts, amount, total } = useSelector((store) => {
        return store.shoppingBag;
    })
    console.log(bagProducts, amount, total);
    if (amount < 1) {
        return (
            <div className={clsx(style.list)}>
                <h1>Your bag is currently empty.</h1>
            </div>
        );
    } else if (amount >= 1) {
        return (
            <>
                <div className={clsx(style.list)}>

                    {bagProducts.map((product, index) => {
                        return (<Item key={index} product={product} type="bag-item" />);
                    })}


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
                <p className={clsx(style.totalWrapper)}>Total: <span className={clsx(style.total)}>{total} $</span></p>
                <div>
                    <Button text={"CLEAR ALL"} onClick={() => {
                        dispatch(clearBag());
                    }} />
                </div>
            </>
        );
    }
}

export default ShoppingBagList;