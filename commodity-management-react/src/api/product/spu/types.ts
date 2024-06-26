// SPU管理相关数据类型
import {TrademarkRecords} from "@/api/product/trademark/types.ts";

interface SpuResponse {
  code: number;
  message: string;
  ok: boolean;
}

// 单个SPU信息对象的类型
export interface SpuRecord {
  id?: number;
  createTime?: string;
  updateTime?: string;
  spuName: string;
  description: string;
  category3Id: number;
  tmId: number;
  spuSaleAttrList?: any;
  spuImageList?: any;
  spuPosterList?: any;
}

export interface SpuInfo {
  records: SpuRecord[];
  total: number;
  size: number;
  current: number;
  orders: any[];
  optimizeCountSql: boolean;
  hitCount: boolean;
  countId?: any;
  maxLimit?: any;
  searchCount: boolean;
  pages: number;
}

// 查询SPU信息接口的返回值类型
export interface SpuResponseData extends SpuResponse {
  data: SpuInfo;
}

// 查询所有品牌接口的返回值类型
export interface AllTrademarksResponse extends SpuResponse {
  data: TrademarkRecords;
}

// 单个SPU图片数据对象的类型
export interface SpuImage {
  id?: number;
  createTime?: string | null;
  updateTime?: string | null;
  spuId?: number;
  imgName: string;
  imgUrl: string;
}

// 查询SPU图片接口的返回值类型
export interface SpuImageResponse extends SpuResponse {
  data: SpuImage[];
}

// SPU销售属性值的类型
export interface SpuSaleAttrValue {
  id: number;
  createTime?: any;
  updateTime?: any;
  spuId: number;
  baseSaleAttrId: number;
  saleAttrValueName: string;
  saleAttrName: string;
  isChecked?: any;
}

// 单个SPU销售属性数据对象的类型
export interface SpuSaleAttr {
  id?: number;
  createTime?: any;
  updateTime?: any;
  spuId: number;
  baseSaleAttrId: number;
  saleAttrName: string;
  spuSaleAttrValueList: SpuSaleAttrValue[];
}

// 查询特定SPU下的销售属性接口返回值的类型
export interface SpuSaleAttrResponse extends SpuResponse {
  data: SpuSaleAttr[];
}

// 查询全部销售属性接口，单个销售属性的类型
export interface SaleAttr {
  id: number;
  createTime?: any;
  updateTime?: any;
  name: string;
}

// 查询全部销售属性接口，返回数据类型
export interface SaleAttrResponse extends SpuResponse {
  data: SaleAttr[];
}

// 添加SKU，请求数据类型
export interface SkuData {
  category3Id: string | number,
  spuId: string | number,
  tmId: string | number,
  skuName: string,
  price: string | number,
  weight: string | number,
  skuDesc: string,
  skuAttrValueList: {
    attrId: string | number,
    attrValueId: string | number,
  },
  skuSaleAttrValueList: {
    saleAttrId: string | number,
    saleAttrValueId: string | number,
  },
  skuDefaultImg: string,
}

// 查询SKU列表，单个SKU数据的类型
export interface SkuRecord {
  id: number;
  createTime: string;
  updateTime: string;
  spuId: number;
  price: number;
  skuName: string;
  skuDesc: string;
  weight: string;
  tmId: number;
  category3Id: number;
  skuDefaultImg: string;
  isSale: number;
  skuImageList?: any;
  skuAttrValueList?: any;
  skuSaleAttrValueList?: any;
}

// 查询SKU列表，接口的返回数据类型
export interface SkuListResponseData extends SpuResponse {
  data: SkuRecord[];
}
