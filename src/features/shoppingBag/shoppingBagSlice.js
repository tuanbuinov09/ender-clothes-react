import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import bagProducts from '../../productsBag.js';
import { toast } from 'react-toastify';
import axios from "axios";
import { REACT_APP_API_URL } from "../../uitilities/CONSTANT.js";
import { setupInterceptors } from "../../uitilities/utilities.js";


const initialState = {
    bagProducts: [],
    amount: 0,
    total: 0,
    // amount: totalAmount,
    // total: totalPrice,
    isLoading: true
};

// const getCurrentCartOfUser = () => {
//     if (!localStorage.getItem('user') || !JSON.parse(localStorage.getItem('user')).MA_KH) {
//         return;
//     }
//     axios.get(`${REACT_APP_API_URL}/api/KhachHang/current-cart-of-user?customerId=${JSON.parse(localStorage.getItem('user')).MA_KH}`, {
//         headers: {
//             Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user')).accessToken,
//         }
//     }).then(res => {
//         const result = res.data;
//         try {
//             axios.get(`${REACT_APP_API_URL}/api/SanPham/new-arrivals`).then(res => {
//                 const productsFromApi = res.data;

//                 let tempBagProducts = [];
//                 result.chiTietGioHang2.forEach((ctgh) => {
//                     const pd = productsFromApi.find(prod => {
//                         return prod.MA_SP === ctgh.MA_SP;
//                     });

//                     pd.chiTietSanPham = ctgh;

//                     tempBagProducts.push(pd);
//                 });

//                 console.log('setting bagprod');
//                 state.bagProducts = tempBagProducts;
//                 // console.log(productsFromApi);
//             });

//         } catch (error) {
//             console.error(error);
//         }

//         console.log('current-cart', result);

//     }).catch(function (error) {
//         if (error.response) {
//             console.log(error.response.data);
//             console.log(error.response.status);
//             console.log(error.response.headers);
//         }
//     });
// }
const insertOrUpdateInDb = (bagProducts) => {

    const GIO_HANG_ENTITY = {};
    if (!localStorage.getItem('user') || !JSON.parse(localStorage.getItem('user')).MA_KH) {
        // toast.error('Vui lòng đăng nhập để tiếp tục');
        return;
    }

    GIO_HANG_ENTITY.MA_KH = JSON.parse(localStorage.getItem('user')).MA_KH;

    GIO_HANG_ENTITY.chiTietGioHang = bagProducts.map((product) => {
        return product.chiTietSanPham[0];
    })
    console.log(GIO_HANG_ENTITY);
    axios.post(`${REACT_APP_API_URL}/api/KhachHang/add-or-update-cart`, {
        ...GIO_HANG_ENTITY
    }, {
        headers: {
            Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user')).accessToken,
        }
    }).then(res => {
        const result = res.data;
        // console.log(productsFromApi);
        console.log(result);
        // alert(result);
        // toast.success(result);
    }).catch(function (error) {
        if (error.response) {
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
        }
    });

}

export const getCurrentCart = createAsyncThunk(
    // Tên action
    'KhachHang/current-cart',

    // Code async logic, tham số đầu tiên data là dữ liệu truyền vào khi gọi action
    async (thunkAPI) => {
        if (!localStorage.getItem('user') || !JSON.parse(localStorage.getItem('user')).MA_KH) {
            return;
        }
        const cart = await axios.get(`${REACT_APP_API_URL}/api/KhachHang/current-cart-of-user?customerId=${JSON.parse(localStorage.getItem('user')).MA_KH}`, {
            headers: {
                Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user')).accessToken,
            }
        });
        console.log('current-cart', cart.data);

        const productsFromApi = await axios.get(`${REACT_APP_API_URL}/api/SanPham/new-arrivals`);
        console.log(productsFromApi);
        let tempBagProducts = [];
        cart.data.chiTietGioHang2.forEach((ctgh) => {
            const pd = productsFromApi.data.find(prod => {
                return prod.MA_SP === ctgh.MA_SP;
            });

            pd.chiTietSanPham[0] = ctgh;

            tempBagProducts.push(pd);
        });

        return tempBagProducts;
    }
);
const shoppingBagSlice = createSlice({
    name: "shoppingBag",
    initialState,
    reducers: { //reducer's'
        initCart: (state, action) => {
            console.log('here slice');
            state.bagProducts = action.payload;
            //insertOrUpdateInDb(state.bagProducts);
        },
        clearBagLogout: (state) => {
            //we dont have to return anything, usually when using redux or useReducer, we have to return new state,
            //with redux toolkit we can modify some value of the state object
            //chỉ bỏ giỏ trên front end chứ k bỏ dưới csdl
            state.bagProducts = [];
            localStorage.setItem('ccart', JSON.stringify(state.bagProducts));
        },
        clearBag: (state) => {
            //we dont have to return anything, usually when using redux or useReducer, we have to return new state,
            //with redux toolkit we can modify some value of the state object
            state.bagProducts = [];
            // state.amount = 0;
            // state.total = 0;
            localStorage.setItem('ccart', JSON.stringify(state.bagProducts));
            insertOrUpdateInDb(state.bagProducts);
        },
        addItem: (state, action) => {
            const item = action.payload;
            const product = state.bagProducts.find((product) => {
                return product.chiTietSanPham[0].MA_CT_SP === item.chiTietSanPham[0].MA_CT_SP;
            });
            // if that product isnt in bag, add it
            if (!product) {
                console.log(typeof (product));
                //-------------------spread
                state.bagProducts = [...state.bagProducts, { ...item, chiTietSanPham: [{ ...item.chiTietSanPham[0], SO_LUONG: 1, GIA: item.chiTietSanPham[0].GIA - item.chiTietSanPham[0].GIA * item.PHAN_TRAM_GIAM / 100 }] }];
            } else if (product) { //else we 'll just increase the amount
                product.chiTietSanPham[0].SO_LUONG = product.chiTietSanPham[0].SO_LUONG + 1;//tang so luong dat
            }
            localStorage.setItem('ccart', JSON.stringify(state.bagProducts));

            insertOrUpdateInDb(state.bagProducts);

        }
        ,
        removeItem: (state, action) => {
            const itemId = action.payload;
            state.bagProducts = state.bagProducts.filter((product) => {
                return product.chiTietSanPham[0].MA_CT_SP !== itemId;
            });
            // state.amount = 0;
            // state.total = 0;
            localStorage.setItem('ccart', JSON.stringify(state.bagProducts));
            insertOrUpdateInDb(state.bagProducts);

        },
        increaseAmount: (state, { payload }) => {
            const itemId = payload.id;
            const product = state.bagProducts.find((product) => {
                return product.chiTietSanPham[0].MA_CT_SP === itemId;
            });
            product.chiTietSanPham[0].SO_LUONG = product.chiTietSanPham[0].SO_LUONG + 1;
            localStorage.setItem('ccart', JSON.stringify(state.bagProducts));
            insertOrUpdateInDb(state.bagProducts);

        },
        decreaseAmount: (state, action) => {
            const itemId = action.payload;
            const product = state.bagProducts.find((product) => {
                return product.chiTietSanPham[0].MA_CT_SP === itemId;
            });
            product.chiTietSanPham[0].SO_LUONG = product.chiTietSanPham[0].SO_LUONG - 1;
            if (product.chiTietSanPham[0].SO_LUONG < 1) {
                state.bagProducts = state.bagProducts.filter((product) => {
                    return product.chiTietSanPham[0].MA_CT_SP !== itemId;
                });
            }
            localStorage.setItem('ccart', JSON.stringify(state.bagProducts));
            insertOrUpdateInDb(state.bagProducts);

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
                totalAmount = totalAmount + product.chiTietSanPham[0].SO_LUONG;
                if (product.PHAN_TRAM_KHUYEN_MAI > 0) {
                    totalPrice = totalPrice + product.chiTietSanPham[0].SO_LUONG * (product.chiTietSanPham[0].GIA - product.chiTietSanPham[0].GIA * product.PHAN_TRAM_KHUYEN_MAI / 100);
                } else {
                    totalPrice = totalPrice + product.chiTietSanPham[0].SO_LUONG * product.chiTietSanPham[0].GIA;
                }
            }
            state.amount = totalAmount;
            state.total = totalPrice;
        }
        ,
        getCurrentCartOfUser2: (state, { payload }) => {
            console.log('payload:', payload)
            state.bagProducts = payload.tempBagProducts;
        }
    },
    // Code logic xử lý async action
    extraReducers: {
        [getCurrentCart.pending]: (state) => {
            console.log('getting')
        },
        [getCurrentCart.fulfilled]: (state, { payload }) => {
            console.log('setting: ', payload)
        },
        [getCurrentCart.rejected]: (state) => {
        },
    },
});
console.log(shoppingBagSlice);

export default shoppingBagSlice.reducer;

export const { clearBag, addItem, removeItem, increaseAmount, decreaseAmount, caculateTotalAmountAndPrice, clearBagLogout, getCurrentCartOfUser2, initCart } = shoppingBagSlice.actions;



//--old redux tookit code
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
// const initialState = {
//     bagProducts: bagProducts,
//     amount: 0,
//     total: 0,
//     // amount: totalAmount,
//     // total: totalPrice,
//     isLoading: true
// };
// const shoppingBagSlice = createSlice({
//     name: "shoppingBag",
//     initialState,
//     reducers: { //reducer's'
//         clearBag: (state) => {
//             //we dont have to return anything, usually when using redux or useReducer, we have to return new state,
//             //with redux toolkit we can modify some value of the state object
//             state.bagProducts = [];
//             // state.amount = 0;
//             // state.total = 0;
//         },
//         addItem: (state, action) => {
//             const item = action.payload;
//             const product = state.bagProducts.find((product) => {
//                 return product.id === item.id;
//             });
//             // if that product isnt in bag, add it
//             if (!product) {
//                 console.log(typeof (product));
//                 //-------------------spread
//                 state.bagProducts = [...state.bagProducts, { ...item, amount: 1 }];
//             } else if (product) { //else we 'll just increase the amount
//                 product.amount = product.amount + 1;
//             }
//         }
//         ,
//         removeItem: (state, action) => {
//             const itemId = action.payload;
//             state.bagProducts = state.bagProducts.filter((product) => {
//                 return product.id !== itemId;
//             });
//             // state.amount = 0;
//             // state.total = 0;
//         },
//         increaseAmount: (state, { payload }) => {
//             const itemId = payload.id;
//             const product = state.bagProducts.find((product) => {
//                 return product.id === itemId;
//             });
//             product.amount = product.amount + 1;
//         },
//         decreaseAmount: (state, action) => {
//             const itemId = action.payload;
//             const product = state.bagProducts.find((product) => {
//                 return product.id === itemId;
//             });
//             product.amount = product.amount - 1;
//             if (product.amount < 1) {
//                 state.bagProducts = state.bagProducts.filter((product) => {
//                     return product.id !== itemId;
//                 });
//             }
//         },
//         caculateTotalAmountAndPrice: (state) => {
//             let totalAmount = 0;
//             let totalPrice = 0;
//             // state.bagProducts.forEach((product) => {
//             //     totalAmount = totalAmount + product.amount;
//             //     totalPrice = totalPrice + product.amount * product.price;
//             // });
//             for (let i = 0; i < state.bagProducts.length; i = i + 1) {
//                 const product = state.bagProducts[i];
//                 totalAmount = totalAmount + product.amount;
//                 totalPrice = totalPrice + product.amount * product.price;
//             }
//             state.amount = totalAmount;
//             state.total = totalPrice.toFixed(2);
//         }
//     }
// });

// console.log(shoppingBagSlice);

// export default shoppingBagSlice.reducer;

// export const { clearBag, addItem, removeItem, increaseAmount, decreaseAmount, caculateTotalAmountAndPrice } = shoppingBagSlice.actions;