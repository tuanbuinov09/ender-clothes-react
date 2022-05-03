import { createSlice } from "@reduxjs/toolkit";
import bagProducts from '../../productsBag.js';


//-------- in Header.js and ShoppingBagList.js I used useEffect to dispatch caculateTotalAmountAndPrice()
// ------- so we don't have to cal it here
// let totalAmount = 0;
// let totalPrice = 0;

// for (let i = 0; i < bagProducts.length; i = i + 1) {
//     const product = bagProducts[i];
//     totalAmount = totalAmount + product.amount;
//     totalPrice = totalPrice + product.amount * product.price;
// }
// totalPrice = totalPrice.toFixed(2);
const initialState = {
    bagProducts: bagProducts,
    amount: 0,
    total: 0,
    // amount: totalAmount,
    // total: totalPrice,
    isLoading: true
};
const shoppingBagSlice = createSlice({
    name: "shoppingBag",
    initialState,
    reducers: { //reducer's'
        clearBag: (state) => {
            //we dont have to return anything, usually when using redux or useReducer, we have to return new state,
            //with redux toolkit we can modify some value of the state object
            state.bagProducts = [];
            // state.amount = 0;
            // state.total = 0;
        },
        addItem: (state, action) => {
            const item = action.payload;
            const product = state.bagProducts.find((product) => {
                return product.id === item.id;
            });
            // if that product isnt in bag, add it
            if (!product) {
                console.log(typeof (product));
                //-------------------spread
                state.bagProducts = [...state.bagProducts, { ...item, amount: 1 }];
            } else if (product) { //else we 'll just increase the amount
                product.amount = product.amount + 1;
            }
        }
        ,
        removeItem: (state, action) => {
            const itemId = action.payload;
            state.bagProducts = state.bagProducts.filter((product) => {
                return product.id !== itemId;
            });
            // state.amount = 0;
            // state.total = 0;
        },
        increaseAmount: (state, { payload }) => {
            const itemId = payload.id;
            const product = state.bagProducts.find((product) => {
                return product.id === itemId;
            });
            product.amount = product.amount + 1;
        },
        decreaseAmount: (state, action) => {
            const itemId = action.payload;
            const product = state.bagProducts.find((product) => {
                return product.id === itemId;
            });
            product.amount = product.amount - 1;
            if (product.amount < 1) {
                state.bagProducts = state.bagProducts.filter((product) => {
                    return product.id !== itemId;
                });
            }
        },
        caculateTotalAmountAndPrice: (state) => {
            let totalAmount = 0;
            let totalPrice = 0;
            // state.bagProducts.forEach((product) => {
            //     totalAmount = totalAmount + product.amount;
            //     totalPrice = totalPrice + product.amount * product.price;
            // });
            for (let i = 0; i < state.bagProducts.length; i = i + 1) {
                const product = state.bagProducts[i];
                totalAmount = totalAmount + product.amount;
                totalPrice = totalPrice + product.amount * product.price;
            }
            state.amount = totalAmount;
            state.total = totalPrice.toFixed(2);
        }
    }
});

console.log(shoppingBagSlice);

export default shoppingBagSlice.reducer;

export const { clearBag, addItem, removeItem, increaseAmount, decreaseAmount, caculateTotalAmountAndPrice } = shoppingBagSlice.actions;