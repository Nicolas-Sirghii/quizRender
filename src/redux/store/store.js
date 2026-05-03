import { configureStore } from "@reduxjs/toolkit";
import cardSlice from "../slices/cardSlice"
import authSlice from "../slices/authSlice"

export const store = configureStore({
  reducer: {
    card_state: cardSlice,
    auth_state: authSlice
  },
});