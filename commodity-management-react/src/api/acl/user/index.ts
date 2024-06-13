// 用户管理相关接口
import request from "@/utils/request.ts";
import {AssignRoleData, RoleListResponse, UserInfoListResponse, UserRecord} from "@/api/acl/user/types.ts";

enum API {
  GET_USER_INFO_LIST = "/admin/acl/user", // 查询用户信息列表
  ADD_USER = "/admin/acl/user/save", // 添加新用户
  UPDATE_USER = '/admin/acl/user/update', // 更新已有用户
  DELETE_USER_BATCH = '/admin/acl/user/batchRemove', // 批量删除用户
  DELETE_USER = '/admin/acl/user/remove', // 删除某一个用户
  GET_ALL_ROLE = '/admin/acl/user/toAssign', // 获取当前账号可分配的全部角色
  ASSIGN_USER_ROLE = '/admin/acl/user/doAssignRole', // 给已有的用户分配角色
}

// 查询用户信息列表
export const reqUserInfoList = (pageNo: number, pageSize: number, username?: string) => {
  let url = `${API.GET_USER_INFO_LIST}/${pageNo}/${pageSize}`;
  if (username) {
    url = `${url}?username=${username}`;
  }
  return request.get<any, UserInfoListResponse>(url);
}

// 添加、更新用户
export const reqAddOrUpdateUser = (data: UserRecord) => {
  if (data.id) {
    return request.put<any, any>(API.UPDATE_USER, data);
  }
  return request.post<any, any>(API.ADD_USER, data);
}

// 批量删除用户
export const reqDeleteUserBatch = (idList: number[]) =>
  request.delete<any, any>(API.DELETE_USER_BATCH, {data: idList});

// 删除某一个用户
export const reqDeleteUser = (userId: number) => request.delete<any, any>(`${API.DELETE_USER}/${userId}`);

// 获取当前账号可分配的全部角色
export const reqAllAssignableRoles = (userId: number) => request.get<any, RoleListResponse>(`${API.GET_ALL_ROLE}/${userId}`);

// 给已有的用户分配角色
export const reqAssignUserRoles = (data: AssignRoleData) => request.post<any, any>(API.ASSIGN_USER_ROLE, data);
