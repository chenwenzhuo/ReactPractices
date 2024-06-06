// SPU管理中，新增SPU、更新SPU的表单子组件
import {FC, useEffect, useState} from "react";
import {Button, Form, Image, Input, Select, Table, Tag, Upload} from "antd";
import {DeleteOutlined, PlusOutlined} from "@ant-design/icons";
import {nanoid} from "@reduxjs/toolkit";
import {Trademark} from "@/api/product/trademark/types.ts";
import {
  AllTrademarksResponse, SaleAttr,
  SaleAttrResponse,
  SpuImage,
  SpuImageResponse,
  SpuRecord, SpuSaleAttr, SpuSaleAttrResponse, SpuSaleAttrValue
} from "@/api/product/spu/types.ts";
import {reqAllSaleAttr, reqAllTrademarkList, reqSpuImagesList, reqSpuSaleAttr} from "@/api/product/spu";
import './SpuForm.scss';

interface SpuFormProps {
  spuInfo?: SpuRecord | null;
  changeScene: Function;
}

const FormItem = Form.Item;
const {TextArea} = Input;

const getBase64 = (file: any): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

const SpuForm: FC<SpuFormProps> = (props) => {
  const {spuInfo, changeScene} = props;
  const [spuForm] = Form.useForm();
  const [spuInfos, setSpuInfos] = useState<any>({}); // SPU表单输入信息
  const [trademarkList, setTrademarkList] = useState<Trademark[]>([]); // 所有品牌的数据
  const [spuImageList, setSpuImageList] = useState<SpuImage[]>([]); // 当前SPU的图片数据
  const [picWallFileList, setPicWallFileList] = useState<any[]>([]); // 照片墙数据列表
  const [previewOpen, setPreviewOpen] = useState<boolean>(false); // 是否展示预览大图
  const [previewImage, setPreviewImage] = useState<string>(''); // 预览图片的URL
  const [allSaleAttr, setAllSaleAttr] = useState<SaleAttr[]>([]); // 所有的销售属性
  const [spuSaleAttr, setSpuSaleAttr] = useState<SpuSaleAttr[]>([]); // 当前SPU已有的销售属性
  const [saleAttrOptions, setSaleAttrOptions] = useState<any[]>([]); // “SPU销售属性”表单项中下拉框的选项
  const [saleAttrToAdd, setSaleAttrToAdd] = useState<string>('');// “SPU销售属性”表单项中下拉框的选中值

  const uploadButton = (
    <button className={"upload-img-btn"} type="button">
      <PlusOutlined/>
      <div style={{marginTop: 8}}>上传图片</div>
    </button>
  );

  // 销售属性表格的列定义
  const saleAttrTableColumns: any[] = [
    {
      title: '序号',
      width: 100,
      align: 'center',
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: '属性名称',
      dataIndex: 'saleAttrName',
      align: 'center',
      width: 300,
    },
    {
      title: '属性值',
      render: (_: any, record: SpuSaleAttr) => {
        const {spuSaleAttrValueList} = record;
        return (<>
          {
            spuSaleAttrValueList.map((item: SpuSaleAttrValue) => (
              <Tag
                key={item.id}
                color={"processing"}
                closeIcon
              >
                {item.saleAttrValueName}
              </Tag>
            ))
          }
          <Button
            type={"primary"}
            icon={<PlusOutlined/>}
            size={'small'}
          ></Button>
        </>);
      }
    },
    {
      title: '操作',
      align: 'center',
      width: 200,
      render: (_: any, __: SpuSaleAttr) => (
        <Button
          type={"primary"}
          icon={<DeleteOutlined/>}
          danger
        ></Button>
      ),
    },
  ];

  function onSpuInfosChange(infoAttrName: string, infoAttrVal: any) {
    setSpuInfos({...spuInfos, [infoAttrName]: infoAttrVal});
  }

  // 查询所有品牌数据
  async function getAllTrademarkList() {
    const response: AllTrademarksResponse = await reqAllTrademarkList();
    console.log('getAllTrademarkList response---', response);
    setTrademarkList(response.data);
  }

  // 查询当前SPU的所有图片
  async function getSpuImageList() {
    const response: SpuImageResponse = await reqSpuImagesList(spuInfo?.id as number);
    console.log('getSpuImageList response---', response);
    setSpuImageList(response.data);
  }

  // 照片墙列表改变的回调
  function onPicWallListChange({fileList}: any) {
    console.log('fileList---', fileList);
    // 由于antd Upload组件的bug，组件设置了fileList选项时，必须在onChange回调里直接将fileList实参
    // 直接设置给对应的state，否则onChange只会调用一次，文件一直在uploading，拿不到最终的上传结果
    setPicWallFileList(fileList);

    // 检查fileList的最后一项，上传完成后将其映射到所需的数据类型
    const uploadInfo = fileList[fileList.length - 1];
    if (uploadInfo.percent === 100 && uploadInfo.response) {
      setPicWallFileList([
        ...fileList.slice(0, fileList.length - 1), {
          uid: nanoid(),
          name: uploadInfo.name,
          status: 'done',
          url: uploadInfo.response.data,
          originFileObj: uploadInfo.originFileObj,
        }
      ]);
    }
  }

  // 移除照片墙中图片的回调
  function onRemoveImage(file: any) {
    console.log('file to remove---', file);
    const imagesAfterRemove = picWallFileList.filter(item => item.uid !== file.uid);
    setPicWallFileList(imagesAfterRemove);
  }

  // 照片墙预览的回调
  async function onPreviewImage(file: any) {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  }

  // 查询全部销售属性
  async function getAllSaleAttr() {
    const response: SaleAttrResponse = await reqAllSaleAttr();
    console.log('getAllSaleAttr response---', response);
    setAllSaleAttr(response.data);
  }

  // 查询当前SPU下的销售属性
  async function getSpuSaleAttr() {
    const response: SpuSaleAttrResponse = await reqSpuSaleAttr(spuInfo?.id as number);
    console.log('getSpuSaleAttr response---', response);
    setSpuSaleAttr(response.data);
  }

  // 从全部销售属性中，把当前SPU已有的销售属性去掉，作为“SPU销售属性”表单项中下拉框的选项
  function filterSaleAttrs() {
    if (allSaleAttr.length === 0) {
      setSaleAttrOptions([]);
      return;
    }
    // 用一个Set存储SPU已有的销售属性名称，提高后面filter的效率
    const set = new Set(spuSaleAttr.map(item => item.saleAttrName));
    const options = allSaleAttr
      .filter(item => !set.has(item.name))
      .map(item => ({label: item.name, value: `${item.id}-${item.name}`}));
    setSaleAttrOptions(options);
  }

  // “添加销售属性”按钮的点击回调
  function addSaleAttrForSpu() {
    // 将下拉框的选中值映射为一个销售属性对象
    const attr = saleAttrToAdd.split('-');
    const newSaleAttr = {
      spuId: spuInfo?.id as number,
      baseSaleAttrId: Number(attr[0]),
      saleAttrName: attr[1],
      spuSaleAttrValueList: [],
    };
    setSpuSaleAttr([...spuSaleAttr, newSaleAttr]);
    filterSaleAttrs(); // 重新运行过滤器函数
    spuForm.setFieldValue('spuSaleAttr', '');
  }

  useEffect(() => {
    getAllTrademarkList(); // 查询所有品牌
    getAllSaleAttr(); // 查询所有销售属性

    // 传递了spuInfo参数，才进行以下操作
    if (spuInfo && spuInfo.id) {
      getSpuImageList(); // 查询当前SPU下的全部图片
      getSpuSaleAttr(); // 查询当前SPU下的销售属性
      // 设置表单元素的值
      spuForm.setFieldsValue({
        spuName: spuInfo.spuName,
        spuTrademark: spuInfo.tmId,
        spuDesc: spuInfo.description,
      });
    }
  }, []);

  // 将SPU图片列表映射到照片墙所需数据类型
  useEffect(() => {
    const picWallList = spuImageList.map((item: SpuImage) => ({
      uid: item.id,
      name: item.imgName,
      status: "done",
      url: item.imgUrl,
    }));
    setPicWallFileList(picWallList);
  }, [spuImageList]);

  // 已有销售属性发生变化时，重新运行过滤函数
  useEffect(() => {
    filterSaleAttrs();
  }, [spuSaleAttr]);

  return (
    <main className={"spu-form-component"}>
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
            className={"spu-name-input"}
            placeholder={"请输入SPU名称"}
            onChange={(e: any) => onSpuInfosChange('spuName', e.target.value)}
          />
        </FormItem>
        <FormItem
          label={"SPU品牌"}
          name={"spuTrademark"}
        >
          <Select
            className={"spu-trademark-select"}
            placeholder={"请选择品牌"}
            options={trademarkList.map((item: Trademark) => ({label: item.tmName, value: item.id}))}
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
          <div>
            <Upload
              action="/api/admin/product/fileUpload"
              listType="picture-card"
              accept={".jpg,.jpeg,.png"}
              fileList={picWallFileList}
              onPreview={onPreviewImage}
              onChange={onPicWallListChange}
              onRemove={onRemoveImage}
            >
              {uploadButton}
            </Upload>
            {previewImage && (
              <Image
                wrapperStyle={{display: 'none'}}
                preview={{
                  visible: previewOpen,
                  onVisibleChange: (visible) => setPreviewOpen(visible),
                  afterOpenChange: (visible) => !visible && setPreviewImage(''),
                }}
                src={previewImage}
              />
            )}
          </div>
        </FormItem>
        <FormItem
          label={"SPU销售属性"}
        >
          <div>
            <FormItem
              name={"spuSaleAttr"}
              style={{display: 'inline-block'}}
            >
              <Select
                className={"spu-sale-attr-select"}
                placeholder={`还有${saleAttrOptions.length}项可选择`}
                options={saleAttrOptions}
                onChange={(value: string) => setSaleAttrToAdd(value || "")}
              />
            </FormItem>
            <Button
              className={"add-sale-attr-btn"}
              type={"primary"}
              icon={<PlusOutlined/>}
              disabled={!saleAttrToAdd}
              onClick={addSaleAttrForSpu}
            >
              添加销售属性
            </Button>
            <Table
              columns={saleAttrTableColumns}
              dataSource={spuSaleAttr}
              rowKey={"id"}
              bordered
              pagination={false}
            />
          </div>
        </FormItem>
        <FormItem>
          <Button type={"primary"}>保存</Button>
          <Button className={"cancel-btn"} onClick={() => changeScene(0)}>取消</Button>
        </FormItem>
      </Form>
    </main>
  );
};

export default SpuForm;
