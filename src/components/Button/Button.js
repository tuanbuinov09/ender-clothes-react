import React from 'react';
import clsx from 'clsx';
import style from './Button.module.css';
export const Button = (props) => {
    return (
        <>
            {
                props.text === "ĐĂNG NHẬP" ? <div className={clsx(style.btnContainer,style.btnLoginContainer)}>
                    <button type='submit' className={clsx(style.btn, style.btnLogin)}>{props.text}</button>
                </div> : <div
                    className={clsx(style.btnContainer)}>
                    <button className={clsx(style.btn,
                        props.text === "ĐỒNG Ý" ? style.btnConfirm
                            : props.text === "HỦY" ? style.btnCancel : props.text === "XÓA TẤT CẢ" ? style.btnClearAll
                                : style.btnOrder)}>{props.text}</button>
                </div>
            }
        </>
    );
};