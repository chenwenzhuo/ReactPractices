import {FC, useEffect, useState} from "react";
import {
  Button,
  Card,
  Carousel,
  ConfigProvider,
  Drawer,
  Form,
  notification,
  Pagination, Popconfirm,
  Table,
  Tag,
  Tooltip
} from "antd";
import {ArrowDownOutlined, ArrowUpOutlined, DeleteOutlined, InfoCircleOutlined} from "@ant-design/icons";

import './SkuManage.scss';
import {reqAllSkuInfoList, reqDeleteSku, reqSetSkuOnOrOffSale, reqSkuDetailInfo} from "@/api/product/sku";
import {SkuDetailInfo, SkuDetailInfoResponse, SkuListResponseData, SkuRecord} from "@/api/product/sku/types.ts";

const FormItem = Form.Item;

const SkuManage: FC = () => {
  // 表格分页相关参数
  const [total, setTotal] = useState<number>(1);
  const [pageNo, setPageNo] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(5);
  const [skuInfoList, setSkuInfoList] = useState<SkuRecord[]>([]); // SKU数据列表
  const [showDetailDrawer, setShowDetailDrawer] = useState<boolean>(false); // 是否展示SKU详情抽屉组件
  const [selectedSku, setSelectedSku] = useState<SkuRecord | null>(null); // 选中的SKU数据
  const [selectedSkuDetail, setSelectedSkuDetail] = useState<SkuDetailInfo | null>(null); // 选中的SKU数据

  const skuTableColumns: any[] = [
    {
      title: '序号',
      dataIndex: 'index',
      width: 100,
      align: 'center',
      className: 'index-col',
      render: (_: any, __: any, index: number) => index + 1 + (pageNo - 1) * pageSize,
    },
    {
      title: '名称',
      dataIndex: 'skuName',
      align: 'center',
      width: 200,
    },
    {
      title: '描述',
      dataIndex: 'skuDesc',
    },
    {
      title: '默认图片',
      align: 'center',
      width: 150,
      render: (_: any, record: any) => (<img src={record.skuDefaultImg} alt={""} style={{width: "100px"}}/>),
    },
    {
      title: '重量(克)',
      dataIndex: 'weight',
      width: 120,
    },
    {
      title: '价格(元)',
      dataIndex: 'price',
      width: 120,
    },
    {
      title: '操作',
      align: 'center',
      fixed: 'right',
      width: 300,
      render: (_: any, record: SkuRecord) => (<div className={"opt-btns-wrapper"}>
        <Tooltip title={`${record.isSale ? '下架' : '上架'}商品`}>
          <Button
            type={"primary"}
            icon={record.isSale ? <ArrowDownOutlined/> : <ArrowUpOutlined/>}
            className={`opt-btn ${record.isSale ? 'on-sale-btn' : 'off-sale-btn'}`}
            onClick={() => toggleSkuSaleStatus(record)}>
          </Button>
        </Tooltip>
        <Tooltip title={"查看详情"}>
          <Button type={"primary"} icon={<InfoCircleOutlined/>} className={"opt-btn"}
                  onClick={() => onShowDetailClick(record)}>
          </Button>
        </Tooltip>
        <Tooltip title={"删除SKU"}>
          <Popconfirm
            title="删除SKU"
            description="是否确认删除当前SKU？"
            okText="确认"
            cancelText="取消"
            okButtonProps={{danger: true}}
            onConfirm={() => deleteSku(record.id as number)}
          >
            <Button type={"primary"} icon={<DeleteOutlined/>} className={"opt-btn"} danger></Button>
          </Popconfirm>
        </Tooltip>
      </div>)
    }
  ];

  // 获取所欲SKU数据列表
  async function getAllSkuInfoList() {
    const response: SkuListResponseData = await reqAllSkuInfoList(pageNo, pageSize);
    console.log('SKU info list---', response);
    if (response.code === 200) {
      const {data} = response;
      setSkuInfoList(data.records);
      setTotal(data.total);
    }
  }

  // 分页信息改变的回调
  function onPaginationChange(nextPageNo: number, nextPageSize: number) {
    if (nextPageSize !== pageSize) { // 分页大小改变时，页码重置为1
      setPageNo(1);
      setPageSize(nextPageSize);
    } else {
      setPageNo(nextPageNo);
    }
  }

  // 商品上架/下架
  async function toggleSkuSaleStatus(record: SkuRecord) {
    const setOnSale = !record.isSale;
    const response: any = await reqSetSkuOnOrOffSale(record.id, setOnSale);
    if (response.code === 200) {
      notification.open({
        type: "success",
        message: `${setOnSale ? '上架' : '下架'}成功`
      });
      getAllSkuInfoList();
    } else {
      notification.open({
        type: "error",
        message: `${setOnSale ? '上架' : '下架'}失败`
      });
    }
  }

  // 获取SKU详细信息
  async function getSkuDetailInfo(skuId: number) {
    const response: SkuDetailInfoResponse = await reqSkuDetailInfo(skuId);
    console.log('getSkuDetailInfo response---', response);
    if (response.code === 200) {
      setSelectedSkuDetail(response.data);
    }
  }

  // 展示详情按钮的点击回调
  function onShowDetailClick(record: SkuRecord) {
    setSelectedSku(record);
    setShowDetailDrawer(true);
  }

  // 详情抽屉组件关闭的回调
  function onDetailDrawerClose() {
    setSelectedSku(null);
    setSelectedSkuDetail(null);
    setShowDetailDrawer(false);
  }

  // 删除SKU
  async function deleteSku(skuId: number) {
    const response: any = await reqDeleteSku(skuId);
    if (response.code === 200) {
      notification.open({
        type: "success",
        message: "删除SKU成功",
      });
      getAllSkuInfoList();
    } else {
      notification.open({
        type: "error",
        message: "删除SKU失败",
      });
    }
  }

  // 组件挂载时查询SKU数据
  useEffect(() => {
    getAllSkuInfoList();
  }, [pageNo, pageSize]);

  useEffect(() => {
    if (selectedSku) {
      getSkuDetailInfo(selectedSku.id);
    }
  }, [selectedSku]);

  return (
    <main className={"sku-component"}>
      <Card style={{width: "100%", height: "100%", overflow: "auto"}}
      >
        <Table
          columns={skuTableColumns}
          dataSource={skuInfoList}
          rowKey={"id"}
          bordered
          scroll={{x: 1500}}
          pagination={false}
        />
        <div className={"pagination-wrapper"}>
          <Pagination
            showSizeChanger
            total={total}
            current={pageNo}
            pageSize={pageSize}
            pageSizeOptions={[5, 10, 20, 50]}
            showTotal={total => `共 ${total} 个项目`}
            onChange={onPaginationChange}
          />
        </div>
      </Card>
      <Drawer
        title={"查看商品详情"}
        open={showDetailDrawer}
        onClose={onDetailDrawerClose}
        width={500}
      >
        <Form
          labelCol={{span: 4}}
          wrapperCol={{offset: 1}}
        >
          <FormItem label={"名称"}>
            <p>{selectedSku?.skuName}</p>
          </FormItem>
          <FormItem label={"描述"}>
            <p>{selectedSku?.skuDesc}</p>
          </FormItem>
          <FormItem label={"价格"}>
            <p>{selectedSku?.price}&nbsp;元</p>
          </FormItem>
          <FormItem label={"平台属性"}>
            {
              selectedSkuDetail?.skuAttrValueList && selectedSkuDetail.skuAttrValueList.length > 0 ?
                selectedSkuDetail.skuAttrValueList.map((item: any) => (
                  <Tag color={"success"} key={item.id}>{item.valueName}</Tag>
                )) :
                <span>暂无数据</span>
            }
          </FormItem>
          <FormItem label={"销售属性"}>
            {
              selectedSkuDetail?.skuSaleAttrValueList && selectedSkuDetail.skuSaleAttrValueList.length > 0 ?
                selectedSkuDetail.skuSaleAttrValueList.map((item: any) => (
                  <Tag color={"warning"} key={item.id}>{item.saleAttrValueName}</Tag>
                )) :
                <span>暂无数据</span>
            }
          </FormItem>
          <FormItem label={"图片"}>
            {
              selectedSkuDetail?.skuImageList && selectedSkuDetail.skuImageList.length > 0 ?
                <ConfigProvider
                  theme={{
                    token: {
                      /* 这里是你的全局 token */
                      colorBgContainer: '#000000'
                    },
                    components: {
                      Carousel: {
                        /* 这里是你的组件 token */
                        arrowSize: 40,
                      },
                    },
                  }}
                >
                  <Carousel autoplay arrows infinite fade
                            style={{width: '320px'}}>
                    {
                      selectedSkuDetail.skuImageList.map((item: any) => (
                        <img key={item.id} src={item.imgUrl} alt={""}/>
                      ))
                    }
                  </Carousel>
                </ConfigProvider> :
                <span>暂无图片</span>
            }
          </FormItem>
        </Form>
      </Drawer>
    </main>
  );
};

export default SkuManage;
