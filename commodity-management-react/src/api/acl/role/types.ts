// 角色管理相关类型
interface RoleResponse {
  code: number;
  message: string;
  ok: boolean;
}

// 单个角色信息对象的类型
export interface RoleRecord {
  id?: number;
  createTime?: string;
  updateTime?: string;
  roleName: string;
  remark?: any;
}

// 查询角色列表接口的返回值类型
export interface RoleInfoListResponse extends RoleResponse {
  data: {
    records: RoleRecord[];
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

// 单个权限数据对象的类型
export interface RolePermissionRecord {
  id: number;
  createTime: string;
  updateTime: string;
  pid: number;
  name: string;
  code?: string;
  toCode?: string;
  type: number;
  status?: any;
  level: number;
  select: boolean;
  children: RolePermissionRecord[] | null;
}

// 权限查询接口的返回数据类型
export interface RolePermissionResponse extends RoleResponse {
  data: RolePermissionRecord[];
}
