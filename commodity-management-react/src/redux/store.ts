import {configureStore} from "@reduxjs/toolkit";
import userSlice from "@/redux/userSlice.ts";
import settingSlice from "@/redux/settingSlice.ts";

const store = configureStore({
  reducer: {
    user: userSlice,
    setting: settingSlice,
  }
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export default store;
