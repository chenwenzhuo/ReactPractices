// 品牌管理相关接口
import request from "@/utils/request.ts";
import {QueryTrademarkResponse} from "@/api/product/trademark/types.ts";

enum API {
  GET_TRADEMARK = "/admin/product/baseTrademark",
}

// 获取已有品牌数据
export const reqTrademarkData = (pageNo: number, pageSize: number) =>
  request.get<any, QueryTrademarkResponse>(`${API.GET_TRADEMARK}/${pageNo}/${pageSize}`);
