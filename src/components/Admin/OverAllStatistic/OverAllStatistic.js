
import { useState, useEffect } from 'react';
import style from './OverAllStatistic.module.css'
import axios from 'axios';
import clsx from 'clsx';
import { ClothesIcon, UserIcon, OrderIcon, UnapproveOrderIcon, CashIcon } from '../../../icons';
import { intToVNDCurrencyFormat } from '../../../uitilities/utilities';
function OverAllStatistic() {
    const [data, setData] = useState();
    useEffect(() => {
        try {
            console.log(`http://localhost:22081/api/NhanVien/statistic`);
            axios
                .get(`http://localhost:22081/api/NhanVien/statistic`)
                .then((res) => {
                    const dataFromApi = res.data;
                    console.log(dataFromApi);
                    // console.log(cartsFromApi);
                    setData(dataFromApi);
                });
        } catch (error) {
            console.error(error);
        }
    }, []);

    return (<>
        {data?<div className={clsx(style.statisticsContainer)}>
            <div className={clsx(style.statistic)}>
                <ClothesIcon/>
                <label>Sản phẩm</label>
                <p>{data.TONG_SO_SP}</p>
            </div>
            <div className={clsx(style.statistic)}>
            <OrderIcon/>
                <label>Đơn hàng</label>
                <p>{data.TONG_SO_GH}</p>
            
            </div>
            <div className={clsx(style.statistic)}>
            <CashIcon/>
                <label>Doanh thu</label>
                <p>{intToVNDCurrencyFormat(data.TONG_DOANH_THU, true)}</p>
            </div>

            <div className={clsx(style.statistic)}>
                <UserIcon/>
                <label>Khách hàng</label>
                <p>{data.TONG_SO_KH}</p>
            </div>

            <div className={clsx(style.statistic)}>
            <UnapproveOrderIcon/>
                <label>Đơn chưa duyệt</label>
                <p>{data.TONG_SO_GH_CHUA_DUYET}</p>
            </div>
        </div>:<></>}
        </>
    );
}
export default OverAllStatistic;


