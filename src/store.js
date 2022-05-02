import { configureStore } from "@reduxjs/toolkit";
import shoppingBagReducer from './features/shoppingBag/shoppingBagSlice.js'
export const store = configureStore({
    reducer: {
        shoppingBag: shoppingBagReducer
    },
});