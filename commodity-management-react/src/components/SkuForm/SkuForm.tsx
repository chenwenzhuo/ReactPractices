// SPU管理中，新增SKU的表单子组件
import {FC, useEffect, useState} from "react";
import {Button, Form, Input, message, notification, Select, Table} from "antd";

import './SkuForm.scss';
import {
  SkuData,
  SpuImage,
  SpuImageResponse,
  SpuRecord,
  SpuSaleAttr,
  SpuSaleAttrResponse
} from "@/api/product/spu/types.ts";
import {Attr, AttrResponseData} from "@/api/product/attr/types.ts";
import {reqAttrInfoList} from "@/api/product/attr";
import {reqAddSku, reqSpuImagesList, reqSpuSaleAttr} from "@/api/product/spu";

interface SkuFormProps {
  categoryIds: number[];
  targetSpu: SpuRecord;
  changeScene: Function;
  reloadSpuList: Function;
}

const FormItem = Form.Item;
const {TextArea} = Input;

const SkuForm: FC<SkuFormProps> = (props) => {
  const {categoryIds, targetSpu, changeScene, reloadSpuList} = props;
  const [skuForm] = Form.useForm();
  const [platformAttrs, setPlatformAttrs] = useState<Attr[]>([]); // 平台属性数据
  const [spuImageList, setSpuImageList] = useState<SpuImage[]>([]); // 当前targetSpu的图片数据
  const [spuSaleAttr, setSpuSaleAttr] = useState<SpuSaleAttr[]>([]); // 当前targetSpu的销售属性
  const [skuFormData, setSkuFormData] = useState<any>({ // 表单数据
    skuName: "", skuPrice: "", skuWeight: "", skuDesc: "",
    platformAttrs: [], saleAttrs: [], skuDefaultImg: "",
  });

  const imgTableColumns: any[] = [
    {
      title: '图片',
      align: 'center',
      render: (_: any, record: any) => (<img src={record.imgUrl} alt={""} className={"logo-img"}/>)
    },
    {
      title: '名称',
      dataIndex: 'imgName',
      align: 'center',
    },
    {
      title: '操作',
      align: 'center',
      width: 240,
      render: (_: any, record: any) => (
        <Button
          type={"primary"}
          onClick={() => saveSkuFormData("skuDefaultImg", record.imgUrl)}
        >
          设置默认图片
        </Button>
      )
    },
  ];

  // 获取当前分类下的平台属性数据
  async function getAttrInfoList() {
    const response: AttrResponseData = await reqAttrInfoList(categoryIds[0], categoryIds[1], categoryIds[2]);
    if (response.code === 200) {
      setPlatformAttrs(response.data);
    }
  }

  // 获取当前targetSpu的全部商品图片
  async function getSpuImagesList() {
    const response: SpuImageResponse = await reqSpuImagesList(targetSpu.id as number);
    if (response.code === 200) {
      setSpuImageList(response.data);
    }
  }

  // 获取当前targetSpu的销售属性
  async function getSpuSaleAttr() {
    const response: SpuSaleAttrResponse = await reqSpuSaleAttr(targetSpu.id as number);
    if (response.code === 200) {
      setSpuSaleAttr(response.data);
    }
  }

  // 保存表单数据
  function saveSkuFormData(attrName: string, attrVal: any) {
    // 设置平台属性和销售属性时，需要将传入的属性值拆分为属性id和属性值id
    if (["platformAttrs", "saleAttrs"].includes(attrName)) {
      const ids = attrVal.split("-");
      if (attrName === "platformAttrs") {
        attrVal = [...skuFormData.platformAttrs, {attrId: ids[0], valueId: ids[1]}]
      } else {
        attrVal = [...skuFormData.saleAttrs, {saleAttrId: ids[0], saleAttrValueId: ids[1]}];
      }
    }
    setSkuFormData({...skuFormData, [attrName]: attrVal});
  }

  // 保存新增的SKU
  async function saveSku() {
    try {
      await skuForm.validateFields();
      if (!skuFormData.platformAttrs.length) {
        message.error("请选择至少一项平台属性！");
        return;
      }
      if (!skuFormData.saleAttrs.length) {
        message.error("请选择至少一项销售属性！");
        return;
      }
      if (!skuFormData.skuDefaultImg) {
        message.error("请选择SKU默认图片！");
        return;
      }
      const params: SkuData = {
        category3Id: targetSpu.category3Id,
        spuId: targetSpu.id as number,
        tmId: targetSpu.tmId,
        skuName: skuFormData.skuName,
        price: skuFormData.skuPrice,
        weight: skuFormData.skuWeight,
        skuDesc: skuFormData.skuDesc,
        skuAttrValueList: skuFormData.platformAttrs,
        skuSaleAttrValueList: skuFormData.saleAttrs,
        skuDefaultImg: skuFormData.skuDefaultImg,
      };
      const response: any = await reqAddSku(params);
      if (response.code === 200) {
        notification.open({
          type: "success",
          message: "添加SKU成功！"
        });
        changeScene(0);
        reloadSpuList();
      } else {
        notification.open({
          type: "error",
          message: "添加SKU失败！"
        });
      }
    } catch (e: any) {
      console.error("表单校验失败", e);
    }
  }

  // 组件挂载时，发送请求获取所需数据
  useEffect(() => {
    getAttrInfoList();
    getSpuImagesList();
    getSpuSaleAttr();
  }, []);

  return (
    <main className={"sku-form-component"}>
      <Form
        form={skuForm}
        name={"skuForm"}
        autoComplete={"off"}
        onFinish={saveSku}
      >
        <FormItem
          label={"SKU名称"}
          name={"skuName"}
          rules={[{required: true, message: "请输入SKU名称"}]}
        >
          <Input
            placeholder={"请输入SKU名称"}
            onChange={(e: any) => saveSkuFormData("skuName", e.target.value)}
          />
        </FormItem>
        <FormItem
          label={"价格(元)"}
          name={"skuPrice"}
          rules={[
            {required: true, message: "请输入SKU价格"},
            {
              pattern: /^(?!0(\.0{1,2})?$)([1-9]\d*|0?\.\d{1,2}|[1-9]\d*\.\d{1,2})$/,
              message: "价格应该是大于0且有效的数字，并最多包含两位小数",
            },
          ]}
        >
          <Input
            placeholder={"请输入SKU价格"}
            onChange={(e: any) => saveSkuFormData("skuPrice", e.target.value)}
          />
        </FormItem>
        <FormItem
          label={"重量(克)"}
          name={"skuWeight"}
          rules={[
            {required: true, message: "请输入SKU重量"},
            {pattern: /^(?!0(\.0+)?$)(\d+(\.\d+)?|\.\d+)$/, message: "重量应该是大于0且有效的数字"},
          ]}
        >
          <Input
            placeholder={"请输入SKU重量"}
            onChange={(e: any) => saveSkuFormData("skuWeight", e.target.value)}
          />
        </FormItem>
        <FormItem
          label={"SKU描述"}
          name={"skuDesc"}
          rules={[{required: true, message: "请输入SKU描述"}]}
        >
          <TextArea
            rows={5}
            placeholder={"请输入SKU描述"}
            onChange={(e: any) => saveSkuFormData("skuDesc", e.target.value)}
          />
        </FormItem>
        <FormItem
          label={"平台属性"}
        >
          <div>
            {
              platformAttrs.map(attr => (
                <FormItem
                  key={attr.id}
                  label={attr.attrName}
                  className={"inline-form-item"}
                >
                  <Select
                    placeholder={"请选择"}
                    options={
                      attr.attrValueList.map(attrVal => ({
                        label: attrVal.valueName,
                        value: `${attr.id}-${attrVal.id}`
                      }))}
                    onChange={(value: any) => saveSkuFormData("platformAttrs", value)}
                    className={"inline-select"}
                  />
                </FormItem>
              ))
            }
          </div>
        </FormItem>
        <FormItem
          label={"销售属性"}
        >
          <div>
            {
              spuSaleAttr.map(saleAttr => (
                <FormItem
                  key={saleAttr.id}
                  label={saleAttr.saleAttrName}
                  className={"inline-form-item"}
                >
                  <Select
                    placeholder={"请选择"}
                    options={
                      saleAttr.spuSaleAttrValueList.map(attrVal => ({
                        label: attrVal.saleAttrValueName,
                        value: `${saleAttr.id}-${attrVal.id}`
                      }))
                    }
                    onChange={(value: any) => saveSkuFormData("saleAttrs", value)}
                    className={"inline-select"}
                  />
                </FormItem>
              ))
            }
          </div>
        </FormItem>
        <FormItem
          label={"图片"}
          name={"pictures"}
        >
          <Table
            columns={imgTableColumns}
            dataSource={spuImageList}
            rowKey={"id"}
            bordered
            pagination={false}
          />
        </FormItem>
        <FormItem>
          <Button type={"primary"} htmlType={"submit"}>保存</Button>
          <Button className={"cancel-btn"} onClick={() => changeScene(0)}>取消</Button>
        </FormItem>
      </Form>
    </main>
  );
};

export default SkuForm;
