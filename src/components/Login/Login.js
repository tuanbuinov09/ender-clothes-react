import clsx from 'clsx';
import React from 'react';
import { Button } from '../Button/Button';
import style from './Login.module.css';
function Login(props) {
    return (
        <div className={clsx(style.loginWrapper)}>
            <div className={clsx(style.left)}>
            <form className={clsx(style.form)}>
                <div className={clsx(style.inputGroup)}>
                    <label className={clsx(style.inputLabel)}>Email:</label>
                <input onChange={(e) => {
                    }} type="text" placeholder="" className={clsx(style.input)} />
                </div>
                <div className={clsx(style.inputGroup)}>
                    <label className={clsx(style.inputLabel)}>Mật khẩu:</label>
                <input onChange={(e) => {
                    }} type="password" placeholder="" className={clsx(style.input)} />
                </div>
                <p className={clsx(style.errorMessage)}>*Báo lỗi</p>
                <div className={clsx(style.inputGroup)}>
                   <Button text="ĐĂNG NHẬP" />
                   </div>
                </form>
            </div>
            <div className={clsx(style.right)}>

            </div>
        </div>
    );
}

export default Login;