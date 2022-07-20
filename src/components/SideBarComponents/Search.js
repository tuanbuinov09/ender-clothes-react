import React, { useEffect, useState } from 'react';
import style from './Search.module.css';
import clsx from 'clsx';
import Icon from 'react-hero-icon';
import { modifyKeyword } from '../../uitilities/utilities';
function Search(props) {
    const [keyWord, setKeyword ] = useState('');
    useEffect(()=>{
        console.log(keyWord);
    },[keyWord])
    console.log(keyWord);
    const onInputChange = (keyWordFromInput)=>{
        setKeyword(modifyKeyword(keyWordFromInput));
        console.log(keyWord);
    }
    return (
        <div>
            <form className={clsx(style.form)}>
                <input onChange={(e)=>{
                    onInputChange(e.target.value);
                }} value={keyWord} type="text" placeholder="Nhập từ khóa.." className={clsx(style.input)} />
                <button type='submit' className={clsx(style.btn)}><Icon icon="search"></Icon></button>
            </form>
        </div>
    );
}

export default Search;