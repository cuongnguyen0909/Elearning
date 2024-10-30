import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState = {
    token: '',
    user: '',
    isLoggedIn: false
};

interface IRegistrationPayload {
    token: string;
}

interface ILoginPayload {
    accessToken: string;
    user: any;
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        userRegistration: (
            state,
            action: PayloadAction<IRegistrationPayload>
        ) => {
            state.token = action.payload.token;
        },
        userLoggedId: (state, action: PayloadAction<any>) => {
            (state.token = action.payload.accessToken),
                (state.user = action.payload.user);
            state.isLoggedIn = true;
        },
        userLoggedOut: (state) => {
            (state.token = ''), (state.user = ''), (state.isLoggedIn = false);
        }
    }
});

export const { userRegistration, userLoggedId, userLoggedOut } =
    authSlice.actions;

export default authSlice.reducer;
