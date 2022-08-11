import React, { useEffect, useState } from 'react';
import style from './UserInfo.module.css';
import clsx from 'clsx';
import { Button } from '../Button/Button';
import { PrintIcon, LogOutIcon } from '../../icons';
import { useNavigate } from 'react-router-dom';
import userImage from './128-1280406_view-user-icon-png-user-circle-icon-png.png';
function UserInfo(props) {
    const [errorMessage, setErrorMessage] = useState();
    const [userInfo, setUserInfo] = useState();
    const [shipInfo, setShipInfo] = useState({
        MA_KH: JSON.parse(localStorage.getItem('user')).MA_KH,
        name1: JSON.parse(localStorage.getItem('user')).HO_TEN,
        phone: JSON.parse(localStorage.getItem('user')).SDT,
        email: JSON.parse(localStorage.getItem('user')).EMAIL,
        address: JSON.parse(localStorage.getItem('user')).DIA_CHI
    });
    let navigate = useNavigate();
    useEffect(() => {
        // setUserInfo(JSON.parse(localStorage.getItem('user')));
        try {
            // setShipInfo()
        } catch (e) {
            console.log(e);
        }

    }, []);
    const handleChange = (name, value) => {
        if (name === 'name1') {
            setShipInfo({ ...shipInfo, name1: value });
        }
        if (name === 'phone') {
            setShipInfo({ ...shipInfo, phone: value });
        }
        if (name === 'email') {
            setShipInfo({ ...shipInfo, email: value });
        }
        if (name === 'address') {
            setShipInfo({ ...shipInfo, address: value });
        }
    }
    return (
        <div>
            {<div className={clsx(style.loginWrapper)}>
                <div className={clsx(style.left)}>
                    <div className={clsx(style.userImageContainer)}><img className={clsx(style.userImage)} src={userImage} alt='user'></img></div>
                    <button className={clsx(style.checkButton, style.printButton, style.logOutBtn)} onClick={() => {
                        localStorage.removeItem('user');
                        navigate("/user/login", { replace: true })
                    }}> <span className={clsx(style.iconSvg)}><LogOutIcon /></span> Đăng xuất</button>
                    <button className={clsx(style.checkButton, style.printButton)}
                        onClick={() => {
                            localStorage.removeItem('user');
                            navigate("/user/purchased-cart", { replace: true })
                        }}><span className={clsx(style.iconSvg)}><PrintIcon /></span> Lịch sử mua hàng</button>
                </div>
                <div className={clsx(style.right)}>
                    <><h1 className={clsx(style.title)}>THÔNG TIN CÁ NHÂN</h1>
                        <form className={clsx(style.form)} onSubmit={(e) => {
                            e.preventDefault();
                            const shipInfo1 = {
                                'MA_KH': shipInfo.MA_KH,
                                'HO_TEN': shipInfo.name1,
                                'SDT': shipInfo.phone,
                                'EMAIL': shipInfo.email,
                                'DIA_CHI': shipInfo.address
                            }
                            localStorage.removeItem('userInfo');
                            localStorage.setItem('userInfo', JSON.stringify(shipInfo1));
                            console.log(localStorage.getItem('userInfo', JSON.stringify(shipInfo1)));
                            navigate("/purchase", { replace: true });
                        }}>
                            <div className={clsx(style.inputGroup)}>
                                <label className={clsx(style.inputLabel)}>Họ tên khách hàng:</label>
                                <input onChange={(e) => {
                                    // setPassword(e.target.value.trim());
                                    handleChange("name1", e.target.value);
                                }} type="text" name='name1' /*value={password}*/ value={shipInfo ? shipInfo.name1 : ""} placeholder="" className={clsx(style.input)} />
                            </div>
                            <div className={clsx(style.inputGroup)}>
                                <label className={clsx(style.inputLabel)}>Số điện thoại:</label>
                                <input onChange={(e) => {
                                    // setEmail(e.target.value.trim());
                                    handleChange("phone", e.target.value);
                                }} type="text" placeholder="" /*value={email}*/ value={shipInfo ? shipInfo.phone : ""} name='phone' className={clsx(style.input)} />
                            </div>
                            <div className={clsx(style.inputGroup)}>
                                <label className={clsx(style.inputLabel)}>Email:</label>
                                <input onChange={(e) => {
                                    // setEmail(e.target.value.trim());
                                    handleChange("email", e.target.value);
                                }} type="text" placeholder="" /*value={email}*/ value={shipInfo ? shipInfo.email : ""} name='email' className={clsx(style.input)} />
                            </div>
                            <div className={clsx(style.inputGroup)}>
                                <label className={clsx(style.inputLabel)}>Địa chỉ:</label>
                                <input onChange={(e) => {
                                    // setEmail(e.target.value.trim());
                                    handleChange("address", e.target.value);
                                }} type="text" placeholder="" /*value={email}*/ value={shipInfo ? shipInfo.address : ""} name='address' className={clsx(style.input)} />
                            </div>
                            <p className={clsx(style.errorMessage)}>{errorMessage}</p>
                            <div className={clsx(style.inputGroup)}
                                onClick={(e) => {

                                }}>
                                {/* <Button text={"ĐẶT MUA"} /> */}
                            </div>
                        </form>
                    </>
                </div>
            </div>}
        </div>
    );
}

export default UserInfo;