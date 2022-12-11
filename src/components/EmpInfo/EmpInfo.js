import React, { useEffect, useState } from 'react';
import style from './EmpInfo.module.css';
import clsx from 'clsx';
import { Button } from '../Button/Button';
import { PrintIcon, LogOutIcon, LockIcon } from '../../icons';
import { useNavigate } from 'react-router-dom';
import userImage from './128-1280406_view-user-icon-png-user-circle-icon-png.png';
import axios from 'axios';
import { REACT_APP_API_URL } from '../../uitilities/CONSTANT';
import { toast } from 'react-toastify';
import LoadingAnimation from '../LoadingAnimation/LoadingAnimation';

function EmpInfo(props) {
    useEffect(() => {
        //khi unmount trả lại header
        return () => {
            props.changeHeader('user')
        }
    }, [])

    props.changeHeader('employee')
    const [errorMessage, setErrorMessage] = useState();
    const [userInfo, setUserInfo] = useState();
    const [shipInfo, setShipInfo] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [showChangePasswordForm, setShowChangePasswordForm] = useState(false);
    let navigate = useNavigate();
    useEffect(() => {
        // setUserInfo(JSON.parse(localStorage.getItem('user')));
        if (!JSON.parse(localStorage.getItem('employee'))) {
            navigate("/employee/login", { replace: true });
        } else {
            setShipInfo({
                MA_NV: JSON.parse(localStorage.getItem('employee')).MA_NV,
                name1: JSON.parse(localStorage.getItem('employee')).HO_TEN,
                phone: JSON.parse(localStorage.getItem('employee')).SDT,
                email: JSON.parse(localStorage.getItem('employee')).EMAIL,
                address: JSON.parse(localStorage.getItem('employee')).DIA_CHI,
                cmnd: JSON.parse(localStorage.getItem('employee')).CMND
            });
        }

        try {
            // setShipInfo()
        } catch (e) {
            console.log(e);
        }

    }, []);
    const checkOldPassword = async (EMAIL, MAT_KHAU_CU) => {
        let res1 = await axios.post(`${REACT_APP_API_URL}/api/NhanVien/validate-old-password`, {
            MAT_KHAU: MAT_KHAU_CU,
            EMAIL: EMAIL
        }, {
            headers: {
                Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('employee')).accessToken,
            }
        })
        console.log(res1);
        return res1.data;
    }
    const changePassword = (changeInfoInput) => {
        let url = `${REACT_APP_API_URL}/api/NhanVien/change-password`;
        console.log(url, {
            MA_NV: changeInfoInput.MA_NV,
            MAT_KHAU: changeInfoInput.MAT_KHAU_MOI
        }, {
            headers: {
                Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('employee')).accessToken,
            }
        });
        setIsLoading(true);
        try {
            axios.put(url, {
                MA_NV: changeInfoInput.MA_NV,
                MAT_KHAU: changeInfoInput.MAT_KHAU_MOI
            }, {
                headers: {
                    Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('employee')).accessToken,
                }
            }).then(res => {
                const userInfoFromRes = res.data;
                console.log(userInfoFromRes);
                // const accessToken = JSON.parse(localStorage.getItem('user')).accessToken;
                if (userInfoFromRes) {
                    setErrorMessage('');
                    localStorage.setItem('employee', JSON.stringify(userInfoFromRes));
                    console.log("---", localStorage.getItem('employee'));
                    //navigate("/", { replace: true });
                } else {
                }
                setIsLoading(false);
                toast.success("Thay đổi mật khẩu thành công");
                setShowChangePasswordForm(false);
            });
        } catch (e) {
            console.log(e);
            toast.error("Thay đổi mật khẩu thất bại, có lỗi xảy ra");
            //setErrorMessage({ ...errorMessage, errorConfirmPassword: "Có lỗi xảy ra: " + e })
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
        if (name === 'cmnd') {
            setShipInfo({ ...shipInfo, cmnd: value });
        }
        if (name === 'password') {
            setShipInfo({ ...shipInfo, password: value });
        }
        if (name === 'newPassword') {
            setShipInfo({ ...shipInfo, newPassword: value });
        }
    }
    return (
        <div>
            {<div className={clsx(style.loginWrapper)}>
                <div className={clsx(style.left)}>
                    <div className={clsx(style.userImageContainer)}><img className={clsx(style.userImage)} src={userImage} alt='employee'></img></div>

                    <button className={clsx(style.checkButton, style.printButton, style.logOutBtn)} onClick={() => {
                        localStorage.removeItem('employee');
                        navigate("/employee/login", { replace: true })
                    }}><span className={clsx(style.iconSvg)}><LogOutIcon /></span>Đăng xuất</button>
                    <button className={clsx(style.checkButton, style.printButton, style.changePassButton)}
                        onClick={() => {
                            setShowChangePasswordForm(true);
                            setShipInfo({ ...shipInfo, password: "", newPassword: "" });
                            setErrorMessage({ errorName: "", errorAddress: "", errorEmail: "", errorPhone: "", overAllError: "" });
                        }}><span className={clsx(style.iconSvg)}><LockIcon /></span> Thay đổi mật khẩu</button>
                </div>
                <div className={clsx(style.right)}>
                    {isLoading ? <LoadingAnimation /> :
                        <><h1 className={clsx(style.title)}>THÔNG TIN NHÂN VIÊN</h1>
                            {
                                showChangePasswordForm ? <form className={clsx(style.form)} autoComplete="off" onSubmit={async (e) => {
                                    e.preventDefault();
                                    const shipInfo1 = {
                                        'MA_NV': shipInfo.MA_NV,
                                        'HO_TEN': shipInfo.name1,
                                        'SDT': shipInfo.phone,
                                        'EMAIL': shipInfo.email,
                                        'DIA_CHI': shipInfo.address,
                                        'CMND': shipInfo.cmnd,
                                        'MAT_KHAU': shipInfo.password,
                                        'MAT_KHAU_MOI': shipInfo.newPassword
                                    }
                                    let validateResult = await checkOldPassword(shipInfo1.EMAIL, shipInfo1.MAT_KHAU);
                                    console.log(validateResult)
                                    let tmpErrorMsg = {};
                                    tmpErrorMsg = { errorName: "", errorAddress: "", errorEmail: "", errorPhone: "", errorPassword: "", errorNewPassword: "" };
                                    let hasError = false;
                                    setErrorMessage(tmpErrorMsg);
                                    // if (!shipInfo1.HO_TEN) {
                                    //     tmpErrorMsg = { ...tmpErrorMsg, errorName: "Vui lòng nhập tên" }
                                    //     //setErrorMessage({...errorMessage, errorName: "Vui lòng nhập tên người nhận"});
                                    //     hasError = true;
                                    // }
                                    // if (!shipInfo1.SDT) {
                                    //     tmpErrorMsg = { ...tmpErrorMsg, errorPhone: "Vui lòng nhập số điện thoại" }
                                    //     //setErrorMessage({...errorMessage, errorPhone: "Vui lòng nhập số điện thoại"});
                                    //     hasError = true;
                                    // } else if (!isValidPhone(shipInfo1.SDT)) {
                                    //     tmpErrorMsg = { ...tmpErrorMsg, errorPhone: "Vui lòng nhập số điện thoại hợp lệ" }
                                    //     console.log("fail phone")
                                    //     //setErrorMessage({...errorMessage, errorPhone: "Vui lòng nhập số điện thoại hợp lệ"});
                                    //     hasError = true;
                                    // } else if (validateResult.SDT === '1') {
                                    //     tmpErrorMsg = { ...tmpErrorMsg, errorPhone: "Số điện thoại đã được sử dụng" }
                                    //     //setErrorMessage({...errorMessage, errorEmail: "Vui lòng nhập email hợp lệ"});
                                    //     hasError = true;
                                    // }
                                    // if (!shipInfo1.EMAIL) {
                                    //     tmpErrorMsg = { ...tmpErrorMsg, errorEmail: "Vui lòng nhập email" }
                                    //     //setErrorMessage({...errorMessage, errorEmail: "Vui lòng nhập email người nhận"});
                                    //     hasError = true;
                                    // } else if (!shipInfo1.EMAIL.match(/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i)) {
                                    //     tmpErrorMsg = { ...tmpErrorMsg, errorEmail: "Vui lòng nhập email hợp lệ" }
                                    //     //setErrorMessage({...errorMessage, errorEmail: "Vui lòng nhập email hợp lệ"});
                                    //     hasError = true;
                                    // } else if (validateResult.EMAIL === '1') {
                                    //     tmpErrorMsg = { ...tmpErrorMsg, errorEmail: "Email đã được sử dụng" }
                                    //     //setErrorMessage({...errorMessage, errorEmail: "Vui lòng nhập email hợp lệ"});
                                    //     hasError = true;
                                    // }
                                    // if (!shipInfo1.DIA_CHI) {
                                    //     tmpErrorMsg = { ...tmpErrorMsg, errorAddress: "Vui lòng nhập địa chỉ" }
                                    //     // setErrorMessage({...errorMessage, errorAddress: "Vui lòng nhập địa chỉ người nhận"});
                                    //     hasError = true;
                                    // }
                                    //console.log(shipInfo1.MAT_KHAU.length)
                                    if (!shipInfo1.MAT_KHAU) {
                                        console.log("no pass");
                                        tmpErrorMsg = { ...tmpErrorMsg, errorPassword: "*Vui lòng nhập mật khẩu cũ" }
                                        hasError = true;
                                    } else if (validateResult.MAT_KHAU === '1') {
                                        tmpErrorMsg = { ...tmpErrorMsg, errorPassword: "*Mật khẩu cũ không chính xác" }
                                        hasError = true;
                                    }
                                    if (shipInfo1.MAT_KHAU_MOI === shipInfo1.MAT_KHAU) {
                                        tmpErrorMsg = { ...tmpErrorMsg, errorNewPassword: "*Mật khẩu mới không được trùng với mật khẩu cũ" }
                                        hasError = true;
                                    } else if (!(shipInfo1.MAT_KHAU_MOI.length >= 6)) {
                                        console.log("pass < 6")
                                        tmpErrorMsg = { ...tmpErrorMsg, errorNewPassword: "*Vui lòng nhập mật khẩu ít nhất 6 ký tự" }
                                        hasError = true;
                                    }
                                    if (hasError) {
                                        setErrorMessage(tmpErrorMsg);
                                        return;
                                    }

                                    changePassword(shipInfo1);
                                    // const validateResult = await axios.post(`${REACT_APP_API_URL}/api/KhachHang/validate-change-info`);
                                    // console.log(validateResult);
                                    return;
                                    // localStorage.removeItem('userInfo');
                                    // localStorage.setItem('userInfo', JSON.stringify(shipInfo1));
                                    // console.log(localStorage.getItem('userInfo', JSON.stringify(shipInfo1)));
                                }}>
                                    <div className={clsx(style.inputGroup)}>
                                        <label className={clsx(style.inputLabel)}>Mật khẩu cũ:</label>
                                        <input autocomplete="off" autoComplete='new-password' onChange={(e) => {
                                            // setEmail(e.target.value.trim());
                                            handleChange("password", e.target.value.trim());
                                        }} type="password" placeholder="" /*value={email}*/ value={shipInfo ? shipInfo.password : ""} name='password' className={clsx(style.input)} />
                                        {errorMessage.errorPassword ? <p className={clsx(style.errorMessage)}>{errorMessage.errorPassword}</p> : ""}
                                    </div>
                                    <div className={clsx(style.inputGroup)}>
                                        <label className={clsx(style.inputLabel)}>Mật khẩu mới:</label>
                                        <input autocomplete="off" autoComplete='new-password' onChange={(e) => {
                                            // setEmail(e.target.value.trim());
                                            handleChange("newPassword", e.target.value.trim());
                                        }} type="password" placeholder="" /*value={email}*/ value={shipInfo ? shipInfo.newPassword : ""} name='newPassword' className={clsx(style.input)} />
                                        {errorMessage.errorNewPassword ? <p className={clsx(style.errorMessage)}>{errorMessage.errorNewPassword}</p> : ""}
                                    </div>
                                    <p className={clsx(style.errorMessage)}>{errorMessage.overAllError ? errorMessage.overAllError : ""}</p>
                                    <div className={clsx(style.inputGroup, style.changePasswordButtonGroup)}
                                        onClick={(e) => {

                                        }}>
                                        <div className={clsx(style.inputGroup)}
                                            onClick={(e) => {

                                            }}>
                                            <Button text={"LƯU THÔNG TIN"} />
                                        </div>
                                        <div className={clsx(style.inputGroup)}
                                            onClick={(e) => {
                                                setShowChangePasswordForm(false);
                                            }}>
                                            <Button text="HỦY" />
                                        </div>
                                    </div>
                                </form> : <form className={clsx(style.form)} onSubmit={(e) => {
                                    e.preventDefault();
                                    const shipInfo1 = {
                                        'MA_NV': shipInfo.MA_NV,
                                        'HO_TEN': shipInfo.name1,
                                        'SDT': shipInfo.phone,
                                        'EMAIL': shipInfo.email,
                                        'CMND': shipInfo.cmnd,
                                        'DIA_CHI': shipInfo.address
                                    }
                                    localStorage.removeItem('empInfo');
                                    localStorage.setItem('empInfo', JSON.stringify(shipInfo1));
                                    console.log(localStorage.getItem('empInfo', JSON.stringify(shipInfo1)));
                                    navigate("/purchase", { replace: true });
                                }}>
                                    <div className={clsx(style.inputGroup)}>
                                        <label className={clsx(style.inputLabel)}>Họ tên:</label>
                                        <input disabled onChange={(e) => {
                                            // setPassword(e.target.value.trim());
                                            handleChange("name1", e.target.value);
                                        }} type="text" name='name1' /*value={password}*/ value={shipInfo ? shipInfo.name1 : ""} placeholder="" className={clsx(style.input)} />
                                    </div>
                                    <div className={clsx(style.inputGroup)}>
                                        <label className={clsx(style.inputLabel)}>Số điện thoại:</label>
                                        <input disabled onChange={(e) => {
                                            // setEmail(e.target.value.trim());
                                            handleChange("phone", e.target.value);
                                        }} type="text" placeholder="" /*value={email}*/ value={shipInfo ? shipInfo.phone : ""} name='phone' className={clsx(style.input)} />
                                    </div>
                                    <div className={clsx(style.inputGroup)}>
                                        <label className={clsx(style.inputLabel)}>Email:</label>
                                        <input disabled onChange={(e) => {
                                            // setEmail(e.target.value.trim());
                                            handleChange("email", e.target.value);
                                        }} type="text" placeholder="" /*value={email}*/ value={shipInfo ? shipInfo.email : ""} name='email' className={clsx(style.input)} />
                                    </div>
                                    <div className={clsx(style.inputGroup)}>
                                        <label className={clsx(style.inputLabel)}>CMND:</label>
                                        <input disabled onChange={(e) => {
                                            // setEmail(e.target.value.trim());
                                            handleChange("cmnd", e.target.value);
                                        }} type="text" placeholder="" /*value={email}*/ value={shipInfo ? shipInfo.cmnd : ""} name='cmnd' className={clsx(style.input)} />
                                    </div>
                                    <div className={clsx(style.inputGroup)}>
                                        <label className={clsx(style.inputLabel)}>Địa chỉ:</label>
                                        <input disabled onChange={(e) => {
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
                                </form>}
                        </>}
                </div>
            </div>}
        </div>
    );
}

export default EmpInfo;