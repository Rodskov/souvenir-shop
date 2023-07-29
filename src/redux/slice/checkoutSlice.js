import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    shippingAddress: {},
    billingAddress: {},
    shippingFee: 0
}

const checkoutSlice = createSlice({
    name: "checkout",
    initialState,
    reducers: {
        SAVE_SHIPPING_ADDRESS(state, action) {
            state.shippingAddress = action.payload;
        },
        SAVE_BILLING_ADDRESS(state, action) {
            state.billingAddress = action.payload;
        },
        SAVE_SHIPPING_FEE(state, action) {
            state.shippingFee = action.payload
        }
    }
});

export const {SAVE_SHIPPING_ADDRESS, SAVE_BILLING_ADDRESS, SAVE_SHIPPING_FEE} = checkoutSlice.actions

export const selectShippingAddress = (state) => state.checkout.shippingAddress;

export const selectBillingAddress = (state) => state.checkout.billingAddress;

export const shippingFeeAmount = (state) => state.checkout.shippingFee  

export default checkoutSlice.reducer