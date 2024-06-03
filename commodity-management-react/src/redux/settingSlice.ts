import {createSlice} from "@reduxjs/toolkit";
import {RootState} from "@/redux/store.ts";

const settingSlice = createSlice({
  name: "setting",
  initialState: {
    siderCollapsed: false,
  },
  reducers: {
    toggleSiderCollapsed(state) {
      state.siderCollapsed = !state.siderCollapsed;
    },
  }
});

export const selectAllSettingState = (state: RootState) => state.setting;

export const {toggleSiderCollapsed} = settingSlice.actions;
export default settingSlice.reducer;
