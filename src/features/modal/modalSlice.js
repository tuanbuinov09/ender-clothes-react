import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isOpen: false,
};
const modalSlice = createSlice({
    name: "modal",
    initialState,
    reducers: { //reducer's'
        openModal: (state, action) => {
            state.isOpen = true;
        },
        closeModal: (state, action) => {
            state.isOpen = false;
        }
    }
});

console.log(modalSlice);

export default modalSlice.reducer;

export const { openModal, closeModal } = modalSlice.actions;