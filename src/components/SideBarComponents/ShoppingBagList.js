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
import PayPal from '../PayPal/PayPal';
function ShoppingBagList(props) {
    let navigate = useNavigate();
    const dispatch = useDispatch();

    const { bagProducts, amount, total } = useSelector((store) => {
        return store.shoppingBag;
    })
    const [checkout, setCheckOut] = useState(false);
    // calculate total amount and price every time you modify bagProducts
    useEffect(() => {
        dispatch(caculateTotalAmountAndPrice());
    }, [bagProducts]);

    console.log(bagProducts, amount, total);
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

                    {bagProducts.map((product, index) => {
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
                    <div onClick={() => {
                        if (!JSON.parse(localStorage.getItem('user'))) {
                            navigate("/user/login", { replace: true });
                            props.toggleOverActive();
                            props.toggleShoppingBag();
                            props.pushMain();
                        } else {
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