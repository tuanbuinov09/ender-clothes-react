import React from 'react';
import Item from '../Item/Item';
import { Link } from 'react-router-dom';
import style from './NewArrivalsList.module.css';
import clsx from 'clsx';
function NewArrivalsList({ products }) {
    return (<div className="section">
        <div className={style.itemList}>
            {products.map((product, index) => {
                return (<Item key={index} product={product} type={1} />);
            })}
        </div>
        <div className={clsx(style.btnContainer)}><Link to="/new-arrivals" className={clsx(style.btn)}>SHOP NOW</Link></div>
    </div>);
}

export default NewArrivalsList;