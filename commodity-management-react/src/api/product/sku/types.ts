// SKU管理相关类型
interface SkuResponse {
  code: number;
  message: string;
  ok: boolean;
}

// 单个SKU数据对象的类型
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

// 查询SKU列表接口的返回值类型
export interface SkuListResponseData extends SkuResponse {
  data: {
    records: SkuRecord[];
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
}

// 查询SKU详情接口的相关数据类型
export interface SkuImageType { // 单个SKU图片数据的类型
  id: number;
  createTime: string;
  updateTime: string;
  skuId: number;
  imgName: string;
  imgUrl: string;
  spuImgId: number;
  isDefault: string;
}

export interface SkuAttrValueType { // 单个SKU平台属性数据的类型
  id: number;
  createTime: string;
  updateTime: string;
  attrId: number;
  valueId: number;
  skuId: number;
  attrName: string;
  valueName: string;
}

export interface SkuSaleAttrValueType { // 单个SKU销售属性数据的类型
  id: number;
  createTime: string;
  updateTime: string;
  skuId: number;
  spuId: number;
  saleAttrValueId: number;
  saleAttrId: number;
  saleAttrName: string;
  saleAttrValueName: string;
}

export interface SkuDetailInfo { // SKU详情数据类型
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
  skuImageList: SkuImageType[];
  skuAttrValueList: SkuAttrValueType[];
  skuSaleAttrValueList: SkuSaleAttrValueType[];
}

// 查询SKU详情接口返回值类型
export interface SkuDetailInfoResponse extends SkuResponse {
  data: SkuDetailInfo;
}