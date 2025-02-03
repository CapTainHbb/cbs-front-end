import { createSlice } from "@reduxjs/toolkit"


export const initialState = {
    isAuthenticated: false,
}

const AuthenticationSlice = createSlice({
    name: "authentication",
    initialState,
    reducers: {
        loginSuccess(state, action) {
            state.isAuthenticated = true;
        },
        loginFailed(state, action) {
            state.isAuthenticated = false;
        }
    }
});

export const {loginSuccess, loginFailed} = AuthenticationSlice.actions;
export default AuthenticationSlice.reducer;