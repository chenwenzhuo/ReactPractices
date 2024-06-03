// 定义用户相关数据的ts类型
// 用户登录接口携带参数的ts类型
export interface LoginForm {
  username: string,
  password: string
}

// 全部接口返回数据都拥有的TS类型
export interface Response {
  code: number,
  message: string,
  ok: boolean
}

// 登录接口返回数据类型
export interface LoginResponse extends Response {
  data: string,
}

// 获取用户信息接口返回数据类型
export interface UserInfo { // 用户信息对象的类型
  name: string;
  avatar: string;
  routes: string[];
  buttons: string[];
  roles: string[];
}

export interface UserInfoResponse extends Response {
  data: UserInfo,
}
