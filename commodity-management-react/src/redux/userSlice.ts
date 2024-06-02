import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {AppDispatch} from "@/redux/store.ts";
import {LoginForm, LoginResponse} from "@/api/user/types.ts";
import {reqLogin} from "@/api/user";
import {UserStateType} from "@/redux/types/types.ts";

// 用户数据仓库
const userSlice = createSlice({
  name: "user",
  initialState: {
    // 用户的唯一标识。登录成功后将存储到localStorage中，故默认从这里读取
    token: localStorage.getItem('TOKEN'),
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
    }
  },
});

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

export const {setToken} = userSlice.actions;

export default userSlice.reducer;