import {configureStore} from "@reduxjs/toolkit";
import userSlice from "@/redux/userSlice.ts";
import settingSlice from "@/redux/settingSlice.ts";

const store = configureStore({
  reducer: {
    user: userSlice,
    setting: settingSlice,
  }
});

// 从 store 本身推断出 `RootState` 和 `AppDispatch` 类型
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export default store;
