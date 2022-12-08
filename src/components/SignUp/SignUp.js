import React, { useEffect, useState } from 'react';
import style from './SignUp.module.css';
import clsx from 'clsx';
import { Button } from '../Button/Button';
import { useNavigate } from 'react-router-dom';
import { EMAIL_REGEX, PHONE_REGEX } from '../../uitilities/CONSTANT';
import { newIdByDate } from '../../uitilities/utilities'
import { isValidPhone } from '../../uitilities/utilities.js';
import axios from 'axios';
import LoadingAnimation from '../LoadingAnimation/LoadingAnimation';
import loginImage from '../Login/062_Outline_OnlineShopping_MS.jpg'
function SignUp(props) {
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState({ errorName: "", errorAddress: "", errorEmail: "", errorPhone: "" });
    const [userInfo, setUserInfo] = useState();
    const [shipInfo, setShipInfo] = useState({
        MA_KH: "",
        name1: "",
        phone: "",
        email: "",
        address: ""
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
    const checkExisting = async (email, phone) => {
        let res1 = await axios.post('http://localhost:22081/api/KhachHang/validate-sign-up', {
            SDT: phone,
            EMAIL: email
        }).then(res => {
            const userInfoFromRes = res.data;
            console.log(userInfoFromRes);
            return userInfoFromRes;
        });
        return res1;
    }
    const signUp = (signUpInfo) => {
        let url = 'http://localhost:22081/api/KhachHang/sign-up';
        console.log(url, {
            HO_TEN: signUpInfo.HO_TEN,
            MAT_KHAU: signUpInfo.MAT_KHAU,
            EMAIL: signUpInfo.EMAIL,
            DIA_CHI: signUpInfo.DIA_CHI,
            SDT: signUpInfo.SDT,
            MA_KH: newIdByDate("KH"),
            MA_TK: newIdByDate("TK")
        });
        setIsLoading(true);
        try {
            axios.post(url, {
                HO_TEN: signUpInfo.HO_TEN,
                MAT_KHAU: signUpInfo.MAT_KHAU,
                EMAIL: signUpInfo.EMAIL,
                DIA_CHI: signUpInfo.DIA_CHI,
                SDT: signUpInfo.SDT,
                MA_KH: newIdByDate("KH"),
                MA_TK: newIdByDate("TK")
            }).then(res => {
                const userInfoFromRes = res.data;
                console.log(userInfoFromRes);

                if (userInfoFromRes) {
                    setErrorMessage('');
                    localStorage.setItem('user', JSON.stringify(userInfoFromRes));
                    console.log("---", localStorage.getItem('user'));
                    navigate("/", { replace: true });
                } else {
                }
                setIsLoading(false);
            });
        } catch (e) {
            console.log(e);
            setErrorMessage({ ...errorMessage, errorConfirmPassword: "Có lỗi xảy ra: " + e })
            setIsLoading(false);
        }

    }
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
        if (name === 'password') {
            setShipInfo({ ...shipInfo, password: value });
        }
        if (name === 'confirmPassword') {
            setShipInfo({ ...shipInfo, confirmPassword: value });
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
                    {isLoading ? <LoadingAnimation /> :
                        <><h1 className={clsx(style.title)}>ĐĂNG KÝ TÀI KHOẢN</h1>
                            <form className={clsx(style.form)} autoComplete='new-password' onSubmit={async (e) => {
                                e.preventDefault();
                                console.log("-------\n", shipInfo)
                                const shipInfo1 = {
                                    'MA_KH': shipInfo.MA_KH,
                                    'HO_TEN': shipInfo.name1,
                                    'SDT': shipInfo.phone,
                                    'EMAIL': shipInfo.email,
                                    'DIA_CHI': shipInfo.address,
                                    'GHI_CHU': shipInfo.note,
                                    'MAT_KHAU': shipInfo.password,
                                    'XAC_NHAN_MAT_KHAU': shipInfo.confirmPassword
                                }
                                let validateResult;
                                await checkExisting(shipInfo1.EMAIL, shipInfo1.SDT).then(res => {
                                    validateResult = res;
                                });
                                console.log(validateResult)
                                let tmpErrorMsg = {};
                                tmpErrorMsg = { errorName: "", errorAddress: "", errorEmail: "", errorPhone: "", errorPassword: "", errorConfirmPassword: "" };
                                let hasError = false;
                                setErrorMessage(tmpErrorMsg);
                                if (!shipInfo1.HO_TEN) {
                                    tmpErrorMsg = { ...tmpErrorMsg, errorName: "Vui lòng nhập tên" }
                                    //setErrorMessage({...errorMessage, errorName: "Vui lòng nhập tên người nhận"});
                                    hasError = true;
                                }
                                if (!shipInfo1.SDT) {
                                    tmpErrorMsg = { ...tmpErrorMsg, errorPhone: "Vui lòng nhập số điện thoại" }
                                    //setErrorMessage({...errorMessage, errorPhone: "Vui lòng nhập số điện thoại"});
                                    hasError = true;
                                } else if (!isValidPhone(shipInfo1.SDT)) {
                                    tmpErrorMsg = { ...tmpErrorMsg, errorPhone: "Vui lòng nhập số điện thoại hợp lệ" }
                                    console.log("fail phone")
                                    //setErrorMessage({...errorMessage, errorPhone: "Vui lòng nhập số điện thoại hợp lệ"});
                                    hasError = true;
                                } else if (validateResult.SDT === '1') {
                                    tmpErrorMsg = { ...tmpErrorMsg, errorPhone: "Số điện thoại đã được sử dụng" }
                                    //setErrorMessage({...errorMessage, errorEmail: "Vui lòng nhập email hợp lệ"});
                                    hasError = true;
                                }
                                if (!shipInfo1.EMAIL) {
                                    tmpErrorMsg = { ...tmpErrorMsg, errorEmail: "Vui lòng nhập email" }
                                    //setErrorMessage({...errorMessage, errorEmail: "Vui lòng nhập email người nhận"});
                                    hasError = true;
                                } else if (!shipInfo1.EMAIL.match(/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i)) {
                                    tmpErrorMsg = { ...tmpErrorMsg, errorEmail: "Vui lòng nhập email hợp lệ" }
                                    //setErrorMessage({...errorMessage, errorEmail: "Vui lòng nhập email hợp lệ"});
                                    hasError = true;
                                } else if (validateResult.EMAIL === '1') {
                                    tmpErrorMsg = { ...tmpErrorMsg, errorEmail: "Email đã được sử dụng" }
                                    //setErrorMessage({...errorMessage, errorEmail: "Vui lòng nhập email hợp lệ"});
                                    hasError = true;
                                }
                                if (!shipInfo1.DIA_CHI) {
                                    tmpErrorMsg = { ...tmpErrorMsg, errorAddress: "Vui lòng nhập địa chỉ" }
                                    // setErrorMessage({...errorMessage, errorAddress: "Vui lòng nhập địa chỉ người nhận"});
                                    hasError = true;
                                }
                                console.log(shipInfo1.MAT_KHAU.length)
                                if (!shipInfo1.MAT_KHAU) {
                                    console.log("no pass");
                                    tmpErrorMsg = { ...tmpErrorMsg, errorPassword: "Vui lòng nhập mật khẩu" }
                                    // setErrorMessage({...errorMessage, errorAddress: "Vui lòng nhập địa chỉ người nhận"});
                                    hasError = true;
                                } else if (!(shipInfo1.MAT_KHAU.length >= 6)) {
                                    console.log("pass < 6")
                                    tmpErrorMsg = { ...tmpErrorMsg, errorPassword: "Vui lòng nhập mật khẩu ít nhất 6 ký tự" }
                                    // setErrorMessage({...errorMessage, errorAddress: "Vui lòng nhập địa chỉ người nhận"});
                                    hasError = true;
                                }
                                if (!(shipInfo1.XAC_NHAN_MAT_KHAU === shipInfo1.MAT_KHAU)) {
                                    tmpErrorMsg = { ...tmpErrorMsg, errorConfirmPassword: "Mật khẩu xác nhận không khớp" }
                                    // setErrorMessage({...errorMessage, errorAddress: "Vui lòng nhập địa chỉ người nhận"});
                                    hasError = true;
                                }
                                if (hasError) {
                                    setErrorMessage(tmpErrorMsg);
                                    return;
                                }

                                signUp(shipInfo1);

                                // localStorage.removeItem('shipInfo');
                                // localStorage.setItem('shipInfo', JSON.stringify(shipInfo1));
                                // console.log(localStorage.getItem('shipInfo', JSON.stringify(shipInfo1)));
                                // navigate("/", { replace: true });
                            }}>
                                <div className={clsx(style.inputGroup)}>
                                    <label className={clsx(style.inputLabel)}>Họ tên:</label>
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
                                    <input autoComplete='new-password' onChange={(e) => {
                                        // setEmail(e.target.value.trim());
                                        handleChange("email", e.target.value);
                                    }} type="text" placeholder="" /*value={email}*/ value={shipInfo ? shipInfo.email : ""} name='email' className={clsx(style.input)} />
                                    {errorMessage.errorEmail ? <p className={clsx(style.errorMessage)}>{errorMessage.errorEmail}</p> : ""}
                                </div>
                                <div className={clsx(style.inputGroup)}>
                                    <label className={clsx(style.inputLabel)}>Địa chỉ:</label>
                                    <input onChange={(e) => {
                                        // setEmail(e.target.value.trim());
                                        handleChange("address", e.target.value);
                                    }} type="text" placeholder="" /*value={email}*/ value={shipInfo ? shipInfo.address : ""} name='address' className={clsx(style.input)} />
                                    {errorMessage.errorAddress ? <p className={clsx(style.errorMessage)}>{errorMessage.errorAddress}</p> : ""}
                                </div>
                                {/* <div className={clsx(style.inputGroup)}>
                                <label className={clsx(style.inputLabel)}>Ghi chú:</label>
                                <textarea onChange={(e) => {
                                    // setEmail(e.target.value.trim());
                                    handleChange("note", e.target.value);
                                }} type="text" placeholder=""
                                value={shipInfo ? shipInfo.note : ""} name='note' className={clsx(style.input)} />
                            </div> */}
                                <div className={clsx(style.inputGroup)}>
                                    <label className={clsx(style.inputLabel)}>Mật khẩu:</label>
                                    <input autoComplete='new-password' onChange={(e) => {
                                        // setEmail(e.target.value.trim());
                                        handleChange("password", e.target.value.trim());
                                    }} type="password" placeholder="" /*value={email}*/ value={shipInfo ? shipInfo.password : ""} name='password' className={clsx(style.input)} />
                                    {errorMessage.errorPassword ? <p className={clsx(style.errorMessage)}>{errorMessage.errorPassword}</p> : ""}
                                </div>
                                <div className={clsx(style.inputGroup)}>
                                    <label className={clsx(style.inputLabel)}>Xác nhận mật khẩu:</label>
                                    <input autoComplete='new-password' onChange={(e) => {
                                        // setEmail(e.target.value.trim());
                                        handleChange("confirmPassword", e.target.value.trim());
                                    }} type="password" placeholder="" /*value={email}*/ value={shipInfo ? shipInfo.confirmPassword : ""} name='confirmPassword' className={clsx(style.input)} />
                                    {errorMessage.errorConfirmPassword ? <p className={clsx(style.errorMessage)}>{errorMessage.errorConfirmPassword}</p> : ""}
                                </div>
                                <div className={clsx(style.inputGroup)}
                                    onClick={(e) => {

                                    }}>
                                    <Button text={"ĐĂNG KÝ"} />
                                </div>
                            </form>
                        </>}
                </div>
            </div>}
        </div>
    );
}

export default SignUp;