// 品牌管理相关接口
import request from "@/utils/request.ts";
import {QueryTrademarkResponse, TrademarkFormData} from "@/api/product/trademark/types.ts";

enum API {
  GET_TRADEMARK = "/admin/product/baseTrademark", // 查询品牌数据
  CREATE_TRADEMARK = "/admin/product/baseTrademark/save", // 新增品牌
  UPDATE_TRADEMARK = "/admin/product/baseTrademark/update", // 修改品牌
  DELETE_TRADEMARK = "/admin/product/baseTrademark/remove", // 删除品牌
}

// 获取已有品牌数据
export const reqTrademarkData = (pageNo: number, pageSize: number) =>
  request.get<any, QueryTrademarkResponse>(`${API.GET_TRADEMARK}/${pageNo}/${pageSize}`);

// 新增、修改品牌
export const reqCreateOrUpdateTrademark = (data: TrademarkFormData) => {
  if (data.id) { // 数据有id属性，则发送修改请求
    return request.put<any, any>(API.UPDATE_TRADEMARK, data);
  } else { // 否则发送新增请求
    return request.post<any, any>(API.CREATE_TRADEMARK, data);
  }
}

// 删除品牌
export const reqDeleteTrademark = (id: number) => request.delete<any, any>(`${API.DELETE_TRADEMARK}/${id}`);
