import axios from 'axios';
import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import { Button } from '../Button/Button';
import style from './Login.module.css';
import { useNavigate } from "react-router-dom";
import LoadingAnimation from '../LoadingAnimation/LoadingAnimation';
import loginImage from './062_Outline_OnlineShopping_MS.jpg'
function Login(props) {
    let navigate = useNavigate();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState();
    useEffect(() => {
        if (localStorage.getItem('user') && props.type === 'customer') {
            navigate("/user/info", { replace: true });
        }
        if (localStorage.getItem('employee') && props.type === 'employee') {
            navigate("/employee/info", { replace: true });
        }
        // return () => { login = null };
    }, [])
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
        }).then(res => {
            const userInfoFromRes = res.data;
            console.log(userInfoFromRes);

            if (userInfoFromRes && props.type === 'customer') {
                setErrorMessage('');
                localStorage.setItem('user', JSON.stringify(userInfoFromRes));
                console.log("---", localStorage.getItem('user'));
                axios.get(`http://localhost:22081/api/KhachHang/favorite?customerId=${userInfoFromRes.MA_KH}`).then(respListFavorite => {
                    const listFavorite = respListFavorite.data;
                    localStorage.setItem('listFavourite', JSON.stringify(listFavorite));
                });
                navigate("/", { replace: true });
            } else if (userInfoFromRes && props.type === 'employee') {
                setErrorMessage('');
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
                    <><h1 className={clsx(style.title)}>{props.type === "customer" ? 'ĐĂNG NHẬP' : 'ĐĂNG NHẬP NHÂN VIÊN'}</h1>
                        <form className={clsx(style.form)} onSubmit={(e) => {
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
                            <p className={clsx(style.errorMessage)}>{errorMessage}</p>

                            <div className={clsx(style.inputGroup)}>
                                <Button text="ĐĂNG NHẬP" />
                            </div>
                        </form>

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