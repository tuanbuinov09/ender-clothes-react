import axios from 'axios';
import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import { Button } from '../Button/Button';
import style from './Login.module.css';
import { useNavigate } from "react-router-dom";
import LoadingAnimation from '../LoadingAnimation/LoadingAnimation';
import loginImage from './062_Outline_OnlineShopping_MS.jpg';
import { toast } from 'react-toastify';
import { REACT_APP_API_URL } from '../../uitilities/CONSTANT';
import { useDispatch, useSelector } from "react-redux";
import { getCurrentCart, initCart } from "../../features/shoppingBag/shoppingBagSlice";
import { getCurrentCartOfUser } from '../../uitilities/utilities';
function Login(props) {
    let navigate = useNavigate();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState();
    const [errorMessage2, setErrorMessage2] = useState({ errorName: "", errorAddress: "", errorEmail: "", errorPhone: "", errorPassword: "", errorNewPassword: "", errorConfirmPassword: "", errorOtp: '' });
    const [showForgotPasswordFrom, setShowForgotPasswordForm] = useState(false);

    const [forgotPasswordModel, setForgotPasswordModel] = useState({ otp: '', password: '', email: '', confirmPassword: '' })
    const bagProducts = useSelector((store) => {
        return store.shoppingBag.bagProducts;
    })
    const dispatch = useDispatch();
    useEffect(() => {
        if (localStorage.getItem('user') && props.type === 'customer') {
            navigate("/user/info", { replace: true });
        }
        if (localStorage.getItem('employee') && props.type === 'employee') {
            navigate("/employee/info", { replace: true });
        }
        // return () => { login = null };
    }, [])

    const [count, setCount] = useState(0);
    const [canSend, setCanSend] = useState(true);
    let timer;
    const updateCount = () => {
        timer = !timer && setInterval(() => {
            console.log('ticking');
            setCount(prevCount => prevCount - 1);
        }, 1000);

        if (count === 0) {
            console.log('stop!');
            setCanSend(true);
            clearInterval(timer);
        }
    }

    useEffect(() => {
        updateCount()

        return () => clearInterval(timer)
    }, [count]);

    const insertOTPRequest = async () => {
        const shipInfo1 = {
            'EMAIL': forgotPasswordModel.email,
            'OTP': forgotPasswordModel.otp,
            'MAT_KHAU': forgotPasswordModel.password,
            'XAC_NHAN_MAT_KHAU': forgotPasswordModel.confirmPassword
        }
        let tmpErrorMsg = {};
        tmpErrorMsg = { errorName: "", errorAddress: "", errorEmail: "", errorOtp: "", errorPhone: "", errorPassword: "", errorNewPassword: "", errorConfirmPassword: "" };
        let hasError = false;
        setErrorMessage2(tmpErrorMsg);

        if (!shipInfo1.EMAIL) {
            console.log("no pass");
            tmpErrorMsg = { ...tmpErrorMsg, errorEmail: "*Vui lòng nhập email" }
            // setErrorMessage({...errorMessage, errorAddress: "Vui lòng nhập địa chỉ người nhận"});
            hasError = true;
        } else if (!shipInfo1.EMAIL.match(/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i)) {
            tmpErrorMsg = { ...tmpErrorMsg, errorEmail: "*Vui lòng nhập email hợp lệ" }
            //setErrorMessage({...errorMessage, errorEmail: "Vui lòng nhập email hợp lệ"});
            hasError = true;
        }

        if (hasError) {
            setErrorMessage2(tmpErrorMsg);
            return;
        }
        setIsLoading(true);
        let res1 = await axios.post('http://localhost:22081/api/KhachHang/add-otp?email=' + forgotPasswordModel.email).then(res => {
            const response = res.data;
            console.log('res delete: ' + response);
            if (response.errorDesc) {
                toast.error(response.errorDesc);
            } else {
                toast.success(response.responseMessage);
            }

        });
        setIsLoading(false);
        setCanSend(false);
        setCount(60);
        return res1;
    }
    const sendOTPEmail = () => {

    }

    const forgotPassword = async () => {
        const shipInfo1 = {
            'EMAIL': forgotPasswordModel.email,
            'OTP': forgotPasswordModel.otp,
            'MAT_KHAU': forgotPasswordModel.password,
            'XAC_NHAN_MAT_KHAU': forgotPasswordModel.confirmPassword
        }
        let tmpErrorMsg = {};
        tmpErrorMsg = { errorName: "", errorAddress: "", errorEmail: "", errorOtp: "", errorPhone: "", errorPassword: "", errorNewPassword: "", errorConfirmPassword: "" };
        let hasError = false;
        setErrorMessage2(tmpErrorMsg);

        if (!shipInfo1.EMAIL) {
            console.log("no pass");
            tmpErrorMsg = { ...tmpErrorMsg, errorEmail: "*Vui lòng nhập email" }
            // setErrorMessage({...errorMessage, errorAddress: "Vui lòng nhập địa chỉ người nhận"});
            hasError = true;
        } else if (!shipInfo1.EMAIL.match(/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i)) {
            tmpErrorMsg = { ...tmpErrorMsg, errorEmail: "*Vui lòng nhập email hợp lệ" }
            //setErrorMessage({...errorMessage, errorEmail: "Vui lòng nhập email hợp lệ"});
            hasError = true;
        }
        if (!shipInfo1.OTP) {
            console.log("no pass");
            tmpErrorMsg = { ...tmpErrorMsg, errorOtp: "*Vui lòng nhập mã xác nhận" }
            // setErrorMessage({...errorMessage, errorAddress: "Vui lòng nhập địa chỉ người nhận"});
            hasError = true;
        }
        if (!shipInfo1.MAT_KHAU) {
            console.log("no pass");
            tmpErrorMsg = { ...tmpErrorMsg, errorPassword: "*Vui lòng nhập mật khẩu" }
            // setErrorMessage({...errorMessage, errorAddress: "Vui lòng nhập địa chỉ người nhận"});
            hasError = true;
        } else if (!(shipInfo1.MAT_KHAU.length >= 6)) {
            console.log("pass < 6")
            tmpErrorMsg = { ...tmpErrorMsg, errorPassword: "*Vui lòng nhập mật khẩu ít nhất 6 ký tự" }
            // setErrorMessage({...errorMessage, errorAddress: "Vui lòng nhập địa chỉ người nhận"});
            hasError = true;
        }
        if (!(shipInfo1.XAC_NHAN_MAT_KHAU === shipInfo1.MAT_KHAU)) {
            tmpErrorMsg = { ...tmpErrorMsg, errorConfirmPassword: "*Mật khẩu xác nhận không khớp" }
            // setErrorMessage({...errorMessage, errorAddress: "Vui lòng nhập địa chỉ người nhận"});
            hasError = true;
        }
        if (hasError) {
            setErrorMessage2(tmpErrorMsg);
            return;
        }

        let res1 = await axios.put(`${REACT_APP_API_URL}/api/KhachHang/forgot-password?email=${forgotPasswordModel.email}&otp=${forgotPasswordModel.otp}&password=${forgotPasswordModel.password}`).then(res => {
            const response = res.data;
            console.log('res delete: ' + response);
            if (response.errorDesc) {
                toast.error(response.errorDesc);
            } else {
                toast.success(response.responseMessage);
                setShowForgotPasswordForm(false);
            }

            return;
        });
    }
    const login = (loginInfo) => {
        let url = '';
        if (props.type === 'customer') {
            localStorage.removeItem('user');
            url = `http://localhost:22081/api/KhachHang/login`;
        }
        else if (props.type === 'employee') {
            localStorage.removeItem('employee');
            url = `http://localhost:22081/api/NhanVien/login`;
        }
        console.log(url, {
            MAT_KHAU: loginInfo.password,
            EMAIL: loginInfo.email
        });
        setIsLoading(true);
        axios.post(url, {
            MAT_KHAU: loginInfo.password,
            EMAIL: loginInfo.email
        }).then(async res => {
            const userInfoFromRes = res.data;
            console.log(userInfoFromRes);

            if (userInfoFromRes && props.type === 'customer') {
                setErrorMessage('');
                if (!userInfoFromRes.TRANG_THAI) {
                    setIsLoading(false);
                    setErrorMessage('*Tài khoản của bạn đã bị vô hiệu hóa');
                    return;
                } else {
                    localStorage.setItem('user', JSON.stringify(userInfoFromRes));
                    console.log("---", localStorage.getItem('user'));
                    axios.get(`http://localhost:22081/api/KhachHang/favorite?customerId=${userInfoFromRes.MA_KH}`).then(respListFavorite => {
                        const listFavorite = respListFavorite.data;
                        localStorage.setItem('listFavourite', JSON.stringify(listFavorite));
                    });
                    const a = await getCurrentCartOfUser();
                    console.log(a, "utility")
                    localStorage.setItem('ccart', JSON.stringify(a));
                    dispatch(initCart(a));
                    navigate("/", { replace: true });
                }

            } else if (userInfoFromRes && props.type === 'employee') {
                setErrorMessage('');
                if (!userInfoFromRes.TRANG_THAI) {
                    setIsLoading(false);
                    setErrorMessage('*Tài khoản của bạn đã bị vô hiệu hóa, hãy liên hệ quản lý để biết chi tiết');
                    return;
                }
                localStorage.setItem('employee', JSON.stringify(userInfoFromRes));
                console.log("---", localStorage.getItem('employee'));
                if (JSON.parse(localStorage.getItem('employee')).MA_QUYEN === 'Q04') {
                    navigate("/admin/cart-management", { replace: true });
                } else {
                    navigate("/admin/dashboard", { replace: true });
                }
            } else {
                setErrorMessage('*Xem lại tài khoản và mật khẩu');
            }
            setIsLoading(false);
        });
    }
    return (<>
        {<div className={clsx(style.loginWrapper)}>

            <div className={clsx(style.left)}>
                <div className={clsx(style.imgContainer)}>
                    <img src={loginImage} alt="" className={clsx(style.loginImage)} />

                </div>
            </div>
            <div className={clsx(style.right)}>
                {isLoading ? <LoadingAnimation /> :
                    <><h1 className={clsx(style.title)}>{showForgotPasswordFrom ? 'QUÊN MẬT KHẨU' : props.type === "customer" ? 'ĐĂNG NHẬP' : 'ĐĂNG NHẬP NHÂN VIÊN'}</h1>
                        {showForgotPasswordFrom ?
                            <form className={clsx(style.form)} autoComplete="off" onSubmit={async (e) => {
                                e.preventDefault();


                            }}>
                                <div className={clsx(style.inputGroup)}>
                                    <label className={clsx(style.inputLabel)}>Email:</label>
                                    <div className={clsx(style.otpSendGroup)}>
                                        <input onChange={(e) => {
                                            setForgotPasswordModel({ ...forgotPasswordModel, email: e.target.value.trim() });
                                        }} type="text" placeholder="" value={forgotPasswordModel.email} name='email' className={clsx(style.input)} />
                                        <span onClick={(e) => {
                                            if (count > 0) {
                                                return;
                                            }
                                            insertOTPRequest();
                                        }}>
                                            {count > 0 ? count + 's' : 'Nhận mã xác thực'}
                                        </span>
                                    </div>
                                    {errorMessage2.errorEmail ? <p className={clsx(style.errorMessage)}>{errorMessage2.errorEmail}</p> : ""}

                                </div>

                                <div className={clsx(style.inputGroup)}>
                                    <label className={clsx(style.inputLabel)}>Mã xác thực:</label>
                                    <input onChange={(e) => {
                                        const re = /^[0-9\b]+$/;
                                        // if value is not blank, then test the regex
                                        if (e.target.value === '' || re.test(e.target.value)) {
                                            setForgotPasswordModel({ ...forgotPasswordModel, otp: e.target.value.trim() });
                                        }
                                    }} type="text" placeholder="Nhập mã được gửi tới email của bạn" value={forgotPasswordModel.otp} name='otp' className={clsx(style.input)} />
                                    {errorMessage2.errorOtp ? <p className={clsx(style.errorMessage)}>{errorMessage2.errorOtp}</p> : ""}
                                </div>
                                <div className={clsx(style.inputGroup)}>
                                    <label className={clsx(style.inputLabel)}>Mật khẩu mới:</label>
                                    <input autoComplete='new-password' onChange={(e) => {
                                        // setEmail(e.target.value.trim());
                                        setForgotPasswordModel({ ...forgotPasswordModel, password: e.target.value.trim() });
                                    }} type="password" placeholder="" value={forgotPasswordModel.password} name='password' className={clsx(style.input)} />
                                    {errorMessage2.errorPassword ? <p className={clsx(style.errorMessage)}>{errorMessage2.errorPassword}</p> : ""}
                                </div>
                                <div className={clsx(style.inputGroup)}>
                                    <label className={clsx(style.inputLabel)}>Xác nhận mật khẩu:</label>
                                    <input autoComplete='new-password' onChange={(e) => {
                                        // setEmail(e.target.value.trim());
                                        setForgotPasswordModel({ ...forgotPasswordModel, confirmPassword: e.target.value.trim() });
                                    }} type="password" placeholder="" value={forgotPasswordModel ? forgotPasswordModel.confirmPassword : ""} name='confirmPassword' className={clsx(style.input)} />
                                    {errorMessage2.errorConfirmPassword ? <p className={clsx(style.errorMessage)}>{errorMessage2.errorConfirmPassword}</p> : ""}
                                </div>
                                <p className={clsx(style.errorMessage)}>{errorMessage2.overAllError ? errorMessage2.overAllError : ""}</p>
                                <div className={clsx(style.inputGroup, style.changePasswordButtonGroup)}
                                    onClick={(e) => {

                                    }}>
                                    <div className={clsx()}
                                        onClick={(e) => {
                                            forgotPassword();
                                        }}>
                                        <Button text={"LƯU THÔNG TIN"} />
                                    </div>
                                    <div className={clsx()}
                                        onClick={(e) => {
                                            setShowForgotPasswordForm(false);
                                        }}>
                                        <Button text="HỦY" />
                                    </div>
                                </div>
                            </form>
                            : <form className={clsx(style.form)} onSubmit={(e) => {
                                e.preventDefault();
                                login({ 'email': email, 'password': password });
                            }}>
                                <div className={clsx(style.inputGroup)}>
                                    <label className={clsx(style.inputLabel)}>Email:</label>
                                    <input onChange={(e) => {
                                        setEmail(e.target.value.trim());
                                    }} type="text" placeholder="" value={email} name='email' className={clsx(style.input)} />
                                </div>
                                <div className={clsx(style.inputGroup)}>
                                    <label className={clsx(style.inputLabel)}>Mật khẩu:</label>
                                    <input onChange={(e) => {
                                        setPassword(e.target.value.trim());
                                    }} type="password" name='password' value={password} placeholder="" className={clsx(style.input)} />
                                </div>
                                <p className={clsx(style.errorMessage)}>{errorMessage ? errorMessage : ""}</p>

                                <div className={clsx(style.inputGroup)}>
                                    <Button text="ĐĂNG NHẬP" />
                                </div>
                            </form>}
                        {props.type === "customer" && !showForgotPasswordFrom ? < p className={clsx(style.signUpLink, style.forgotPasswordLink)}
                            onClick={() => {
                                setShowForgotPasswordForm(true);
                                setForgotPasswordModel({ ...forgotPasswordModel, otp: '', password: '', confirmPassword: '' })
                                setErrorMessage2({ errorName: "", errorAddress: "", errorEmail: "", errorPhone: "", errorPassword: "", errorNewPassword: "", errorConfirmPassword: "", errorOtp: '' })
                            }}>Quên mật khẩu?</p> : <></>}
                        {props.type === "customer" ? <p className={clsx(style.signUpLink)}
                            onClick={() => {
                                navigate("/user/sign-up", true);
                            }}>Đăng ký tài khoản</p> : <></>}

                    </>
                }
            </div>
        </div>}
    </>

    );
}

export default Login;