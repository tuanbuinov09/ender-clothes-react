import {
    Link
} from "react-router-dom";
import React from 'react';
import Icon from 'react-hero-icon';
import style from './Item.module.css';
import clsx from "clsx";
import { MinusIcon, PlusIcon } from "../../../icons";
function Item({ product, type }) {
    if (type === 1) {
        return (
            <div className={clsx(style.item, style.type1)} >
                <div className={clsx(style.itemMenu)}>
                    <div className={clsx(style.iconContainer)} title="Add to bag" ><Icon icon="shopping-bag" type="solid" className={clsx(style.iconSvg)} /></div>
                    <div className={clsx(style.iconContainer)} title="Add to favourites" ><Icon icon="heart" type="solid" className={clsx(style.iconSvg)} /></div>
                </div>
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
                <div className={clsx(style.itemMenu)}>
                    <div className={clsx(style.iconContainer)}><Icon icon="shopping-bag" type="solid" className={clsx(style.iconSvg)} /></div>
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
                    <Link to={`/products/${product.id}`} className={clsx(style.label)}>{product.title}</Link>
                </div>
                <div>
                    <p className={clsx(style.price)}><span>{product.price} $</span></p>
                    {/* <div className="add-to-cart-button">Add to cart</div> */}

                </div>

            </div>
        );
    }
    if (type === "bag-item") {
        return (<div className={clsx(style.typeBagItem)}>
            <Link to={`/products/${product.id}`} className={clsx(style.imgContainer)}>
                <img src={product.image} alt="item" />
            </Link>
            <div className={clsx(style.itemDetail)}>
                <Link to={`/products/${product.id}`} className={clsx(style.label)}>{product.title}</Link>
                <p className={clsx(style.price)}><span>{product.price} $</span></p>
                <div className={clsx(style.inputGroupWrapper)}>
                    <div className={clsx(style.inputGroup)}>
                        <div className={clsx(style.buttonMinus)}>
                            <MinusIcon />

                        </div>
                        <input type="number" step="1" max="" min="1" value="1" name="quantity" className={clsx(style.quantityField)} />
                        <div className={clsx(style.buttonPlus)}>
                            <PlusIcon />
                        </div>
                    </div>

                    <button className={clsx(style.btnDanger)}>Remove</button>
                </div>
            </div>
        </div>
        )
    }
}

export default Item;