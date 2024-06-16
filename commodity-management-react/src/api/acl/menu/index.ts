// 菜单管理相关接口
import request from "@/utils/request.ts";
import {MenuListResponse, MenuRecord} from "@/api/acl/menu/types.ts";

enum API {
  GET_ALL_MENUS = "/admin/acl/permission", // 获取所有菜单
  ADD_MENU = '/admin/acl/permission/save', // 给某一级菜单新增一个子菜单
  UPDATE_MENU = '/admin/acl/permission/update', // 更新已有的菜单
  DELETE_MENU = '/admin/acl/permission/remove', // 删除菜单
}

// 获取所有菜单
export const reqAllMenus = () => request.get<any, MenuListResponse>(API.GET_ALL_MENUS);

// 新增/更新菜单
export const reqAddOrUpdateMenu = (data: MenuRecord) => {
  if (data.id) {
    return request.put<any, any>(API.UPDATE_MENU, data);
  }
  return request.post<any, any>(API.ADD_MENU, data);
}

// 删除菜单
export const reqDeleteMenu = (id: number) => request.delete<any, any>(`${API.DELETE_MENU}/${id}`);
