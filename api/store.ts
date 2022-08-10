import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/dist/query";
import { accountReducer } from "./accounts/accountSlice";
import { audioReducer } from "./audio/audioSlice";
import { filterReducer } from "./filter/filterSlice";
import { appReducer } from "./global/appSlice";
import { postReducer } from "./post/postSlice";
import { storeApi } from "./storeApi";
export const store = configureStore({
  reducer: {
    app: appReducer,
    account: accountReducer,
    post: postReducer,
    audio: audioReducer,
    filter: filterReducer,
    [storeApi.reducerPath]: storeApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(storeApi.middleware),
});

setupListeners(store.dispatch);

export type StoreRootState = ReturnType<typeof store.getState>;

export type StoreDispatch = typeof store.dispatch;
