import clsx from 'clsx';
import React from 'react';
import style from './OverCoat.module.css'
function OverCoat(props) {
    return (
        <div className={clsx(style.overCoat, { [style.active]: props.active })}>

        </div>
    );
}

export default OverCoat;