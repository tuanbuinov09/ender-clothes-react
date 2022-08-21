import clsx from 'clsx';
import React from 'react';
import style from './LoadingAnimation.module.css';
import image from './Rolling_1s_187px.gif'
import image_60fps from './Rolling-1s-255px.gif'
function LoadingAnimation(props) {
    return (
        <div className={clsx(style.loadingWrapper)}>
            <img className={clsx(style.img)} src={image_60fps}  alt='loading'/>
        </div>
    );
}

export default LoadingAnimation;