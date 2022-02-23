import clsx from 'clsx';
import React, { useEffect, useRef } from 'react';
import style from './SideBox.module.css';
import Icon from "react-hero-icon";
import ShoppingBagList from './ShoppingBagList';
import Search from './Search';
function SearchBox(props) {
    const box = useRef();
    const timer = useRef();
    useEffect(() => {
        box.current.classList.add(style.active);
        return () => {
            console.log(timer.current);
            clearTimeout(timer.current);
        }
    }, []);
    console.log(props.type)
    return (
        <div className={clsx(style.box)} ref={box}>
            <div className={clsx(style.top)}>
                <h3>{props.type === "shoppingBag" ? "SHOPPING BAG" : "SEARCH"}</h3>
                <div onClick={() => {
                    box.current.classList.remove(style.active);
                    //unmount search box after hiding it
                    timer.current = setTimeout(() => {
                        props.type === "shoppingBag" ? props.toggleShoppingBag() : props.toggleSearchBox();
                    }, 300);
                    props.toggleOverCoat();
                    props.pushMain();
                }}>
                    <Icon icon='x' className={clsx(style.iconSvg)} />
                </div>
            </div>
            {props.type === "shoppingBag" ? <ShoppingBagList /> : <Search />}
        </div>
    );
}

export default SearchBox;