import clsx from 'clsx';
import React, { useEffect, useRef } from 'react';
import style from './SearchBox.module.css';
import Icon from "react-hero-icon";
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

    return (
        <div className={clsx(style.box)} ref={box}>
            <div className={clsx(style.top)}>
                <h3>SEARCH</h3>
                <div onClick={() => {
                    box.current.classList.remove(style.active);
                    //unmount search box after hiding it
                    timer.current = setTimeout(() => {
                        props.openSearchBox();
                    }, 300);
                    props.activeOverCoat();
                    props.pushMain();
                }}>
                    <Icon icon='x' className={clsx(style.iconSvg)} />
                </div>
            </div>
            <form className={clsx(style.form)}>
                <input type="text" placeholder="Type in your keyword..." className={clsx(style.input)} />
                <button type='submit' className={clsx(style.btn)}><Icon icon="search"></Icon></button>
            </form>
        </div>
    );
}

export default SearchBox;