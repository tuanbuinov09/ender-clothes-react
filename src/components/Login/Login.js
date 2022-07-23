import axios from 'axios';
import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import { Button } from '../Button/Button';
import style from './Login.module.css';
import { useNavigate } from "react-router-dom";
import LoadingAnimation from '../LoadingAnimation/LoadingAnimation';
function Login(props) {
    let navigate = useNavigate();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState();
    useEffect(()=>{
        if(localStorage.getItem('user')){
            navigate("/user/info", { replace: true });
        }
    },[])
    const login = (loginInfo) => {
        localStorage.removeItem('user');
        console.log(`http://localhost:22081/api/KhachHang/login`, {
            MAT_KHAU: loginInfo.password,
            EMAIL: loginInfo.email
        });
        setIsLoading(true);
        axios.post(`http://localhost:22081/api/KhachHang/login`, {
            MAT_KHAU: loginInfo.password,
            EMAIL: loginInfo.email
        }).then(res => {
            const userInfoFromRes = res.data;
            console.log(userInfoFromRes);

            if (userInfoFromRes) {
                setErrorMessage('');
                localStorage.setItem('user', JSON.stringify(userInfoFromRes));
                console.log("=---", localStorage.getItem('user'));
                navigate("/", { replace: true });
            } else {
                setErrorMessage('*Xem lại tài khoản và mật khẩu');
            }
            setIsLoading(false);
        });
    }
    return (<>
        {<div className={clsx(style.loginWrapper)}>

            <div className={clsx(style.left)}>

            </div>
            <div className={clsx(style.right)}>
                {isLoading ? <LoadingAnimation /> :
                    <><h1 className={clsx(style.title)}>ĐĂNG NHẬP</h1>
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
                    </>
                    }
                    </div>
        </div>}
    </>

    );
}

export default Login;