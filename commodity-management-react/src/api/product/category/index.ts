// 分类查询相关接口
import request from "@/utils/request.ts";
import {CategoryResponseData} from "@/api/product/category/types.ts";

enum API {
  GET_CATEGORY1 = "/admin/product/getCategory1", // 查询一级分类
  GET_CATEGORY2 = "/admin/product/getCategory2", // 查询二级分类
  GET_CATEGORY3 = "/admin/product/getCategory3", // 查询三级分类
}

// 查询一级分类
export const reqCategory1 = () => request.get<any, CategoryResponseData>(API.GET_CATEGORY1);

// 查询二级分类
export const reqCategory2 = (cate1Id: number) => request.get<any, CategoryResponseData>(`${API.GET_CATEGORY2}/${cate1Id}`);

// 查询三级分类
export const reqCategory3 = (cate2Id: number) => request.get<any, CategoryResponseData>(`${API.GET_CATEGORY3}/${cate2Id}`);
