//定义用户相关数据的ts类型
//用户登录接口携带参数的ts类型
export interface LoginForm {
  username: string,
  password: string
}

interface DataType {
  token?: string,
  message?: string,
}

//定义全部接口返回数据都拥有ts类型
export interface Response {
  code: number,
  message: string,
  ok: boolean
}

//定义登录接口返回数据类型
export interface LoginResponse {
  code: number,
  data: DataType,
}

//定义获取用户信息返回数据类型
export interface UserInfo {
  userId: number;
  avatar: string;
  username: string;
  password: string;
  desc: string;
  roles: string[];
  buttons: string[];
  routes: string[];
  token: string;
}

interface user {
  checkUser: UserInfo
}

export interface UserInfoResponse extends Response {
  code: number,
  data: user,
}
