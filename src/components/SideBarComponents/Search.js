import React, { useEffect, useState } from 'react';
import style from './Search.module.css';
import clsx from 'clsx';
import Icon from 'react-hero-icon';
import { modifyKeyword } from '../../uitilities/utilities';
import Item from '../HomePage/Item/Item.js';
import axios from 'axios';
import Skeleton from 'react-loading-skeleton';
import LoadingAnimation from '../LoadingAnimation/LoadingAnimation';
function Search(props) {
    const [products, setProducts] = useState([]);
    const [flag, setFlag] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [keyword1, setKeyword1] = useState('');
    const onInputChange = (keyWordFromInput) => {
        setKeyword1(keyWordFromInput);
        keyWordFromInput = modifyKeyword(keyWordFromInput);
        if (keyWordFromInput === 'null' || keyWordFromInput === '') {
            setProducts([]);
            setFlag(false);
            setIsLoading(false);
            return;
        }
        search(keyWordFromInput);
    }
    const search = (keyword) => {
        setIsLoading(true);
        console.log(`http://localhost:22081/api/SanPham/search2`, {
            keyword: modifyKeyword(keyword),
        });
        axios.post(`http://localhost:22081/api/SanPham/search2`, {
            keyword: modifyKeyword(keyword),
        }).then(res => {
            const productsFromApi = res.data;
            // console.log(productsFromApi);
            setProducts(productsFromApi);
            // console.log(products);
            setFlag(true);
            setIsLoading(false);
        });
    }
    return (
        <div>
            <div>
                <form className={clsx(style.form)}>
                    <input onChange={(e) => {
                        setTimeout(function () {
                            onInputChange(e.target.value);
                        }, 500);
                    }} type="text" placeholder="Nhập từ khóa.." className={clsx(style.input)} />
                    <button type='submit' className={clsx(style.btn)}><Icon icon="search"></Icon></button>
                </form>
            </div>
            {isLoading ? <div className={clsx(style.flex_1, style.list)}>
                <LoadingAnimation/>
            </div> : <>
                {!flag ? <div className={clsx(style.flex_1, style.list)}>
                    <h1>Không có kết quả.</h1>
                </div> : keyword1 ? <div className={clsx(style.flex_1, style.list)}>{
                    products.length > 0 && products !== 'null' ?
                        <div className={clsx()}>
                            {products.map((product, index) => {
                                return (<Item key={index} product={product} type="search-item" />);
                            })}
                        </div>
                        : <div>
                            <h1>Không có kết quả.</h1>
                        </div>
                }</div> : <div className={clsx(style.flex_1, style.list)}>
                    <h1>Không có kết quả.</h1>
                </div>
                }</>}
        </div>
    );
}

export default Search;