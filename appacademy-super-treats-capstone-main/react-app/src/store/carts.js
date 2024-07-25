import { deleteReq, postReq, putReq } from "./utils";

import { createSlice } from "@reduxjs/toolkit";
import { getCartItems } from "./items";
import { resetAll } from "./utils";

export const thunkGetAllCarts = () => async (dispatch) => {
  const res = await fetch("/api/carts/current");
  const resBody = await res.json();
  if (res.ok) {
    dispatch(getAllCarts(resBody.carts));
    dispatch(getCartItems(resBody.items));
  }
  return resBody;
};

export const thunkAddToCart = (item) => async (dispatch) => {
  const res = await postReq("/api/carts/add_item", item);
  const resBody = await res.json();
  if (res.ok) dispatch(addToCart({ ...resBody, itemId: item.id }));
  return resBody;
};

export const thunkDeleteCart = (cart) => async (dispatch) => {
  const res = await deleteReq(`/api/carts/${cart.id}/delete`);
  const resBody = await res.json();
  if (res.ok) dispatch(deleteCart({ id: cart.businessId }));
  return resBody;
};

export const thunkEditCartItem = (cartItem) => async (dispatch) => {
  const url = `/api/carts/${cartItem.cartId}/items/${cartItem.id}/edit`;
  const res = await putReq(url, cartItem);
  const resBody = await res.json();
  if (res.ok) dispatch(editCartItem(resBody));
  return resBody;
};

export const thunkDeleteCartItem = (cartItem) => async (dispatch) => {
  const url = `/api/carts/${cartItem.cartId}/items/${cartItem.id}/delete`;
  const res = await deleteReq(url);
  const resBody = await res.json();
  if (res.ok) {
    if (resBody.message) dispatch(deleteCart({ id: cartItem.businessId }));
    else dispatch(deleteCartItem({ id: cartItem.id, cart: resBody.cart }));
  }
  return resBody;
};

const initialState = { carts: {} };

export const cartSlice = createSlice({
  name: "carts",
  initialState,
  reducers: {
    getAllCarts: (state, action) => {
      state.carts = action.payload;
    },
    addToCart: (state, action) => {
      const { cart } = action.payload;
      state.carts[cart.businessId] = cart;
    },
    deleteCart: (state, action) => {
      delete state.carts[action.payload.id];
    },
    editCartItem: (state, action) => {
      const { cartItem, cart } = action.payload;
      state.carts[cart.businessId] = {
        ...state.carts[cart.businessId],
        ...cart,
      };
      state.carts[cart.businessId].cartItems[cartItem.id] = cartItem;
    },
    deleteCartItem: (state, action) => {
      const { id, cart } = action.payload;
      state.carts[cart.businessId] = {
        ...state.carts[cart.businessId],
        ...cart,
      };
      delete state.carts[cart.businessId].cartItems[id];
    },
  },
  extraReducers(builder) {
    builder.addCase(resetAll, () => initialState);
  },
});

export const {
  getAllCarts,
  addToCart,
  deleteCart,
  editCartItem,
  deleteCartItem,
} = cartSlice.actions;

export default cartSlice.reducer;

export const selectAllCarts = (state) => state.carts.carts;
export const selectCartForBusiness = (businessId) => (state) =>
  state.carts.carts[businessId];
export const selectCartItemForBusinessById = (businessId, itemId) => (state) =>
  state.carts.carts[businessId]?.cartItems[itemId];
