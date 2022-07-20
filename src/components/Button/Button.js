import React from 'react';
import clsx from 'clsx';
import style from './Button.module.css';
export const Button = (props) => {
    return (
        <div
            className={clsx(style.btnContainer)}>
            <button className={clsx(style.btn,
                props.text === "ĐỒNG Ý" ? style.btnConfirm
                    : props.text === "HỦY" ? style.btnCancel : style.btnClearAll)}>{props.text}</button>
        </div>
    );
};