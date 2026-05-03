import { configureStore } from "@reduxjs/toolkit";
import cardSlice from "../slices/cardSlice"


import userSlice from "../slices/userSlice"
import urlSlice from "../slices/pathSlice"
import loginSlice from "../slices/loginSlice"


export const store = configureStore({
  reducer: {
    card_state: cardSlice,
    
    path: urlSlice,
    user_data: loginSlice,
    userSlice,
  },
});