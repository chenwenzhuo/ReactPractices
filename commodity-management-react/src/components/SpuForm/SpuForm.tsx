// SPU管理中，新增SPU、更新SPU的表单子组件
import {FC, useState} from "react";
import {Button, Form, Input, Select, Upload} from "antd";
import {PlusOutlined} from "@ant-design/icons";

const FormItem = Form.Item;
const {TextArea} = Input;

const SpuForm: FC = () => {
  const [spuForm] = Form.useForm();
  const [spuInfos, setSpuInfos] = useState<any>({});

  const uploadButton = (
    <button style={{border: 0, background: 'none'}} type="button">
      <PlusOutlined/>
      <div style={{marginTop: 8}}>上传图片</div>
    </button>
  );
  const [fileList, setFileList] = useState<any[]>([
    {
      uid: '-1',
      name: 'image.png',
      status: 'done',
      url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    },
    {
      uid: '-2',
      name: 'image.png',
      status: 'done',
      url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    },
  ]);


  function onSpuInfosChange(infoAttrName: string, infoAttrVal: any) {
    setSpuInfos({...spuInfos, [infoAttrName]: infoAttrVal});
  }

  return (
    <main className={"add-update-spu-component"}>
      <Form
        form={spuForm}
        name={"spuForm"}
        layout={"vertical"}
      >
        <FormItem
          label={"SPU名称"}
          name={"spuName"}
        >
          <Input
            style={{width: "400px"}}
            placeholder={"请输入SPU名称"}
            onChange={(e: any) => onSpuInfosChange('spuName', e.target.value)}
          />
        </FormItem>
        <FormItem
          label={"SPU品牌"}
          name={"spuBrand"}
        >
          <Select
            style={{width: "400px"}}
            placeholder={"请选择品牌"}
            options={[
              {label: 'brand1', value: '1'},
              {label: 'brand2', value: '2'},
              {label: 'brand3', value: '3'},
            ]}
            // onChange={(e: any) => onSpuInfosChange('spuName', e.target.value)}
          />
        </FormItem>
        <FormItem
          label={"SPU描述"}
          name={"spuDesc"}
        >
          <TextArea
            rows={5}
            placeholder={"请输入SPU描述"}
            onChange={(e: any) => onSpuInfosChange('spuDesc', e.target.value)}
          />
        </FormItem>
        <FormItem
          label={"SPU图片"}
          name={"spuImages"}
        >
          <Upload
            action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
            listType="picture-card"
            fileList={fileList}
            // onPreview={handlePreview}
            // onChange={handleChange}
          >
            {fileList.length >= 8 ? null : uploadButton}
          </Upload>
        </FormItem>
        <FormItem
          label={"SPU销售属性"}
          name={"spuSaleAttr"}
        >
          <Select
            style={{width: "400px"}}
            placeholder={"请选择"}
            options={[
              {label: 'brand1', value: '1'},
              {label: 'brand2', value: '2'},
              {label: 'brand3', value: '3'},
            ]}
            // onChange={(e: any) => onSpuInfosChange('spuName', e.target.value)}
          />
          <Button type={"primary"} icon={<PlusOutlined/>}>添加销售属性</Button>
        </FormItem>
        <FormItem>
          <Button type={"primary"}>保存</Button>
          <Button>取消</Button>
        </FormItem>
      </Form>
    </main>
  );
};

export default SpuForm;
