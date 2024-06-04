// 属性管理相关接口
import request from "@/utils/request.ts";

enum API {
  GET_ATTR_INFO_LIST = "/admin/product/attrInfoList", // 查询属性列表
}

// 查询属性列表
export const reqAttrInfoList = (cate1: number, cate2: number, cate3: number) =>
  request.get<any, any>(`${API.GET_ATTR_INFO_LIST}/${cate1}/${cate2}/${cate3}`);
