import React, { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux/es/exports";
import { caculateTotalAmountAndPrice, clearBag } from '../../features/shoppingBag/shoppingBagSlice';
import style from './PayPal.module.css';
import axios from "axios";
import clsx from "clsx";
export default function PayPal(props) {
    const paypal = useRef();
    let navigate = useNavigate();
    const dispatch = useDispatch();
    useEffect(() => {

        // const GIO_HANG_ENTITY = {};
        // const shipInfo = JSON.parse(localStorage.getItem('shipInfo'));

        // GIO_HANG_ENTITY.MA_KH = shipInfo.MA_KH;
        // GIO_HANG_ENTITY.HO_TEN = shipInfo.HO_TEN;
        // GIO_HANG_ENTITY.SDT = shipInfo.SDT;
        // GIO_HANG_ENTITY.EMAIL = shipInfo.EMAIL;
        // GIO_HANG_ENTITY.DIA_CHI = shipInfo.MA_KH;

        // GIO_HANG_ENTITY.chiTietGioHang = bagProducts.map((product)=>{
        //     return product.chiTietSanPham[0];
        // })
        // console.log(GIO_HANG_ENTITY);

    }, [])
    // (async () => {
    //     // Get the latest exchange rates
    //     const { exchangeRates } = require('exchange-rates-api');

    //     const data = await exchangeRates().latest().fetch();                             // {THB: 34.978, PHP: 58.159, …, HUF: 323.58}
    //     console.log(data.VND?data.VND:data);
    //     // // Get historical rates for any day since 1999
    //     // await exchangeRates().at('2018-03-26').fetch();                     // {THB: 38.66, PHP: 64.82, …, HUF: 312.73}

    //     // // By default, the base currency is EUR, but it can be changed
    //     // await exchangeRates().latest().base('USD').fetch();                 // {THB: 30.9348191386, …, HUF: 286.1767046962}

    //     // // Request specific exchange rates
    //     // await exchangeRates().latest().symbols(['USD', 'GBP']).fetch();     // {USD: 1.1307, GBP: 0.89155}

    //     // // Request one specific exchange rate
    //     // await exchangeRates().latest().symbols('USD').fetch();              // 1.1307
    // })();

    const { bagProducts, amount, total } = useSelector((store) => {
        return store.shoppingBag;
    })
    console.log("total: ", (total / 23000).toFixed(2));
    useEffect(() => {

        window.paypal
            .Buttons({
                createOrder: (data, actions, err) => {
                    return actions.order.create({
                        intent: "CAPTURE",
                        purchase_units: [
                            {
                                description: "Cool looking table",
                                amount: {
                                    currency_code: "USD",
                                    value: (total / 23000).toFixed(2),
                                },
                            },
                        ],
                    });
                },
                onApprove: async (data, actions) => {
                    const order = await actions.order.capture();
                    console.log(order);

                    //chạy code thêm ở đây

                    dispatch(clearBag());
                    dispatch(caculateTotalAmountAndPrice());


                    const GIO_HANG_ENTITY = {};
                    const shipInfo = JSON.parse(localStorage.getItem('shipInfo'));

                    GIO_HANG_ENTITY.MA_KH = shipInfo.MA_KH;
                    GIO_HANG_ENTITY.HO_TEN = shipInfo.HO_TEN;
                    GIO_HANG_ENTITY.SDT = shipInfo.SDT;
                    GIO_HANG_ENTITY.EMAIL = shipInfo.EMAIL;
                    GIO_HANG_ENTITY.DIA_CHI = shipInfo.MA_KH;

                    GIO_HANG_ENTITY.chiTietGioHang = bagProducts.map((product) => {
                        return product.chiTietSanPham[0];
                    })
                    console.log(GIO_HANG_ENTITY);

                    axios.post(`http://localhost:22081/api/KhachHang/add-cart`, {
                        ...GIO_HANG_ENTITY
                    }).then(res => {
                        const result = res.data;
                        // console.log(productsFromApi);
                        console.log(result);
                        alert(result);
                    });

                    navigate("/", { replace: true });
                    
                },
                onError: (err) => {
                    console.log(err);
                },
            })
            .render(paypal.current);
    }, []);

    return (
        <div className={clsx(style.paypalWrapper)}>
            <h1 className={clsx(style.title)}>Chọn phương thức thanh toán</h1>
            <div ref={paypal}></div>
        </div>
    );
}