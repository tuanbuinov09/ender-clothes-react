import React, { useEffect, useState } from 'react';
import style from './ShipInfo.module.css';
import clsx from 'clsx';
import { Button } from '../Button/Button';
import { useNavigate } from 'react-router-dom';
import { EMAIL_REGEX, PHONE_REGEX } from '../../uitilities/CONSTANT';
import { isValidPhone } from '../../uitilities/utilities';
import loginImage from '../Login/062_Outline_OnlineShopping_MS.jpg'
function ShipInfo(props) {
    const [errorMessage, setErrorMessage] = useState({ errorName: "", errorAddress: "", errorEmail: "", errorPhone: "" });
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
        if (name === 'note') {
            setShipInfo({ ...shipInfo, note: value });
        }
    }
    return (
        <div>
            {<div className={clsx(style.loginWrapper)}>
                <div className={clsx(style.left)}>
                    <div className={clsx(style.imgContainer)}>
                        <img src={loginImage} alt="" className={clsx(style.loginImage)} />

                    </div>
                </div>
                <div className={clsx(style.right)}>
                    <><h1 className={clsx(style.title)}>THÔNG TIN GIAO HÀNG</h1>
                        <form className={clsx(style.form)} onSubmit={(e) => {
                            e.preventDefault();
                            const shipInfo1 = {
                                'MA_KH': shipInfo.MA_KH,
                                'HO_TEN': shipInfo.name1,
                                'SDT': shipInfo.phone,
                                'EMAIL': shipInfo.email,
                                'DIA_CHI': shipInfo.address,
                                'GHI_CHU': shipInfo.note
                            }
                            let tmpErrorMsg = {};
                            tmpErrorMsg = { errorName: "", errorAddress: "", errorEmail: "", errorPhone: "" };
                            let hasError = false;
                            setErrorMessage(tmpErrorMsg);
                            if (!shipInfo1.HO_TEN) {
                                tmpErrorMsg = { ...tmpErrorMsg, errorName: "*Vui lòng nhập tên người nhận" }
                                //setErrorMessage({...errorMessage, errorName: "Vui lòng nhập tên người nhận"});
                                hasError = true;
                            }
                            if (!shipInfo1.SDT) {
                                tmpErrorMsg = { ...tmpErrorMsg, errorPhone: "*Vui lòng nhập số điện thoại" }
                                //setErrorMessage({...errorMessage, errorPhone: "Vui lòng nhập số điện thoại"});
                                hasError = true;
                            } else if (!isValidPhone(shipInfo1.SDT)) {
                                tmpErrorMsg = { ...tmpErrorMsg, errorPhone: "*Vui lòng nhập số điện thoại hợp lệ" }
                                console.log("fail phone")
                                //setErrorMessage({...errorMessage, errorPhone: "Vui lòng nhập số điện thoại hợp lệ"});
                                hasError = true;
                            }
                            if (!shipInfo1.EMAIL) {
                                tmpErrorMsg = { ...tmpErrorMsg, errorEmail: "*Vui lòng nhập email người nhận" }
                                //setErrorMessage({...errorMessage, errorEmail: "Vui lòng nhập email người nhận"});
                                hasError = true;
                            } else if (!shipInfo1.EMAIL.match(/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i)) {
                                tmpErrorMsg = { ...tmpErrorMsg, errorEmail: "*Vui lòng nhập email hợp lệ" }
                                //setErrorMessage({...errorMessage, errorEmail: "Vui lòng nhập email hợp lệ"});
                                hasError = true;
                            }
                            if (!shipInfo1.DIA_CHI) {
                                tmpErrorMsg = { ...tmpErrorMsg, errorAddress: "*Vui lòng nhập địa chỉ người nhận" }
                                // setErrorMessage({...errorMessage, errorAddress: "Vui lòng nhập địa chỉ người nhận"});
                                hasError = true;
                            }
                            if (hasError) {
                                setErrorMessage(tmpErrorMsg);
                                return;
                            }
                            localStorage.removeItem('shipInfo');
                            localStorage.setItem('shipInfo', JSON.stringify(shipInfo1));
                            console.log(localStorage.getItem('shipInfo', JSON.stringify(shipInfo1)));
                            navigate("/purchase", { replace: true });
                        }}>
                            <div className={clsx(style.inputGroup)}>
                                <label className={clsx(style.inputLabel)}>Họ tên người nhận:</label>
                                <input onChange={(e) => {
                                    // setPassword(e.target.value.trim());
                                    handleChange("name1", e.target.value);
                                }} type="text" name='name1' /*value={password}*/ value={shipInfo ? shipInfo.name1 : ""} placeholder="" className={clsx(style.input)} />
                                {errorMessage.errorName ? <p className={clsx(style.errorMessage)}>{errorMessage.errorName}</p> : ""}
                            </div>
                            <div className={clsx(style.inputGroup)}>
                                <label className={clsx(style.inputLabel)}>Số điện thoại:</label>
                                <input onChange={(e) => {
                                    // setEmail(e.target.value.trim());
                                    handleChange("phone", e.target.value);
                                }} type="text" placeholder="" /*value={email}*/ value={shipInfo ? shipInfo.phone : ""} name='phone' className={clsx(style.input)} />
                                {errorMessage.errorPhone ? <p className={clsx(style.errorMessage)}>{errorMessage.errorPhone}</p> : ""}
                            </div>
                            <div className={clsx(style.inputGroup)}>
                                <label className={clsx(style.inputLabel)}>Email:</label>
                                <input onChange={(e) => {
                                    // setEmail(e.target.value.trim());
                                    handleChange("email", e.target.value);
                                }} type="text" placeholder="" /*value={email}*/ value={shipInfo ? shipInfo.email : ""} name='email' className={clsx(style.input)} />
                                {errorMessage.errorEmail ? <p className={clsx(style.errorMessage)}>{errorMessage.errorEmail}</p> : ""}
                            </div>
                            <div className={clsx(style.inputGroup)}>
                                <label className={clsx(style.inputLabel)}>Địa chỉ người nhận:</label>
                                <input onChange={(e) => {
                                    // setEmail(e.target.value.trim());
                                    handleChange("address", e.target.value);
                                }} type="text" placeholder="" /*value={email}*/ value={shipInfo ? shipInfo.address : ""} name='address' className={clsx(style.input)} />
                                {errorMessage.errorAddress ? <p className={clsx(style.errorMessage)}>{errorMessage.errorAddress}</p> : ""}
                            </div>
                            <div className={clsx(style.inputGroup)}>
                                <label className={clsx(style.inputLabel)}>Ghi chú:</label>
                                <textarea onChange={(e) => {
                                    // setEmail(e.target.value.trim());
                                    handleChange("note", e.target.value);
                                }} type="text" placeholder="" /*value={email}*/ value={shipInfo ? shipInfo.note : ""} name='note' className={clsx(style.input)} />
                            </div>

                            <div className={clsx(style.inputGroup)}
                                onClick={(e) => {

                                }}>
                                <Button text={"ĐẶT MUA"} />
                            </div>
                        </form>
                    </>
                </div>
            </div>}
        </div>
    );
}

export default ShipInfo;