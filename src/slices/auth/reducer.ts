import { createSlice } from "@reduxjs/toolkit"


export const initialState = {
    userProfile: {},
    loading: true,
    isAuthenticated: false,
}

const AuthenticationSlice = createSlice({
    name: "authentication",
    initialState,
    reducers: {
        loginSuccess(state, action) {
            state.isAuthenticated = true;
            state.loading = false;
            state.userProfile = action.payload;
        },
        loginFailed(state, action) {
            state.isAuthenticated = false;
            state.loading = false;
            state.userProfile = {}
        }
    }
});

export const {loginSuccess, loginFailed} = AuthenticationSlice.actions;
export default AuthenticationSlice.reducer;