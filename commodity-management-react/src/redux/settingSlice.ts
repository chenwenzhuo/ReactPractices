import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from "@/redux/store.ts";
import {SettingStateType} from "@/redux/types/types.ts";

const settingSlice = createSlice({
  name: "setting",
  initialState: {
    siderCollapsed: false,
    refresh: false,
    themeColor: "#1677ff",
    darkMode: false,
  } as SettingStateType,
  reducers: {
    toggleSiderCollapsed(state) {
      state.siderCollapsed = !state.siderCollapsed;
    },
    toggleRefresh(state) {
      state.refresh = !state.refresh;
    },
    setThemeColor(state, action: PayloadAction<string>) {
      state.themeColor = action.payload;
    },
    setDarkMode(state, action: PayloadAction<boolean>) {
      state.darkMode = action.payload;
    }
  }
});

export const selectAllSettingState = (state: RootState) => state.setting;

export const {toggleSiderCollapsed, toggleRefresh, setThemeColor, setDarkMode} = settingSlice.actions;
export default settingSlice.reducer;
