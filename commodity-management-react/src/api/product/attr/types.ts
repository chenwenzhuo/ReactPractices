// 属性管理相关数据类型
interface AttrResponse {
  code: number;
  message: string;
  ok: boolean;
}

// 属性值对象的类型
export interface AttrValue {
  id?: number;
  createTime?: string | null;
  updateTime?: string | null;
  valueName: string;
  attrId?: number;
  key?: string;
}

// 单个属性对象的类型
export interface Attr {
  id?: number | null;
  createTime?: string | null;
  updateTime?: string | null;
  attrName: string;
  categoryId: number;
  categoryLevel: number;
  attrValueList: AttrValue[];
}

// 查询属性列表接口的返回值类型
export interface AttrResponseData extends AttrResponse {
  data: Attr[];
}
