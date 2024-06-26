import {FC, useEffect, useState} from "react";
import {Button, Card, Empty, Modal, notification, Pagination, Popconfirm, Table, Tooltip} from "antd";
import {DeleteOutlined, FormOutlined, InfoCircleOutlined, PlusOutlined} from "@ant-design/icons";

import './SpuManage.scss';
import Categories from "@/components/categories/Categories.tsx";
import {reqDeleteSpu, reqSkuInfoList, reqSpuInfoList} from "@/api/product/spu";
import {SkuListResponseData, SkuRecord, SpuRecord, SpuResponseData} from "@/api/product/spu/types.ts";
import SpuForm from "@/components/SpuForm/SpuForm.tsx";
import SkuForm from "@/components/SkuForm/SkuForm.tsx";

enum Scene {
  DISPLAY_SPU = "display_spu",
  ADD_SPU = "add_spu",
  UPDATE_SPU = "update_spu",
  ADD_SKU = "add_sku",
}

const SpuManage: FC = () => {
  const [selectionCate1, setSelectionCate1] = useState<number | null>(null); // 一级分类选中项
  const [selectionCate2, setSelectionCate2] = useState<number | null>(null); // 二级分类选中项
  const [selectionCate3, setSelectionCate3] = useState<number | null>(null); // 三级分类选中项
  const [scene, setScene] = useState<string>(Scene.DISPLAY_SPU); // 场景标记
  // 表格分页相关数据
  const [total, setTotal] = useState<number>(0);
  const [pageNo, setPageNo] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(5);
  const [spuInfoList, setSpuInfoList] = useState<SpuRecord[]>([]); // SPU展示表格的数据
  const [skuInfoList, setSkuInfoList] = useState<SkuRecord[]>([]); // SKU展示表格的数据
  const [selectedSpu, setSelectedSpu] = useState<SpuRecord | null>(null); // 进行SPU操作时，被选中的SPU对象
  const [showSkuModal, setShowSkuModal] = useState<boolean>(false); // 是否展示SKU列表对话框

  const categoriesValidFlag = selectionCate1 !== null && selectionCate2 !== null && selectionCate3 !== null;
  const addSpuBtn = (
    <Button type={"primary"} icon={<PlusOutlined/>}
            disabled={!categoriesValidFlag}
            onClick={() => changeScene(1)}>
      添加SPU
    </Button>
  );

  const spuTableColumns: any[] = [
    {
      title: '序号',
      dataIndex: 'index',
      width: 100,
      align: 'center',
      className: 'index-col',
      render: (_: any, __: SpuRecord, index: number) => index + 1 + (pageNo - 1) * pageSize,
    },
    {
      title: 'SPU名称',
      dataIndex: 'spuName',
      width: 400,
    },
    {
      title: 'SPU描述',
      dataIndex: 'description',
      ellipsis: true,
    },
    {
      title: '操作',
      width: 300,
      align: 'center',
      render: (_: any, record: SpuRecord, ___: any) => {
        return (<div className={"opt-buttons"}>
          <Tooltip title={"添加SKU"}>
            <Button type={"primary"} icon={<PlusOutlined/>} onClick={() => onAddSkuClick(record)}></Button>
          </Tooltip>
          <Tooltip title={"更新SPU"}>
            <Button type={"primary"} icon={<FormOutlined/>} onClick={() => onUpdateSpuClick(record)}></Button>
          </Tooltip>
          <Tooltip title={"查看SKU列表"}>
            <Button type={"primary"} icon={<InfoCircleOutlined/>}
                    onClick={() => onDisplaySkuListClick(record)}>
            </Button>
          </Tooltip>
          <Tooltip title={"删除SPU"}>
            <Popconfirm
              title="删除SPU"
              description="是否确认删除当前SPU？"
              okText="确认"
              cancelText="取消"
              okButtonProps={{danger: true}}
              onConfirm={() => deleteSpu(record)}
            >
              <Button type={"primary"} icon={<DeleteOutlined/>}></Button>
            </Popconfirm>
          </Tooltip>
        </div>);
      }
    },
  ];

  const skuTableColumns: any[] = [
    {
      title: '序号',
      width: 100,
      align: 'center',
      className: 'index-col',
      render: (_: any, __: SpuRecord, index: number) => index + 1,
    },
    {
      title: 'SKU名称',
      dataIndex: 'skuName',
      width: 200,
    },
    {
      title: 'SKU价格(元)',
      dataIndex: 'price',
      width: 120,
    },
    {
      title: 'SKU重量(克)',
      dataIndex: 'weight',
      width: 120,
    },
    {
      title: 'SKU图片',
      render: (_: any, record: SkuRecord) => (<>
        <img src={record.skuDefaultImg} alt={""} style={{width: "80px"}}/>
      </>),
    },
  ];

  function setCategories(cate1: number | null, cate2: number | null, cate3: number | null) {
    setSelectionCate1(cate1);
    setSelectionCate2(cate2);
    setSelectionCate3(cate3);
  }

  // 查询SPU列表
  async function getSpuInfoList() {
    const response: SpuResponseData = await reqSpuInfoList(pageNo, pageSize, selectionCate3 as number);
    if (response.code === 200) {
      const {data} = response;
      setTotal(data.total);
      setSpuInfoList(data.records);
    }
  }

  // 分页数据变化的回调
  function onPaginationChange(nextPageNo: number, nextPageSize: number) {
    if (nextPageSize !== pageSize) { // 分页大小改变时，页码重置为1
      setPageNo(1);
      setPageSize(nextPageSize);
    } else {
      setPageNo(nextPageNo);
    }
  }

  // 改变场景
  function changeScene(nextSceneIndex: number) {
    const sceneArr = [Scene.DISPLAY_SPU, Scene.ADD_SPU, Scene.UPDATE_SPU, Scene.ADD_SKU];
    if (nextSceneIndex < 0 || nextSceneIndex >= sceneArr.length) {
      return;
    }
    if (nextSceneIndex === 0) {
      setSelectedSpu(null); // 从其他场景切换回展示列表，将选中的SPU重置为null
    }
    setScene(sceneArr[nextSceneIndex]);
  }

  // 添加SKU按钮的点击事件
  function onAddSkuClick(record: SpuRecord) {
    setSelectedSpu(record);
    changeScene(3);
  }

  // 更新SPU时按钮点击事件
  function onUpdateSpuClick(record: SpuRecord) {
    setSelectedSpu(record);// 记录被选中的SPU对象
    changeScene(2);
  }

  // 查询SKU列表
  async function getSkuInfoList(spuRecord: SpuRecord) {
    const response: SkuListResponseData = await reqSkuInfoList(spuRecord.id as number);
    if (response.code === 200) {
      setSkuInfoList(response.data);
    }
  }

  // 查看SKU列表按钮的点击回调
  function onDisplaySkuListClick(spuRecord: SpuRecord) {
    getSkuInfoList(spuRecord);
    setShowSkuModal(true);
  }

  // SKU列表对话框关闭的回调
  function onCloseSkuModal() {
    setShowSkuModal(false);
    setSkuInfoList([]);
  }

  // 删除SPU按钮的点击回调
  async function deleteSpu(spuRecord: SpuRecord) {
    const response: any = await reqDeleteSpu(spuRecord.id as number);
    if (response.code === 200) {
      notification.open({
        type: "success",
        message: "删除SPU成功！",
      });
      getSpuInfoList();
    } else {
      notification.open({
        type: "error",
        message: "删除SPU失败！",
      });
    }
  }

  // 监视三个分类id、分页大小和页码，分类为有效值时查询SPU信息
  useEffect(() => {
    if (!categoriesValidFlag) {
      return;
    }
    getSpuInfoList();
  }, [
    selectionCate1, selectionCate2, selectionCate3,
    pageNo, pageSize,
  ]);

  return (
    <main className={"spu-component"}>
      <Categories disabled={scene !== Scene.DISPLAY_SPU} setCategories={setCategories}/>
      <Card
        title={scene === Scene.DISPLAY_SPU && addSpuBtn}
        style={{width: "100%", marginTop: "20px"}}
      >
        {/*展示SPU信息列表*/}
        {
          scene === Scene.DISPLAY_SPU &&
          <div className="display-spu-wrapper">
            <Table
              columns={spuTableColumns}
              dataSource={spuInfoList}
              rowKey={"id"}
              bordered
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
          </div>
        }
        {/*新增、修改SPU*/}
        {
          (scene === Scene.ADD_SPU || scene === Scene.UPDATE_SPU) &&
          <div className={"add-update-spu-wrapper"}>
            <SpuForm
              spuToUpdate={selectedSpu}
              category3Id={selectionCate3 as number}
              changeScene={changeScene}
              reloadSpuList={getSpuInfoList}
            />
          </div>
        }
        {/*新增SKU*/}
        {
          scene === Scene.ADD_SKU &&
          <div className={"add-sku-wrapper"}>
            <SkuForm
              categoryIds={[selectionCate1 as number, selectionCate2 as number, selectionCate3 as number]}
              targetSpu={selectedSpu as SpuRecord}
              changeScene={changeScene}
              reloadSpuList={getSpuInfoList}
            />
          </div>
        }
      </Card>
      {/*展示SKU列表*/}
      <Modal
        open={showSkuModal}
        title={"SKU列表"}
        footer={null}
        width={800}
        centered
        onCancel={onCloseSkuModal}
      >
        {
          skuInfoList.length === 0 ?
            <Empty/> :
            <Table
              columns={skuTableColumns}
              dataSource={skuInfoList}
              rowKey={"id"}
              bordered
              pagination={false}
            />
        }
      </Modal>
    </main>
  );
};

export default SpuManage;
