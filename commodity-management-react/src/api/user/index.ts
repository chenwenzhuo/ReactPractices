import request from "@/utils/request.ts";
import {LoginForm, LoginResponse, UserInfoResponse} from "@/api/user/types.ts";

//项目用户相关的请求地址
enum API {
  LOGIN = '/admin/acl/index/login',
  USER_INFO = '/admin/acl/index/info',
  LOGOUT = "/admin/acl/index/logout"
}

// 登录接方法
export const reqLogin = (data: LoginForm) => request.post<any, LoginResponse>(API.LOGIN, data);

// 获取用户信息方法
export const reqUserInfo = () => request.get<any, UserInfoResponse>(API.USER_INFO);

//退出登录
export const reqLogout = () => request.post<any, any>(API.LOGOUT);
