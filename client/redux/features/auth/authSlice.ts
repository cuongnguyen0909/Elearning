import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    token: '',
    user: ''
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        userRegistration: (state, action) => {
            state.token = action.payload.token;
        },
        userLoggedId: (state, action) => {
            (state.token = action.payload.accessToken),
                (state.user = action.payload.user);
        },
        userLoggedOut: (state) => {
            (state.token = ''), (state.user = '');
        }
    }
});

export const { userRegistration, userLoggedId, userLoggedOut } =
    authSlice.actions;

export default authSlice.reducer;
