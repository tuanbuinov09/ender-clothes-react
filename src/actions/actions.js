import * as actionTypes from './actionTypes.js';


export const buyProduct = (product) => {
    return {
        type: actionTypes.BUY_PRODUCT,
        payload: product,
    };
}

export const deleteProduct = (product) => {
    return {
        type: actionTypes.DELETE_PRODUCT,
        payload: product,
    };
}