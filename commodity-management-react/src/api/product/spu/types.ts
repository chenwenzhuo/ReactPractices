// SPU管理相关数据类型
interface SpuResponse {
  code: number;
  message: string;
  ok: boolean;
}

// 单个SPU信息对象的类型
export interface SpuRecord {
  id?: number;
  createTime: string;
  updateTime: string;
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

export interface SpuResponseData extends SpuResponse {
  data: SpuInfo;
}
