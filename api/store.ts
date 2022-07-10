import AsyncStorage from "@react-native-async-storage/async-storage";
import { configureStore } from "@reduxjs/toolkit";
import { ASYNC_STORAGE_APP_STATE_KEY } from "../constants/constants";
import { appReducer, AppSliceState, initAppState } from "./global/appSlice";

export const store = configureStore({
  reducer: {
    app: appReducer,
  },
});

export type StoreRootState = ReturnType<typeof store.getState>;

export type StoreDispatch = typeof store.dispatch;

export const initStore = async () => {
  try {
    //get the last updated app state from the async storage set the global store
    const result = await AsyncStorage.getItem(ASYNC_STORAGE_APP_STATE_KEY);

    if (result === null) {
      const initialState = store.getState().app.info;
      initialState.lastActiveTimstamp = Date.now();
      await AsyncStorage.setItem(
        ASYNC_STORAGE_APP_STATE_KEY,
        JSON.stringify(initialState)
      );
    } else {
      const initialState = JSON.parse(result) as AppSliceState["info"];

      store.dispatch(initAppState(initialState));

      ////uddate the last active timestamp to current timestamp
      initialState.lastActiveTimstamp = Date.now();

      //update the async storage for next time
      await AsyncStorage.setItem(
        ASYNC_STORAGE_APP_STATE_KEY,
        JSON.stringify(initialState)
      );
    }
  } catch (error) {}
};
