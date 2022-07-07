import {
    Link
} from "react-router-dom";
import React from 'react';
import Icon from 'react-hero-icon';
import style from './Item.module.css';
import clsx from "clsx";
import { MinusIcon, PlusIcon } from "../../../icons";
import { caculateTotalAmountAndPrice, addItem, removeItem, increaseAmount, decreaseAmount } from '../../../features/shoppingBag/shoppingBagSlice.js';
import { useDispatch } from "react-redux";
function Item({ product, type }) {

    const dispatch = useDispatch();

    if (type === 1) {
        return (
            <div className={clsx(style.item, style.type1)} >
                <div className={clsx(style.itemMenu)}>
                    <div className={clsx(style.iconContainer)} title="Add to bag"
                        onClick={() => {
                            dispatch(addItem(product));
                            dispatch(caculateTotalAmountAndPrice());
                        }}><Icon icon="shopping-bag" type="solid" className={clsx(style.iconSvg)} /></div>
                    <div className={clsx(style.iconContainer)} title="Add to favourites" ><Icon icon="heart" type="solid" className={clsx(style.iconSvg)} /></div>
                </div>
                <div>
                    <Link to={`/products/${product.MaSp}`} className={clsx(style.imgContainer)}>
                        <img src={product.HinhAnh} alt={`product:${product.MaSp}`} />

                    </Link>
                    <Link to={`/products/${product.MaSp}`} className={clsx(style.label)}>{product.TenSp}</Link>
                </div>

                <p className={clsx(style.price)}><span>{product.ChiTietSanPham[0].Gia} đ</span></p>
            </div >
        );
    }
    if (type === 2) {
        return (
            <div className={clsx(style.item, style.type2)} >
                <div className={clsx(style.itemMenu)}>
                    <div className={clsx(style.iconContainer)}
                        onClick={() => {
                            dispatch(addItem(product));
                            dispatch(caculateTotalAmountAndPrice());
                        }}><Icon icon="shopping-bag" type="solid" className={clsx(style.iconSvg)} /></div>
                    <div className={clsx(style.iconContainer)}><Icon icon="heart" type="solid" className={clsx(style.iconSvg)} /></div>
                </div>
                <Link to={`/products/${product.id}`} className={clsx(style.imgContainer)}>
                    <img src={product.image} alt="item" />
                </Link>
            </div>
        );
    }
    if (type === 3) {
        return (
            <div className={clsx(style.item, style.type3)}>
                <div className={clsx(style.itemMenu)}>
                    <div className={clsx(style.iconContainer)}><Icon icon="shopping-bag" type="solid" className={clsx(style.iconSvg)} /></div>
                    <div className={clsx(style.iconContainer)}><Icon icon="heart" type="solid" className={clsx(style.iconSvg)} /></div>
                </div>
                <div>
                    <Link to={`/products/${product.id}`} className={clsx(style.imgContainer)}>
                        <img src={product.image} alt="item" />
                    </Link>
                    <Link to={`/products/${product.id}`} className={clsx(style.label)}>{product.name}</Link>
                </div>
                <div>
                    <p className={clsx(style.price)}><span>$ {product.price}</span></p>
                    {/* <div className="add-to-cart-button">Add to cart</div> */}

                </div>

            </div>
        );
    }
    if (type === "bag-item") {
        return (
            <div className={clsx(style.typeBagItem)}>
                <Link to={`/products/${product.id}`} className={clsx(style.imgContainer)}>
                    <img src={product.image} alt="item" />
                </Link>
                <div className={clsx(style.itemDetail)}>
                    <div>
                        <Link to={`/products/${product.id}`} className={clsx(style.label)}>{product.name}</Link>
                        <p className={clsx(style.price)}><span>$ {product.price}</span></p>
                    </div>

                    <div className={clsx(style.inputGroupWrapper)}>
                        <div className={clsx(style.inputGroup)}>
                            <button className={clsx(style.buttonMinus)}
                                onClick={() => {
                                    dispatch(decreaseAmount(product.id));
                                    dispatch(caculateTotalAmountAndPrice());
                                }}>
                                <MinusIcon />
                            </button>
                            {/* <input type="number" step="1" max="99" min="1" value={product.amount} name="quantity" className={clsx(style.quantityField)} /> */}
                            <div className={clsx(style.quantityField)}>{product.amount} </div>

                            <button className={clsx(style.buttonPlus)}
                                onClick={() => {
                                    dispatch(increaseAmount({ id: product.id }));
                                    dispatch(caculateTotalAmountAndPrice());
                                }}>
                                <PlusIcon />
                            </button>
                        </div>
                        <button className={clsx(style.btnDanger)}
                            onClick={() => {
                                dispatch(removeItem(product.id));
                                dispatch(caculateTotalAmountAndPrice());
                            }}>Remove</button>
                    </div>
                </div>
            </div >
        )
    }
}

export default Item;