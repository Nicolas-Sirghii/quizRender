import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "authSlice",
  initialState: {
    localhost: false,
    api: localStorage.getItem("api") || "api",
  },
  reducers: {
    setApi: (state) => {
        state.localhost = !state.localhost;
        if(state.localhost){
            state.api = "http://127.0.0.1:8000"
        }
        else{
            state.api = "/api"
        }
        localStorage.setItem("api", state.api)
    }
  },
});

export const { setApi,
} = authSlice.actions;
export default authSlice.reducer;