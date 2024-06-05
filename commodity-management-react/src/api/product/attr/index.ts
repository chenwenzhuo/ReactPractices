// 属性管理相关接口
import request from "@/utils/request.ts";
import {Attr, AttrResponseData} from "@/api/product/attr/types.ts";

enum API {
  GET_ATTR_INFO_LIST = "/admin/product/attrInfoList", // 查询属性列表
  ADD_UPDATE_ATTR = "/admin/product/saveAttrInfo", // 新增/修改属性
  DELETE_ATTR = "/admin/product/deleteAttr", // 删除属性
}

// 查询属性列表
export const reqAttrInfoList = (cate1: number, cate2: number, cate3: number) =>
  request.get<any, AttrResponseData>(`${API.GET_ATTR_INFO_LIST}/${cate1}/${cate2}/${cate3}`);

// 新增/修改属性
export const reqAddOrUpdateAttr = (data: Attr) => request.post<any, any>(API.ADD_UPDATE_ATTR, data);

// 删除属性
export const reqDeleteAttr = (attrId: number) => request.delete<any, any>(`${API.DELETE_ATTR}/${attrId}`);

