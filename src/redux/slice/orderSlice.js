import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    orderHistory: [],
    totalOrderAmount: null,
    returnConfig: {},
}

const orderSlice = createSlice({
    name: "orders", 
    initialState,
    reducers:{
      STORE_ORDERS(state, action){
        state.orderHistory = action.payload
      },
      CALC_TOTAL_ORDER_AMOUNT(state, action){
        const array = [];
      state.orderHistory.map((item) => {
        const { orderAmount, shippingFee } = item;
        return array.push(orderAmount, shippingFee);
      });
      const totalAmount = array.reduce((a, b) => {
        return a + b;
      }, 0);
      state.totalOrderAmount = totalAmount;
      },
      STORE_RETURN_CONFIG(state, action){
        state.returnConfig = action.payload
      }
    }
});

export const {STORE_ORDERS, CALC_TOTAL_ORDER_AMOUNT, STORE_RETURN_CONFIG} = orderSlice.actions
export const selectOrderHistory = (state) => state.orders.orderHistory
export const selectTotalOrderAmount= (state) => state.orders.totalOrderAmount
export const storeReturnConfig = (state) => state.orders.returnConfig
export default orderSlice.reducer