import React, { useEffect, forwardRef } from 'react';
import PropTypes from 'prop-types';
import { useState } from 'react'
import starOutLine32 from './star-images/star outline 32px.png';
import starOutLine16 from './star-images/star outline 16px.png';
import halfStar16 from './star-images/half-star 16px.png';
import halfStar32 from './star-images/half-star 32px.png';
import star16 from './star-images/star 16px.png';
import star32 from './star-images/star 32px.png';

import starOutLine24 from './star-images/star outline 24px.png';
import halfStar24 from './star-images/half-star 24px.png';
import star24 from './star-images/star 24px.png';
import style from './StarRatingSize24.module.css';
import clsx from 'clsx';

function StarRatingSize24(props) {
    const [val, setVal] = useState(0);
    const [toggleOnMouseLeave, setToggleOnMouseLeave] = useState(true);
    const [confirmVal, setConfirmVal] = useState(0);

    useEffect(() => {
        setVal(props.val);
        setConfirmVal(props.val);
    }, [props.val])

    return (
        <div className={clsx(style.ratingContainer, { [style.readOnly]: props.readOnly })}>
            <img src={val >= 1 ? star24 : starOutLine24} alt=""
                onMouseEnter={(e) => {
                    setToggleOnMouseLeave(true);
                    setVal(1);
                }}
                onMouseLeave={(e) => {
                    if (toggleOnMouseLeave) {
                        setVal(0);
                        props.setStarRating(0);

                    }
                }}

                onClick={(e) => {
                    props.setStarRating(1);
                    setConfirmVal(1);
                    setVal(1);
                    setToggleOnMouseLeave(false);
                }} />
            <img src={val >= 2 ? star24 : starOutLine24} alt=""
                onMouseEnter={(e) => {
                    setVal(2);
                    setToggleOnMouseLeave(true);
                }}
                onMouseLeave={(e) => {
                    if (toggleOnMouseLeave) {
                        setVal(0);
                        props.setStarRating(0);

                    }
                }}

                onClick={(e) => {
                    props.setStarRating(2);
                    setConfirmVal(2);
                    setVal(2);
                    setToggleOnMouseLeave(false);
                }} />
            <img src={val >= 3 ? star24 : starOutLine24} alt=""
                onMouseEnter={(e) => {
                    setVal(3);
                    setToggleOnMouseLeave(true);
                }}
                onMouseLeave={(e) => {
                    if (toggleOnMouseLeave) {
                        setVal(0);
                        props.setStarRating(0);

                    }
                }}

                onClick={(e) => {
                    props.setStarRating(3);
                    setConfirmVal(3);
                    setVal(3);
                    setToggleOnMouseLeave(false);
                }} />
            <img src={val >= 4 ? star24 : starOutLine24} alt=""
                onMouseEnter={(e) => {
                    setVal(4);
                    setToggleOnMouseLeave(true);
                }}
                onMouseLeave={(e) => {
                    if (toggleOnMouseLeave) {
                        setVal(0);
                        props.setStarRating(0);

                    }
                }}

                onClick={(e) => {
                    props.setStarRating(4);
                    setConfirmVal(4);
                    setVal(4);
                    setToggleOnMouseLeave(false);
                }} />
            <img src={val >= 5 ? star24 : starOutLine24} alt=""
                onMouseEnter={(e) => {
                    setVal(5);
                    setToggleOnMouseLeave(true);
                }}
                onMouseLeave={(e) => {
                    if (toggleOnMouseLeave) {
                        setVal(0);
                        props.setStarRating(0);

                    }
                }}

                onClick={(e) => {
                    props.setStarRating(5);
                    setConfirmVal(5);
                    setVal(5);
                    setToggleOnMouseLeave(false);
                }} />
        </div>
    );
}

export default forwardRef(StarRatingSize24);