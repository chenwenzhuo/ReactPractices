// 用户管理相关数据类型

// 添加/修改用户表单的类型
export interface UserEditFormType {
  username: string;
  nickname: string;
  password: string;
}

interface UserResponse {
  code: number;
  message: string;
  ok: boolean;
}

// 单个用户信息数据的类型
export interface UserRecord {
  id?: number;
  createTime?: string;
  updateTime?: string;
  username: string;
  password: string;
  name: string;
  phone?: string;
  roleName?: string;
}

// 查询用户信息列表接口的返回值类型
export interface UserInfoListResponse extends UserResponse {
  data: {
    records: UserRecord[];
    total: number;
    size: number;
    current: number;
    orders: any[];
    optimizeCountSql: boolean;
    hitCount: boolean;
    countId?: any;
    maxLimit?: any;
    searchCount: boolean;
    pages: number;
  }
}

// 单个角色信息对象的类型
export interface RoleRecord {
  id: number;
  createTime: string;
  updateTime: string;
  roleName: string;
  remark?: any;
}

// 查询角色列表接口返回值的类型
export interface RoleListResponse extends UserResponse {
  data: {
    allRolesList: RoleRecord[];
    assignRoles: RoleRecord[];
  }
}

// 给用户分配角色接口，请求参数类型
export interface AssignRoleData {
  "roleIdList": number[],
  "userId": number
}
