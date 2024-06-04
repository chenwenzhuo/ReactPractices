// 分类查询相关数据类型

interface CategoryResponse {
  code: number;
  message: string;
  ok: boolean;
}

// 单个分类数据对象的类型
export interface Category {
  id: number | string;
  name: string;
  category1Id?: number;
  category2Id?: number;
}

export type CategoriesList = Category[];

// 分类查询接口的返回数据类型
export interface CategoryResponseData extends CategoryResponse {
  data: CategoriesList;
}
