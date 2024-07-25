import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { resetAll } from "./utils";

export const fetchAllBusinesses = createAsyncThunk(
  "businesses/fetchAllBusinesses",
  async () => {
    const res = await fetch("/api/businesses/all");
    const resBody = await res.json();
    return resBody;
  }
);

export const thunkGetOneBusiness = (businessId) => async (dispatch) => {
  try {
    const res = await fetch(`/api/businesses/${businessId}`);
    const resBody = await res.json();
    if (res.ok) dispatch(getOneBusiness(resBody.business));
    return resBody;
  } catch (e) {
    return { errors: e };
  }
};

const initialState = {
  allBusinesses: {},
  singleBusiness: {},
  status: "idle",
  error: null,
  orderIndex: 0,
  filters: "",
};

export const businessSlice = createSlice({
  name: "businesses",
  initialState,
  reducers: {
    getOneBusiness: (state, action) => {
      state.singleBusiness = { ...action.payload };
      state.singleBusiness.items = Object.keys(action.payload.items);
    },
    changeOrder: (state, action) => {
      state.orderIndex = action.payload;
    },
    changeFilter: (state, action) => {
      state.filters = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchAllBusinesses.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchAllBusinesses.fulfilled, (state, action) => {
        state.status = "succeeded";
        const { businesses } = action.payload;
        state.allBusinesses = businesses;
      })
      .addCase(fetchAllBusinesses.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error;
      })
      .addCase(resetAll, () => initialState);
  },
});

export const { getAllBusinesses, getOneBusiness, changeOrder, changeFilter } =
  businessSlice.actions;

export const selectAllBusinesses = (state) => state.businesses.allBusinesses;
export const selectSingleBusiness = (state) => state.businesses.singleBusiness;
export const selectBusinessStatus = (state) => state.businesses.status;
export const selectBusinessById = (id) => (state) =>
  state.businesses.allBusinesses[id];
export const selectBusinessOrderingIndex = (state) =>
  state.businesses.orderIndex;
export const selectBusinessFilters = (state) => state.businesses.filters;

export default businessSlice.reducer;
