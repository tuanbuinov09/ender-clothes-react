import { configureStore } from "@reduxjs/toolkit";
import shoppingBagReducer from './features/shoppingBag/shoppingBagSlice.js';
import modalSliceReducer from './features/modal/modalSlice.js';
export const store = configureStore({
    reducer: {
        shoppingBag: shoppingBagReducer,
        modal: modalSliceReducer,
    },
});