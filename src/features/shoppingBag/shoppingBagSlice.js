import { createSlice } from "@reduxjs/toolkit";
import bagProducts from '../../productsBag.js';
const initialState = {
    bagProducts: bagProducts,
    amount: 1,
    total: 0,
    isLoading: true
};
const shoppingBagSlice = createSlice({
    name: "shoppingBag",
    initialState,
    reducer: {
        clearBag: (state) => {
            //we dont have to return anything, usually when using redux or useReducer, we have to return new state,
            //with redux toolkit we can modify some value of the state object
            state.bagProducts = [];
            state.amount = 0;
            state.total = 0;
        }
    }
});

console.log(shoppingBagSlice);

export default shoppingBagSlice.reducer;

export const { clearBag } = shoppingBagSlice.actions;