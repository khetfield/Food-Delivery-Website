import businesses from "./businesses";
import carts from "./carts";
import { configureStore } from "@reduxjs/toolkit";
import items from "./items";
import session from "./session";
import userBusinesses from "./userBusinesses";

export default configureStore({
  reducer: {
    session,
    businesses,
    userBusinesses,
    items,
    carts,
  },
});
