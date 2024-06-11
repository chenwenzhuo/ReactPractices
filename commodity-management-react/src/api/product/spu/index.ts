// SPU管理相关接口
import request from "@/utils/request.ts";
import {
  AllTrademarksResponse,
  SaleAttrResponse,
  SpuImageResponse, SpuRecord,
  SpuResponseData,
  SpuSaleAttrResponse
} from "@/api/product/spu/types.ts";

enum API {
  GET_SPU_INFO_LIST = "/admin/product", // 查询SPU列表
  GET_ALL_TRADEMARK = "/admin/product/baseTrademark/getTrademarkList", // 查询全部品牌列表
  GET_SPU_IMAGES = "/admin/product/spuImageList", // 查询特定SPU下全部商品图片
  GET_SPU_SALE_ATTR = "/admin/product/spuSaleAttrList", // 查询特定SPU下的销售属性
  GET_ALL_SALE_ATTR = "/admin/product/baseSaleAttrList", // 查询全部销售属性
  CREATE_SPU = '/admin/product/saveSpuInfo', // 创建SPU
  UPDATE_SPU = '/admin/product/updateSpuInfo', // 更新已有的SPU
}

// 查询SPU列表
export const reqSpuInfoList = (pageNo: number, pageSize: number, cate3Id: number) =>
  request.get<any, SpuResponseData>(`${API.GET_SPU_INFO_LIST}/${pageNo}/${pageSize}?category3Id=${cate3Id}`);

// 查询全部品牌列表
export const reqAllTrademarkList = () => request.get<any, AllTrademarksResponse>(API.GET_ALL_TRADEMARK);

// 查询特定SPU下全部商品图片
export const reqSpuImagesList = (spuId: number) => request.get<any, SpuImageResponse>(`${API.GET_SPU_IMAGES}/${spuId}`);

// 查询特定SPU下的销售属性
export const reqSpuSaleAttr = (spuId: number) => request.get<any, SpuSaleAttrResponse>(`${API.GET_SPU_SALE_ATTR}/${spuId}`);

// 查询全部销售属性
export const reqAllSaleAttr = () => request.get<any, SaleAttrResponse>(API.GET_ALL_SALE_ATTR);

// 添加、更新SPU
export const reqAddOrUpdateSpu = (data: SpuRecord) => {
  if (data.id) {
    return request.post<any, any>(API.UPDATE_SPU, data);
  } else {
    return request.post<any, any>(API.CREATE_SPU, data);
  }
}
