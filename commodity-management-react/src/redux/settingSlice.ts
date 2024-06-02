import {createSlice} from "@reduxjs/toolkit";

const settingSlice = createSlice({
  name: "setting",
  initialState: {
    siderCollapsed: false,
  },
  reducers: {
    toggleSiderCollapsed(state) {
      state.siderCollapsed = !state.siderCollapsed;
    }
  }
});

export const {toggleSiderCollapsed} = settingSlice.actions;
export default settingSlice.reducer;
