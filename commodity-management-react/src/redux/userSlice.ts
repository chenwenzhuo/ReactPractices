import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {AppDispatch, RootState} from "@/redux/store.ts";
import {LoginForm, LoginResponse} from "@/api/user/types.ts";
import {reqLogin, reqUserInfo} from "@/api/user";
import {UserStateType} from "@/redux/types/types.ts";

// 用户数据仓库
const userSlice = createSlice({
  name: "user",
  initialState: {
    // 用户的唯一标识。登录成功后将存储到localStorage中，故默认从这里读取
    token: localStorage.getItem('TOKEN'),
    username: '',
    avatar: '',
    menuRoutes: [
      {path: 'home', name: '首页'},
      {
        path: 'acl', name: '权限管理',
        children: [
          {path: 'user', name: '用户管理'},
          {path: 'role', name: '角色管理'},
          {path: 'permission', name: '菜单管理'},
        ],
      },
      {
        path: 'product', name: '商品管理',
        children: [
          {path: 'trademark', name: '品牌管理'},
          {path: 'attr', name: '属性管理'},
          {path: 'spu', name: 'SPU管理'},
          {path: 'sku', name: 'SKU管理'},
        ],
      },
    ],
  } as UserStateType,
  reducers: {
    setToken: (state, action: PayloadAction<string | null>) => {
      state.token = action.payload;
    },
    setUsername: (state, action: PayloadAction<string>) => {
      state.username = action.payload;
    },
    setAvatar: (state, action: PayloadAction<string>) => {
      state.avatar = action.payload;
    }
  },
});

const {setToken, setUsername, setAvatar} = userSlice.actions;

// 异步action creator，返回一个thunk函数
export const doLogin = (loginForm: LoginForm) => {
  // 发送登录请求
  return async (dispatch: AppDispatch) => {
    const response: LoginResponse = await reqLogin(loginForm);

    // 登录成功，存储用户token
    if (response.code === 200) {
      dispatch(setToken(response.data.token as string)); // 存储token到state
      localStorage.setItem('TOKEN', response.data.token as string); // 存储token到localStorage
      return response.data.token;
    }
    // 登录失败
    dispatch(setToken(null));
    localStorage.setItem('TOKEN', '');
    return Promise.reject(new Error(response.data.message));
  }
}

// 获取用户信息
export const fetchUserInfo = () => {
  return async (dispatch: AppDispatch) => {
    const response = await reqUserInfo();
    console.log('user info res---', response);
    const {data: {checkUser}} = response;
    if (response.code === 200) {
      dispatch(setUsername(checkUser.username));
      dispatch(setAvatar(checkUser.avatar));
    }
  }
}

export const selectAllUserState = (state: RootState) => state.user;
export default userSlice.reducer;
