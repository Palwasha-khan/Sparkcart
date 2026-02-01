import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cartItems: localStorage.getItem("cartItems")
    ? JSON.parse(localStorage.getItem("cartItems"))
    : [],
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCartItem: (state, action) => {
      const item = action.payload;

      const isItemExist = state.cartItems.find(
        (i) => i.product === item.product
      );

      if (isItemExist) {
        state.cartItems = state.cartItems.map((i) =>
          i.product === isItemExist.product ? item : i
        );
      } else {
        state.cartItems.push(item); // ✅ keep array
      }

      localStorage.setItem(
        "cartItems",
        JSON.stringify(state.cartItems)
      );
    },
     removeCartItem: (state, action) => {
      const productId = action.payload;

      state.cartItems = state.cartItems.filter(
        (item) => item.product !== productId
      );

      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },
  },
});

export const { setCartItem ,removeCartItem} = cartSlice.actions;
export default cartSlice.reducer;
