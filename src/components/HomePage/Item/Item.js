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
import { intToVNDCurrencyFormat } from "../../../uitilities/utilities";
function Item({ product, type }) {

    const dispatch = useDispatch();
    let pricesString;
    let discountPricesString;
    let prices = product.GIA_STR.split(" - ");
    prices = prices.map((price) => {// 
        return parseInt(price);// chuyenr sang int để dùng toLocaleString bên dưới
    })
    console.log(typeof (prices[0]))
    if (!prices[1]) {// nếu k có giá thứ 2 (bắt trường hợp sản phẩm chỉ có free size)
        pricesString = prices[0].toLocaleString('it-IT', { style: 'currency', currency: 'VND' }) + "";
        pricesString = pricesString.substring(0, pricesString.length - 4) + " ₫";
    } else {
        let prices1 = prices[0].toLocaleString('it-IT', { style: 'currency', currency: 'VND' }) + "";
        prices1 = prices1.substring(0, prices1.length - 4);
        let prices2 = prices[1].toLocaleString('it-IT', { style: 'currency', currency: 'VND' }) + "";
        prices2 = prices2.substring(0, prices2.length - 4);
        pricesString = prices1
            + " - " + prices2 + " ₫";
    }
    let discountPrices;

    if (product.GIA_STR_DA_GIAM) {
        discountPrices = product.GIA_STR_DA_GIAM.split(" - ");
        discountPrices = discountPrices.map((price) => {
            return parseInt(price);// chuyenr sang int để dùng toLocaleString bên dưới
        })
        if (!discountPrices[1]) {// nếu k có giá thứ 2 (bắt trường hợp sản phẩm chỉ có free size)
            discountPricesString = discountPrices[0].toLocaleString('it-IT', { style: 'currency', currency: 'VND' }) + "";
            discountPricesString = discountPricesString.substring(0, discountPricesString.length - 4) + " ₫";
        } else {

            let discountPrices1 = discountPrices[0].toLocaleString('it-IT', { style: 'currency', currency: 'VND' }) + "";
            discountPrices1 = discountPrices1.substring(0, discountPrices1.length - 4);
            let discountPrices2 = discountPrices[1].toLocaleString('it-IT', { style: 'currency', currency: 'VND' }) + "";
            discountPrices2 = discountPrices2.substring(0, discountPrices2.length - 4);
            discountPricesString = discountPrices1
                + " - " + discountPrices2 + " ₫";

            // discountPricesString = discountPrices[0].toLocaleString('it-IT', {style : 'currency', currency : 'VND'}) + " - " + discountPrices[1].toLocaleString('it-IT', {style : 'currency', currency : 'VND'}) + " ₫";
        }
    }

    if (type === 1) {

        return (
            <div className={clsx(style.item, style.type1)} >
                {product.PHAN_TRAM_GIAM > 0 ? <div className={clsx(style.salePercentTag)}>
                    {`- ${product.PHAN_TRAM_GIAM}%`}
                </div> : <></>}
                {product.TONG_SL_TON <= 0 ? <div className={clsx(style.outOfStockTag)}>
                    {`HẾT HÀNG`}
                </div> : <></>}
                <div className={clsx(style.itemMenu)}>
                    <div className={clsx(style.iconContainer)} title="Add to bag"
                        onClick={() => {
                            dispatch(addItem(product));
                            dispatch(caculateTotalAmountAndPrice());
                        }}><Icon icon="shopping-bag" type="solid" className={clsx(style.iconSvg)} /></div>
                    <div className={clsx(style.iconContainer)} title="Add to favourites" ><Icon icon="heart" type="solid" className={clsx(style.iconSvg)} /></div>
                </div>
                <div>
                    <Link to={`/product/${product.MA_SP}`} className={clsx(style.imgContainer)}>
                        <img src={product.HINH_ANH} alt={`product:${product.MA_SP}`} />

                    </Link>
                    <Link to={`/product/${product.MA_SP}`} className={clsx(style.label)}>{product.TEN_SP}</Link>
                </div>
                {discountPricesString ?
                    <><p className={clsx(style.oldPrice)}><span>{pricesString}</span></p>
                        <p className={clsx(style.price)}><span>{discountPricesString}</span></p>
                    </>
                    : <p className={clsx(style.price)}><span>{pricesString}</span></p>}

            </div >
        );
    }
    if (type === 2) {
        return (
            <div className={clsx(style.item, style.type2)} >
                {product.PHAN_TRAM_GIAM > 0 ? <div className={clsx(style.salePercentTag)}>
                    {`- ${product.PHAN_TRAM_GIAM}%`}
                </div> : <></>}
                {product.TONG_SL_TON <= 0 ? <div className={clsx(style.outOfStockTag)}>
                    {`HẾT HÀNG`}
                </div> : <></>}
                <div className={clsx(style.itemMenu)}>
                    <div className={clsx(style.iconContainer)}
                        onClick={() => {
                            dispatch(addItem(product));
                            dispatch(caculateTotalAmountAndPrice());
                        }}><Icon icon="shopping-bag" type="solid" className={clsx(style.iconSvg)} /></div>
                    <div className={clsx(style.iconContainer)}><Icon icon="heart" type="solid" className={clsx(style.iconSvg)} /></div>
                </div>
                    
                <Link to={`/product/${product.MA_SP}`} className={clsx(style.imgContainer)}>
                    <img src={product.HINH_ANH} alt="item" />

                </Link>
            </div>
        );
    }
    if (type === 3) {
        return (
            <div className={clsx(style.item, style.type3)}>
                {product.PHAN_TRAM_GIAM > 0 ? <div className={clsx(style.salePercentTag)}>
                    {`- ${product.PHAN_TRAM_GIAM}%`}
                </div> : <></>}
                {product.TONG_SL_TON <= 0 ? <div className={clsx(style.outOfStockTag)}>
                    {`HẾT HÀNG`}
                </div> : <></>}
                <div className={clsx(style.itemMenu)}>
                    <div className={clsx(style.iconContainer)}><Icon icon="shopping-bag" type="solid" className={clsx(style.iconSvg)} /></div>
                    <div className={clsx(style.iconContainer)}><Icon icon="heart" type="solid" className={clsx(style.iconSvg)} /></div>
                </div>
                <div>
                    <Link to={`/product/${product.MA_SP}`} className={clsx(style.imgContainer)}>
                        <img src={product.HINH_ANH} alt="item" />

                        {product.PHAN_TRAM_GIAM > 0 ? <div className={clsx(style.salePercentTag)}>
                    {`- ${product.PHAN_TRAM_GIAM}%`}
                </div> : <></>}
                    </Link>
                    <Link to={`/product/${product.MA_SP}`} className={clsx(style.label)}>{product.TEN_SP}</Link>
                </div>
                <div>
                    {discountPricesString ?
                        <><p className={clsx(style.oldPrice)}><span>{pricesString}</span></p>
                            <p className={clsx(style.price)}><span>{discountPricesString}</span></p>
                        </>
                        : <p className={clsx(style.price)}><span>{pricesString}</span></p>}
                    {/* <div className="add-to-cart-button">Add to cart</div> */}

                </div>

            </div>
        );
    }
    
    if (type === "bag-item") {
        return (
            <div className={clsx(style.typeBagItem)}>
                {product.PHAN_TRAM_GIAM > 0 ? <div className={clsx(style.salePercentTag)}>
                    {`- ${product.PHAN_TRAM_GIAM}%`}
                </div> : <></>}
                    {product.TONG_SL_TON <= 0 ? <div className={clsx(style.outOfStockTag)}>
                    {`HẾT HÀNG`}
                </div> : <></>}
                <Link to={`/product/${product.MA_SP}`} className={clsx(style.imgContainer)}>
                    <img src={product.HINH_ANH} alt="item" />

                </Link>
                <div className={clsx(style.itemDetail)}>
                    <div>
                        <Link to={`/product/${product.MA_SP}`} className={clsx(style.label)}>{product.TEN_SP}</Link>
                        {/* {giá này là giá đã giảm (nếu có)} */}
                        <p className={clsx(style.price)}><span className={clsx(style.priceLabel)}>Giá: </span><span>{intToVNDCurrencyFormat(product.chiTietSanPham[0].GIA, true)}</span></p>
                        <p className={clsx()}><span className={clsx(style.priceLabel)}>Size: </span><span>{product.chiTietSanPham[0].TEN_SIZE}</span></p>
                    </div>

                    <div className={clsx(style.inputGroupWrapper)}>
                        <div className={clsx(style.flex)}><span className={clsx(style.priceLabel)}>Số lượng: </span>
                            <div className={clsx(style.inputGroup)}>
                                <button className={clsx(style.buttonMinus)}
                                    onClick={() => {
                                        dispatch(decreaseAmount(product.chiTietSanPham[0].MA_CT_SP));
                                        dispatch(caculateTotalAmountAndPrice());
                                    }}>
                                    <MinusIcon />
                                </button>
                                {/* <input type="number" step="1" max="99" min="1" value={product.amount} name="quantity" className={clsx(style.quantityField)} /> */}
                                <div className={clsx(style.quantityField)}>{product.chiTietSanPham[0].SO_LUONG} </div>

                                <button className={clsx(style.buttonPlus)}
                                    onClick={() => {
                                        dispatch(increaseAmount({ id: product.chiTietSanPham[0].MA_CT_SP }));
                                        dispatch(caculateTotalAmountAndPrice());
                                    }}>
                                    <PlusIcon />
                                </button>
                            </div></div>

                        <button className={clsx(style.btnDanger)}
                            onClick={() => {
                                dispatch(removeItem(product.chiTietSanPham[0].MA_CT_SP));
                                dispatch(caculateTotalAmountAndPrice());
                            }}>Xóa</button>
                    </div>
                </div>
            </div >
        )
    }

    if (type === "search-item") {
        return (
            <div className={clsx(style.typeBagItem)}>
                {product.PHAN_TRAM_GIAM > 0 ? <div className={clsx(style.salePercentTag)}>
                    {`- ${product.PHAN_TRAM_GIAM}%`}
                </div> : <></>}
                    {product.TONG_SL_TON <= 0 ? <div className={clsx(style.outOfStockTag)}>
                    {`HẾT HÀNG`}
                </div> : <></>}
                <Link to={`/product/${product.MA_SP}`} className={clsx(style.imgContainer)}>
                    <img src={product.HINH_ANH} alt="item" />

                </Link>
                <div className={clsx(style.itemDetail)}>
                    <div>
                        <Link to={`/product/${product.MA_SP}`} className={clsx(style.label)}>{product.TEN_SP}</Link>
                        {discountPricesString ?
                        <><p className={clsx(style.oldPrice)}><span>{pricesString}</span></p>
                            <p className={clsx(style.price)}><span>{discountPricesString}</span></p>
                        </>
                        : <p className={clsx(style.price)}><span>{pricesString}</span></p>}
                        <p>SIZE: {product.SIZE_STR? product.SIZE_STR.substring(1, product.SIZE_STR.length):""}</p>
                    {/* <div className="add-to-cart-button">Add to cart</div> */}
                    </div>
                </div>
            </div >
        )
    }
}

export default Item;