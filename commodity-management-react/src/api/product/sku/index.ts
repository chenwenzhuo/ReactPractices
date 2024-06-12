// SKU管理相关接口
import request from "@/utils/request.ts";
import {SkuDetailInfoResponse, SkuListResponseData} from "@/api/product/sku/types.ts";

enum API {
  GET_ALL_SKU_INFO_LIST = '/admin/product/list', // 获取所有SKU数据
  SET_PROD_ON_SALE = '/admin/product/onSale', // 将商品上架
  CANCEL_PROD_SALE = '/admin/product/cancelSale', // 将商品下架
  GET_SKU_DETAIL_INFO = '/admin/product/getSkuInfo', // 获取商品详情
  DELETE_SKU = '/admin/product/deleteSku', // 删除SKU
}

// 获取所有SKU数据
export const reqAllSkuInfoList = (pageNo: number, pageSize: number) =>
  request.get<any, SkuListResponseData>(`${API.GET_ALL_SKU_INFO_LIST}/${pageNo}/${pageSize}`);

// 商品上架/下架
export const reqSetSkuOnOrOffSale = (skuId: number, setOnSale: boolean) => {
  const url = setOnSale ? API.SET_PROD_ON_SALE : API.CANCEL_PROD_SALE;
  return request.get<any, any>(`${url}/${skuId}`);
}

// 获取SKU详情
export const reqSkuDetailInfo = (skuId: number) =>
  request.get<any, SkuDetailInfoResponse>(`${API.GET_SKU_DETAIL_INFO}/${skuId}`);

//删除某一个已有的商品
export const reqDeleteSku = (skuId: number) => request.delete<any, any>(`${API.DELETE_SKU}/${skuId}`);
