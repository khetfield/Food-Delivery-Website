import { deleteReq, postReq, putReq } from "./utils";

import { createSlice } from "@reduxjs/toolkit";
import { resetAll } from "./utils";
import { createItem, deleteItem } from "./items";

export const thunkGetAllBusinesses = () => async (dispatch) => {
  const res = await fetch("/api/user_businesses/all");
  const resBody = await res.json();
  if (res.ok) dispatch(getAllBusinesses(resBody.businesses));
  return resBody;
};

export const thunkGetOneBusiness = (businessId) => async (dispatch) => {
  try {
    const res = await fetch(`/api/user_businesses/${businessId}`);
    const resBody = await res.json();
    if (res.ok) dispatch(getOneBusiness(resBody.business));
    return resBody;
  } catch (e) {
    return { errors: e };
  }
};

export const thunkCreateBusiness = (business) => async (dispatch) => {
  const res = await postReq("/api/user_businesses/new", business);
  const resBody = await res.json();
  if (res.ok) dispatch(createBusiness(resBody.business));
  return resBody;
};

export const thunkEditBusiness = (business) => async (dispatch) => {
  const url = `/api/user_businesses/${business.get("id")}/edit`;
  const res = await putReq(url, business);
  const resBody = await res.json();
  if (res.ok) dispatch(editBusiness(resBody.business));
  return resBody;
};

export const thunkDeleteBusiness = (businessId) => async (dispatch) => {
  const url = `/api/user_businesses/${businessId}/delete`;
  const res = await deleteReq(url);
  const resBody = await res.json();
  if (res.ok) dispatch(deleteBusiness(businessId));
  return resBody;
};

export const thunkCreateCategory = (category) => async (dispatch) => {
  const res = await postReq(`/api/categories/new`, category);
  const resBody = await res.json();
  if (res.ok) dispatch(createCategory(resBody.category));
  return resBody;
};

export const thunkEditCategory = (category) => async (dispatch) => {
  const url = `/api/categories/${category.id}/edit`;
  const res = await putReq(url, category);
  const resBody = await res.json();
  if (res.ok) dispatch(editCategory(resBody.category));
  return resBody;
};

export const thunkReorderCategories = (order) => async (dispatch) => {
  const res = await putReq(`/api/categories/reorder`, order);
  const resBody = await res.json();
  if (res.ok) dispatch(reorderCategories(order.categories));
  return resBody;
};

export const thunkDeleteCategory = (categoryId) => async (dispatch) => {
  const res = await deleteReq(`/api/categories/${categoryId}/delete`);
  const resBody = await res.json();
  if (res.ok) dispatch(deleteCategory({ id: categoryId }));
  return resBody;
};

const initialState = { allBusinesses: {}, singleBusiness: {} };

export const userBusinessSlice = createSlice({
  name: "userBusinesses",
  initialState,
  reducers: {
    getAllBusinesses: (state, action) => {
      state.allBusinesses = action.payload;
    },
    getOneBusiness: (state, action) => {
      state.singleBusiness = { ...action.payload };
      state.singleBusiness.items = Object.keys(action.payload.items);
    },
    createBusiness: (state, action) => {
      state.allBusinesses[action.payload.id] = action.payload;
      state.singleBusiness = action.payload;
      state.singleBusiness.items = [];
    },
    editBusiness: (state, action) => {
      state.allBusinesses[action.payload.id] = action.payload;
      const items = state.singleBusiness.items;
      state.singleBusiness = action.payload;
      state.singleBusiness.items = items;
    },
    deleteBusiness: (state, action) => {
      delete state.allBusinesses[action.payload.id];
      if (state.singleBusiness.id === action.payload.id) {
        state.singleBusiness = {};
      }
    },
    createCategory: (state, action) => {
      const category = action.payload;
      state.singleBusiness.categories[category.id] = category;
    },
    editCategory: (state, action) => {
      const category = action.payload;
      state.singleBusiness.categories[category.id] = category;
    },
    deleteCategory: (state, action) => {
      delete state.singleBusiness.categories[action.payload.id];
    },
    reorderCategories: (state, action) => {
      Object.entries(action.payload).forEach(([id, order]) => {
        state.singleBusiness.categories[id].order = order;
      });
    },
    swapItemCategory: (state, action) => {
      const { start, end } = action.payload;
      if (start) state.singleBusiness.categories[start.id] = start;
      if (end) state.singleBusiness.categories[end?.id] = end;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(createItem, (state, action) => {
        const { categoryId } = action.payload;
        if (state.singleBusiness.categories[categoryId]) {
          state.singleBusiness.categories[categoryId].count += 1;
        }
      })
      .addCase(deleteItem, (state, action) => {
        const { categoryId } = action.payload;
        if (state.singleBusiness.categories[categoryId]) {
          state.singleBusiness.categories[categoryId].count -= 1;
        }
      })
      .addCase(resetAll, () => initialState);
  },
});

export const {
  getAllBusinesses,
  getOneBusiness,
  createBusiness,
  editBusiness,
  deleteBusiness,
  createCategory,
  editCategory,
  deleteCategory,
  reorderCategories,
  swapItemCategory,
} = userBusinessSlice.actions;

export default userBusinessSlice.reducer;

export const selectAllUserBusinesses = (state) =>
  state.userBusinesses.allBusinesses;
export const selectSingleUserBusiness = (state) =>
  state.userBusinesses.singleBusiness;
export const selectCategories = (state) =>
  state.userBusinesses.singleBusiness.categories;
export const selectCategoryById = (id) => (state) =>
  state.userBusinesses.singleBusiness.categories[id];
