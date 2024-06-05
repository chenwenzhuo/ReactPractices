// SPU管理相关接口
import request from "@/utils/request.ts";
import {SpuResponseData} from "@/api/product/spu/types.ts";

enum API {
  GET_SPU_INFO_LIST = "/admin/product", // 查询SPU列表
}

// 查询SPU列表
export const reqSpuInfoList = (pageNo: number, pageSize: number, cate3Id: number) =>
  request.get<any, SpuResponseData>(`${API.GET_SPU_INFO_LIST}/${pageNo}/${pageSize}?category3Id=${cate3Id}`);
