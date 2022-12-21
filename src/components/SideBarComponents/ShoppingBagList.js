import clsx from 'clsx';
import React from 'react';
import { useEffect } from 'react';
import style from './ShoppingBagList.module.css';
import Item from '../HomePage/Item/Item';
import { useDispatch, useSelector } from 'react-redux';
import { caculateTotalAmountAndPrice } from '../../features/shoppingBag/shoppingBagSlice.js';
import { Button } from '../Button/Button';
import { openModal } from '../../features/modal/modalSlice';
import { intToVNDCurrencyFormat } from '../../uitilities/utilities';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import PayPal from '../PayPal/PayPal';
import { REACT_APP_API_PUBLIC_IMAGE_FOLDER_URL, REACT_APP_API_URL } from '../../uitilities/CONSTANT';
import { toast } from 'react-toastify';
function ShoppingBagList(props) {
    let navigate = useNavigate();
    const dispatch = useDispatch();

    const { bagProducts, amount, total } = useSelector((store) => {
        return store.shoppingBag;
    });
    const [pd, setPD] = useState([]);
    const [checkout, setCheckOut] = useState(false);
    // calculate total amount and price every time you modify bagProducts
    useEffect(() => {
        const c = JSON.parse(localStorage.getItem('ccart'));
        c.forEach(item => {
            if (item.HINH_ANH && !item.HINH_ANH.startsWith('http')) {
                item.HINH_ANH = `${REACT_APP_API_URL}/${REACT_APP_API_PUBLIC_IMAGE_FOLDER_URL}/${item.HINH_ANH}`
            }
        });
        setPD(c || []);

    }, [bagProducts]);

    // console.log(bagProducts, amount, total);

    if (amount < 1) {
        return (
            <div className={clsx(style.list)}>
                <h1>Giỏ hàng hiện đang trống.</h1>
            </div>
        );
    } else if (amount >= 1) {
        return (
            <>
                <div className={clsx(style.list)}>

                    {pd.map((product, index) => {
                        return (<Item key={index} product={product} type="bag-item" />);
                    })}

                </div>
                <p className={clsx(style.totalWrapper)}><span>Tổng: </span><span className={clsx(style.total)}>{intToVNDCurrencyFormat(total, true)}</span></p>
                <div className={style.buttonsWrapper}>

                    <div onClick={() => {
                        dispatch(openModal());
                    }}>
                        <Button text={"XÓA TẤT CẢ"} />
                    </div>
                    <div onClick={async () => {
                        if (!JSON.parse(localStorage.getItem('user'))) {
                            navigate("/user/login", { replace: true });
                            props.toggleOverActive();
                            props.toggleShoppingBag();
                            props.pushMain();
                        } else {
                            const GIO_HANG_ENTITY = {};

                            GIO_HANG_ENTITY.MA_KH = JSON.parse(localStorage.getItem('user')).MA_KH;
                            GIO_HANG_ENTITY.chiTietGioHang = bagProducts.map((product) => {
                                return product.chiTietSanPham[0];
                            });

                            const result = await axios.post(`${REACT_APP_API_URL}/api/KhachHang/validate-purchase-quantity`, {
                                ...GIO_HANG_ENTITY
                            }, {
                                headers: {
                                    Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user')).accessToken,
                                }
                            });

                            if (result.data.errorDesc) {
                                toast.error('Số lượng đặt vượt quá số lượng tồn kho: \n' + result.data.errorDesc);
                                return;
                            }
                            setCheckOut(true);
                            console.log(JSON.parse(localStorage.getItem('user')));

                            // dispatch(openModal());
                            // navigate("/purchase", { replace: true });
                            props.toggleOverActive();
                            props.toggleShoppingBag();
                            props.pushMain();
                            navigate("/purchase/ship-info", { replace: true });
                        }
                    }
                    }>
                        <Button text={"ĐẶT MUA"} />

                    </div>
                </div>

            </>
        );
    }
}

export default ShoppingBagList;