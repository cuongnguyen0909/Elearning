// store.ts
import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from './features/api/apiSlice';
import authSlice from './features/auth/authSlice';

export const store = configureStore({
   reducer: {
      [apiSlice.reducerPath]: apiSlice.reducer,
      auth: authSlice
   },
   devTools: true,
   middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware)
});

export type RootState = ReturnType<typeof store.getState>;

// Initialize app with token refresh logic
let isRefreshing = false;

const initializeApp = async () => {
   const state = store.getState();
   if (state.auth.isLoggedIn && !isRefreshing) {
      isRefreshing = true;
      try {
         await store.dispatch(apiSlice.endpoints.refreshToken.initiate({}, { forceRefetch: true }));
         await store.dispatch(apiSlice.endpoints.loadUser.initiate({}, { forceRefetch: true }));
      } finally {
         isRefreshing = false;
      }
   }
};

//after store is created, initialize the app every 4 minutes 59 seconds to refresh token
setTimeout(() => {
   initializeApp();
   setInterval(() => {
      initializeApp();
   }, 299000);
}, 1000);
