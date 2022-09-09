import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import style from './ProductDetailModal.module.css';
import clsx from 'clsx';
import axios from 'axios';
import { XIcon } from '../../icons';
import ProductDetailForModal from './ProductDetailForModal';
function ProductDetailModal(props) {
    return (
        <div className={clsx(style.modalWrapper)}>

            <div className={clsx(style.modal)}>
                <h1 className={clsx(style.header)}><span className={clsx(style.closeButton)} onClick={() => {
                    props.closeDialog();
                }}><XIcon /></span></h1>

                <h1 className={clsx(style.title)}>Chi tiết sản phẩm {props.productId}</h1>

                <ProductDetailForModal productId={props.productId}/>

            </div>

        </div>

    );
}

export default ProductDetailModal;