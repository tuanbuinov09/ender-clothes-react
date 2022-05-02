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
});

console.log(shoppingBagSlice);

export default shoppingBagSlice.reducer;