import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name:"user",
    initialState:{
        userData:null,
        authLoading:true
    },
    reducers:{
        setUserData : (state,action)=>{
            state.userData = action.payload
            // the auth check has resolved once we know who the user is (or isn't)
            state.authLoading = false
        }
    }
})

export const {setUserData} = userSlice.actions;

export default userSlice.reducer