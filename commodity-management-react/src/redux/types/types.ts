// userSlice的state类型
export interface UserStateType {
  token: string | null;
  menuRoutes: any[];
  username: string;
  avatar: string;
}

// settingSlice的state类型
export interface SettingStateType {
  siderCollapsed: boolean;
  refresh: boolean;
}
