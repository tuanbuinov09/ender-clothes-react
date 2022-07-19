import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import style from './ProductDetail.module.css';
import clsx from 'clsx';
import axios from 'axios';
import { produceWithPatches } from 'immer';
import { useDispatch } from 'react-redux/es/exports';
import { caculateTotalAmountAndPrice, addItem, removeItem, increaseAmount, decreaseAmount } from '../../features/shoppingBag/shoppingBagSlice.js';
function ProductDetail(props) {
    const dispatch = useDispatch();
    const params = useParams();
    console.log(params.productId);
    const [selectedSize, setSelectedSize] = useState(null);
    const [product, setProduct] = useState(null);
    const [flag, setFlag] = useState(false);

    useEffect(() => {
        console.log(`http://localhost:22081/api/SanPham/?productId=${params.productId}`);
        try {
            axios.get(`http://localhost:22081/api/SanPham/?productId=${params.productId}`).then(res => {
                const productsFromApi = res.data;
                // console.log(productsFromApi[0]);
                setProduct(productsFromApi[0]);
                setSelectedSize(productsFromApi[0].chiTietSanPham[0]);
                setFlag(true);
            });
        } catch (error) {
            console.error(error);
        }
    }, []);

    console.log(product);
    console.log(selectedSize);
    let priceString = '';
    let oldPriceString = '';
    try {
        oldPriceString = selectedSize.GIA.toLocaleString('it-IT', { style: 'currency', currency: 'VND' });
        oldPriceString = oldPriceString.substring(0, oldPriceString.length - 4) + " ₫";
        if (product.PHAN_TRAM_GIAM) {
            priceString = (selectedSize.GIA - selectedSize.GIA * product.PHAN_TRAM_GIAM / 100).toLocaleString('it-IT', { style: 'currency', currency: 'VND' });
            priceString = priceString.substring(0, priceString.length - 4) + " ₫";
        }
    } catch (e) {

    }

    return (!flag ? <div></div> : <div className={clsx(style.container)}>
        <div className={clsx(style.left)}>
            <div className={clsx(style.imgContainer)}>
                {product.PHAN_TRAM_GIAM > 0 ? <div className={clsx(style.salePercentTag)}>
                    {`- ${product.PHAN_TRAM_GIAM}%`}
                </div> : <></>}
                <img src={product.HINH_ANH} className={clsx(style.img)} alt={`${product.TEN_SP}`} />
            </div>
        </div>
        <div className={clsx(style.right)}>
            <h2 className={clsx(style.title)}>{product.TEN_SP}</h2>
            <div className={clsx(style.sizeContainer)}>
                {product.chiTietSanPham.map((ctsp, index) => {
                    return (<div key={index} className={clsx(style.size, { [style.active]: ctsp.MA_SIZE === selectedSize.MA_SIZE })}
                        onClick={() => { setSelectedSize(ctsp) }}>{ctsp.TEN_SIZE}</div>);
                })}
            </div>
            {product.PHAN_TRAM_GIAM ?
                <>
                    <p className={clsx(style.oldPrice)}><span>{oldPriceString}</span></p>
                    <p className={clsx(style.price)}><span>{priceString}</span></p>
                </>
                : <p className={clsx(style.price)}><span>{oldPriceString}</span></p>}
    <div className={clsx(style.desc)}>{product.MO_TA?product.MO_TA:"Không có mô tả cho sản phẩm này"}</div>
    <div className={clsx(style.btnContainer)}
    onClick={() => {
        dispatch(addItem({...product, chiTietSanPham:[{...selectedSize, SO_LUONG:1}]}));
        dispatch(caculateTotalAmountAndPrice());
    }}><span className={clsx(style.btn)}>THÊM VÀO GIỎ HÀNG</span></div>

        </div>
    </div>);
}

export default ProductDetail;