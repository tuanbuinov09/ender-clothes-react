import React, { useEffect, useRef, useState } from 'react';
import style from './Search.module.css';
import clsx from 'clsx';
import Icon from 'react-hero-icon';
import { modifyKeyword } from '../../uitilities/utilities';
import Item from '../HomePage/Item/Item.js';
import axios from 'axios';
import LoadingAnimation from '../LoadingAnimation/LoadingAnimation';
import {SliderComponent} from '@syncfusion/ej2-react-inputs'
import '../../../src/components/Admin/ej2-grid.css';
function Search(props) {
    const [products, setProducts] = useState([]);
    const [flag, setFlag] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [keyword1, setKeyword1] = useState('');

    const priceSlider = useRef();

    const onInputChange = (keyWordFromInput) => {
        setKeyword1(keyWordFromInput);
        keyWordFromInput = modifyKeyword(keyWordFromInput);
        if (keyWordFromInput === 'null' || keyWordFromInput === '') {
            setProducts([]);
            setFlag(false);
            setIsLoading(false);
            return;
        }
        // search(keyWordFromInput);
    }
    const search = (keyword, priceFrom, priceTo) => {
        setIsLoading(true);
        // console.log(`http://localhost:22081/api/SanPham/search2`, {
        //     keyword: modifyKeyword(keyword),
        // });
        axios.post(`http://localhost:22081/api/SanPham/search2`, {
            keyword: modifyKeyword(keyword),
            priceFrom: priceFrom,
            priceTo: priceTo
        }).then(res => {
            const productsFromApi = res.data;
            // console.log(productsFromApi);
           
            if(productsFromApi.length===0){
                setProducts([]);
                setFlag(false);
                setIsLoading(false);
                return;
            }else{
                setProducts(productsFromApi);
                // console.log(products);
                setFlag(true);
                setIsLoading(false);
                return;
            }
        });
    }
    return (
        <div>
            <div>
                <form className={clsx(style.form)}
                    onSubmit={(e)=>{
                        e.preventDefault();
                        console.log(priceSlider.current.value);

                        let priceFrom = priceSlider.current.value[0];
                        let priceTo = priceSlider.current.value[1];

                        if (keyword1 === 'null' || keyword1 === '') {
                            setProducts([]);
                            setFlag(false);
                            setIsLoading(false);
                            return;
                        }
                        search(modifyKeyword(keyword1), priceFrom * 1000, priceTo * 1000);
                    }}>
                    <input onChange={(e) => {
                        onInputChange(e.target.value);
                    }} type="text" placeholder="Nhập từ khóa.." className={clsx(style.input)} />
                    <button type='submit' className={clsx(style.btn)}><Icon icon="search"></Icon></button>
                </form>
                <div className="sliderwrap">
                    <div className={clsx(style.labelText)}>Khoảng giá (nghìn đồng):</div>
                    <SliderComponent tooltip={{ placement: 'After', isVisible: true,/* showOn: 'Always' */}}
                    ticks= {{ placement: 'After', /*format: 'C2',*/ largeStep: 200, smallStep: 100, showSmallTicks: true }}
                     id='range' type='Range' min={0} max={1000} value={[0, 1000]} 
                     showButtons={true}
                     ref = {priceSlider}
                     />
                </div>
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