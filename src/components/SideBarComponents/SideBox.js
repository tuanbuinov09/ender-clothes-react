import clsx from 'clsx';
import React, { useEffect, useRef, useState } from 'react';
import style from './SideBox.module.css';
import Icon from "react-hero-icon";
import ShoppingBagList from './ShoppingBagList';
import Search from './Search';
import OverCoat from './OverCoat';
function SideBox(props) {
    const box = useRef();
    const timer = useRef();
    const [overActive, setOverActive] = useState(false);
    const toggleOverActive = () => {
        setOverActive(!overActive);
    }
    useEffect(() => {
        toggleOverActive();
        box.current.classList.add(style.active);
        return () => {
            console.log(timer.current);
            clearTimeout(timer.current);
        }
    }, []);
    console.log(props.type)
    return (
        <> <div className={clsx(style.box)} ref={box}>
            <div className={clsx(style.top)}>
                <h3>{props.type === "shoppingBag" ? "SHOPPING BAG" : "SEARCH"}</h3>
                <div onClick={() => {
                    toggleOverActive();
                    box.current.classList.remove(style.active);
                    //unmount search box after hiding it
                    timer.current = setTimeout(() => {
                        props.type === "shoppingBag" ? props.toggleShoppingBag() : props.toggleSearchBox();
                    }, 300);
                    // props.toggleOverCoat();
                    props.pushMain();
                }}>
                    <Icon icon='x' className={clsx(style.iconSvg)} />
                </div>
            </div>
            {props.type === "shoppingBag" ? <ShoppingBagList /> : <Search />}
        </div>
            <OverCoat active={overActive} />
        </>

    );
}

export default SideBox;