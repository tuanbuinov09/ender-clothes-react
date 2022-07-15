import React from 'react';
import bannerImage from './xmodel_3.png.pagespeed.ic.IuWWDLqA4l.webp';
import {
    Link
} from "react-router-dom";
import style from "./Banner.module.css";
import clsx from 'clsx';
function Banner() {
    return (
        <div className={style.cover}>
            <div className={clsx(style.imgContainer)}>
                <img src={bannerImage} alt="banner" />
            </div>
            <div className={clsx(style.right)}>
                <h3 className={clsx(style.subTitle)}>
                    #BỘ SƯU TẬP HÈ 2022
                </h3>
                <h1 className={clsx(style.title)}>
                    HÀNG MỚI VỀ
                </h1>
                <Link to="/new-arrivals" className={clsx(style.btn)}>XEM CHI TIẾT</Link>
            </div>
        </div>
    );
}

export default Banner;