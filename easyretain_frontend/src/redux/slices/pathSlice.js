import { createSlice } from "@reduxjs/toolkit";



const initialState = {
  path: localStorage.getItem("api") || "/api",
  pathFlag: false,
  avatar: "w",
  userData: {},
  autorized: false,
  is_loged_in: JSON.parse(localStorage.getItem("is_user_loged_in"))  || false
};

const urlSlice = createSlice({
  name: "host",
  initialState,
  reducers: {
    setLOGuser: (state, action) => {
            
            state.is_loged_in = action.payload;
            localStorage.setItem("is_user_loged_in",JSON.stringify(action.payload))
            
        },
    changePath: (state) => {
      state.pathFlag = !state.pathFlag
      if (state.pathFlag) {
        state.path = "http://127.0.0.1:8000";
      } else {
        state.path = "/api"
      }
      localStorage.setItem("api", state.path)
    },
    getAvatar: (state, action) => {
     state.avatar = action.payload;
     localStorage.setItem("userAvatar", action.payload)
     
    },
    setUserData: (state) => {
      state.userData = JSON.parse(localStorage.getItem("neonverseUser")) || {}
    },
    changeUserData: (state, action) => {
      state.userData = action.payload;
      localStorage.setItem("neonverseUser", JSON.stringify(state.userData))
    },
    cahngeAutorized: (state, action) => {
      state.autorized = action.payload
    }

  },
});

export const { changePath, getAvatar, setUserData, changeUserData, cahngeAutorized, setLOGuser} = urlSlice.actions;
export default urlSlice.reducer;