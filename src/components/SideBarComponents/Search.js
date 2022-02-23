import React from 'react';
import style from './Search.module.css';
import clsx from 'clsx';
import Icon from 'react-hero-icon';
function Search(props) {
    return (
        <div>
            <form className={clsx(style.form)}>
                <input type="text" placeholder="Type in your keyword..." className={clsx(style.input)} />
                <button type='submit' className={clsx(style.btn)}><Icon icon="search"></Icon></button>
            </form>
        </div>
    );
}

export default Search;