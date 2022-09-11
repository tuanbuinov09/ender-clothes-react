import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import style from './ProductDetail.module.css';
import clsx from 'clsx';
import axios from 'axios';
import ToastContainer, { toast } from 'react-light-toast';
import { useDispatch, useSelector } from 'react-redux/es/exports';
import LoadingAnimation from '../LoadingAnimation/LoadingAnimation';
import { caculateTotalAmountAndPrice, addItem, removeItem, increaseAmount, decreaseAmount } from '../../features/shoppingBag/shoppingBagSlice.js';
function ProductDetail(props) {
    const dispatch = useDispatch();
    const params = useParams();
    console.log(params.productId);
    const [selectedSize, setSelectedSize] = useState(null);
    const [product, setProduct] = useState(null);
    const [flag, setFlag] = useState(false);
    const { bagProducts, amount, total } = useSelector((store) => {
        return store.shoppingBag;
    })
    const notify = (message) => toast.error(message, { autoClose: true, closeDuration: 3000 });//error/info/add
    useEffect(() => {
        console.log(`http://localhost:22081/api/SanPham/?productId=${params.productId}`);
        try {
            axios.put(`http://localhost:22081/api/SanPham/incre-view?productId=${params.productId}`).then(res => {
                const response = res.data;
                console.log("response", response);
            });
        } catch (error) {
            console.error(error);
        }
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
    const checkQuantity = (MA_CT_SP) => {
        console.log(MA_CT_SP, bagProducts)
        let quantity;
        bagProducts.forEach((item) => {
            console.log(item.chiTietSanPham[0].MA_CT_SP);
            if (item.chiTietSanPham[0].MA_CT_SP === MA_CT_SP) {
                quantity = item.chiTietSanPham[0].SO_LUONG;
            }
        })
        return quantity
    }
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

    return (!flag ? <div className={clsx(style.flex_1, style.list)}>
        <LoadingAnimation />
    </div> : <div className={clsx(style.container)}>
        <div className={clsx(style.left)}>
            <div className={clsx(style.imgContainer)}>
                {product.PHAN_TRAM_GIAM > 0 ? <div className={clsx(style.salePercentTag)}>
                    {`- ${product.PHAN_TRAM_GIAM}%`}
                </div> : <></>}
                {product.TONG_SL_TON <= 0 ? <div className={clsx(style.outOfStockTag)}>
                    {`HẾT HÀNG`}
                </div> : <></>}
                <img src={product.HINH_ANH} className={clsx(style.img)} alt={`${product.TEN_SP}`} />
            </div>
        </div>
        <div className={clsx(style.right)}>
            <h2 className={clsx(style.title)}>{product.TEN_SP}</h2>
            <div className={clsx(style.flex)}>
                <div className={clsx(style.subtitle)}>Size: </div>
                <div className={clsx(style.sizeContainer)}>
                    {product.chiTietSanPham.map((ctsp, index) => {
                        return (
                            <div key={index} className={clsx(style.size, { [style.active]: ctsp.MA_SIZE === selectedSize.MA_SIZE },
                                { [style.freeSize]: ctsp.MA_SIZE === 'S07' })}//trong csdl s07 la free size
                                onClick={() => { setSelectedSize(ctsp) }}>{ctsp.TEN_SIZE}</div>
                        );
                    })}
                </div>
            </div>
            <p className={clsx(style.sizeQuantity)}>Tồn kho: {selectedSize.SL_TON}</p>

            {product.PHAN_TRAM_GIAM ?
                <>
                    <p className={clsx(style.oldPrice)}><span className={clsx(style.priceLabel)}>Giá cũ: </span><span className={clsx(style.oldPriceString)}>{oldPriceString}</span></p>
                    <p className={clsx(style.price)}><span className={clsx(style.priceLabel)}>Giá khuyến mãi: </span><span>{priceString}</span></p>
                </>
                : <p className={clsx(style.price)}><span className={clsx(style.priceLabel)}>Giá: </span><span>{oldPriceString}</span></p>}
            <div className={clsx(style.desc)}>{product.MO_TA ? product.MO_TA : "Không có mô tả cho sản phẩm này"}</div>
            <div className={clsx(style.btnContainer)}
                onClick={(e) => {
                    if(product.TONG_SL_TON <= 0){
                        return;
                    }
                    const quantityInCart = checkQuantity(selectedSize.MA_CT_SP)
                    console.log(quantityInCart);

                    if ((quantityInCart) === selectedSize.SL_TON || selectedSize.SL_TON === 0) {
                        console.log("Đạt giới hạn tồn kho của sản phẩm")
                        notify("Đạt giới hạn tồn kho của sản phẩm");
                        return;
                    }

                    dispatch(addItem({ ...product, chiTietSanPham: [{ ...selectedSize, SO_LUONG: 1, SO_LUONG_TON: selectedSize.SL_TON }] }));
                    dispatch(caculateTotalAmountAndPrice());
                }}>
                <button className={clsx(style.btn, { [style.disabled]: product.TONG_SL_TON <= 0 })}>THÊM VÀO GIỎ HÀNG</button>
            </div>

            <div className={clsx(style.top)}>
                <ToastContainer />
            </div>
        </div>
    </div>);
}

export default ProductDetail;