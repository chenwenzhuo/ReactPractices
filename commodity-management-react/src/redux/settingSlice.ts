import {createSlice} from "@reduxjs/toolkit";
import {RootState} from "@/redux/store.ts";
import {SettingStateType} from "@/redux/types/types.ts";

const settingSlice = createSlice({
  name: "setting",
  initialState: {
    siderCollapsed: false,
    refresh: false,
  } as SettingStateType,
  reducers: {
    toggleSiderCollapsed(state) {
      state.siderCollapsed = !state.siderCollapsed;
    },
    toggleRefresh(state) {
      state.refresh = !state.refresh;
    }
  }
});

export const selectAllSettingState = (state: RootState) => state.setting;

export const {toggleSiderCollapsed, toggleRefresh} = settingSlice.actions;
export default settingSlice.reducer;
