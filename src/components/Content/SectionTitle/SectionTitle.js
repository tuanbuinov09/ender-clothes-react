import clsx from 'clsx';
import React from 'react';
import style from './SectionTitle.module.css';
function SectionTitle(props) {
    return (
        <h1 className={clsx(style.title)}>{props.title.toUpperCase()}</h1>
    );
}

export default SectionTitle;