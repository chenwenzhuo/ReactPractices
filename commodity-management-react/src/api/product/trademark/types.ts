// 品牌管理相关数据类型
interface TrademarkResponse {
  code: number;
  message: string;
  ok: boolean;
}

// 单个品牌数据对象的类型
export interface Trademark {
  id?: number;
  createTime?: string;
  updateTime?: string;
  tmName: string;
  logoUrl: string;
}

// 品牌数据数组的类型
export type TrademarkRecords = Trademark[];

// 查询品牌接口返回数据类型
export interface QueryTrademarkResponse extends TrademarkResponse {
  data: {
    records: TrademarkRecords;
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

// 新增、修改品牌的表单数据类型
export interface TrademarkFormData {
  id?: number;
  tmName: string;
  logoUrl: string;
}
