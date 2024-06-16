// 菜单管理相关类型
interface MenuResponse {
  code: number;
  message: string;
  ok: boolean;
}

// 单个菜单数据对象的类型
export interface MenuRecord {
  id?: number;
  createTime?: string;
  updateTime?: string;
  pid: number;
  name: string;
  code: string | null;
  toCode?: any;
  type?: number;
  status?: any;
  level: number;
  select?: boolean;
  children?: MenuRecord[];
}

// 查询所有菜单数据接口的返回值类型
export interface MenuListResponse extends MenuResponse {
  data: MenuRecord[];
}
