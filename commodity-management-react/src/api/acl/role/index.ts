// 角色管理相关接口
import request from "@/utils/request.ts";
import {RoleInfoListResponse, RolePermissionResponse, RoleRecord} from "@/api/acl/role/types.ts";

enum API {
  GET_ROLE_INFO_LIST = "/admin/acl/role", // 查询角色列表
  ADD_ROLE = '/admin/acl/role/save', // 添加角色
  UPDATE_ROLE = '/admin/acl/role/update', // 更新角色
  DELETE_ROLE = '/admin/acl/role/remove', // 删除角色
  ALL_PERMISSIONS = "/admin/acl/permission/toAssign/", // 获取全部的菜单与按钮权限数据
  ASSIGN_ROLE_PERMISSION = '/admin/acl/permission/doAssign', // 给相应的角色分配权限
}

// 查询角色列表
export const reqRoleInfoList = (pageNo: number, pageSize: number, roleName?: string) => {
  let url = `${API.GET_ROLE_INFO_LIST}/${pageNo}/${pageSize}`;
  if (roleName) {
    url = `${url}?roleName=${roleName}`;
  }
  return request.get<any, RoleInfoListResponse>(url);
}

// 添加/更新角色
export const reqAddOrUpdateRole = (data: RoleRecord) => {
  if (data.id) {
    return request.put<any, any>(API.UPDATE_ROLE, data);
  }
  return request.post<any, any>(API.ADD_ROLE, data);
}

// 删除角色
export const reqDeleteRole = (id: number) => request.delete<any, any>(`${API.DELETE_ROLE}/${id}`);

// 获取全部菜单与按钮权限数据
export const reqAllPermissionData = (roleId: number) => request.get<any, RolePermissionResponse>(`${API.ALL_PERMISSIONS}/${roleId}`);

// 给相应的角色分配权限
export const reqAssignRolePermissions = (roleId: number, permissionIds: number[]) =>
  request.post<any, any>(`${API.ASSIGN_ROLE_PERMISSION}?roleId=${roleId}&permissionId=${permissionIds}`);
