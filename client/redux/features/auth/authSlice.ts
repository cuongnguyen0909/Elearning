// authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Helper function to check if we're in the browser
const isBrowser = typeof window !== 'undefined';

const initialState = {
    token: isBrowser ? localStorage.getItem('token') || '' : '',
    user: '',
    isLoggedIn: isBrowser
        ? localStorage.getItem('isLoggedIn') === 'true'
        : false
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
            if (isBrowser) localStorage.setItem('token', action.payload.token);
        },
        userLoggedIn: (state, action: PayloadAction<ILoginPayload>) => {
            state.token = action.payload.accessToken;
            state.user = action.payload.user;
            state.isLoggedIn = true;
            if (isBrowser) {
                localStorage.setItem('token', action.payload.accessToken);
                // localStorage.setItem(
                //     'user',
                //     JSON.stringify(action.payload.user)
                // );
                localStorage.setItem('isLoggedIn', 'true');
            }
        },
        userLoggedOut: (state) => {
            state.token = '';
            state.user = '';
            state.isLoggedIn = false;
            if (isBrowser) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                localStorage.setItem('isLoggedIn', 'false');
            }
        }
    }
});

export const { userRegistration, userLoggedIn, userLoggedOut } =
    authSlice.actions;
export default authSlice.reducer;
