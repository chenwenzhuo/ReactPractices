import {FC, useEffect, useState} from "react";
import {Button, Card, Popconfirm, Table, Tag} from "antd";
import {DeleteOutlined, FormOutlined, PlusOutlined} from "@ant-design/icons";

import './AttrManage.scss';
import Categories from "@/components/categories/Categories.tsx";
import {reqAttrInfoList} from "@/api/product/attr";
import {generateRandomHexColor} from "@/utils";

const AttrManage: FC = () => {
  const [selectionCate1, setSelectionCate1] = useState<number | null>(null); // 一级分类选中项
  const [selectionCate2, setSelectionCate2] = useState<number | null>(null); // 二级分类选中项
  const [selectionCate3, setSelectionCate3] = useState<number | null>(null); // 三级分类选中项
  const [attrTableData, setAttrTableData] = useState<any[]>([]); // 属性表格数据

  // 添加属性按钮禁用标志
  const categoriesValidFlag = selectionCate1 !== null && selectionCate2 !== null && selectionCate3 !== null;
  const addAttrBtn = (
    <Button type={"primary"} icon={<PlusOutlined/>}
            disabled={!categoriesValidFlag}>
      添加平台属性
    </Button>
  );

  const attrTableColumns: any[] = [
    {
      title: '序号',
      dataIndex: 'index',
      width: 100,
      align: 'center',
      className: 'index-col',
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: '属性名称',
      dataIndex: 'attrName',
      align: 'center',
      className: 'attr-name-col',
    },
    {
      title: '属性值',
      render: (_: any, reccord: any) => {
        return reccord.attrValueList.map((item: any) => (
          <Tag color={generateRandomHexColor()} key={item.id}>
            {item.valueName}
          </Tag>
        ));
      }
    },
    {
      title: '操作',
      width: 200,
      align: 'center',
      className: 'opt-col',
      render: (_: any, __: any) => {
        return (<>
          <Button
            icon={<FormOutlined/>}
            className={"opt-btn update-btn"}
          ></Button>
          <Popconfirm
            title="删除属性"
            description="是否确认删除当前属性？"
            okText="确认"
            cancelText="取消"
            okButtonProps={{danger: true}}
          >
            <Button
              icon={<DeleteOutlined/>}
              className={"opt-btn del-btn"}
            ></Button>
          </Popconfirm>
        </>)
      }
    }
  ];

  function setCategories(cate1: number | null, cate2: number | null, cate3: number | null) {
    setSelectionCate1(cate1);
    setSelectionCate2(cate2);
    setSelectionCate3(cate3);
  }

  async function getAttrInfoList() {
    const response: any = await reqAttrInfoList(
      selectionCate1 as number,
      selectionCate2 as number,
      selectionCate3 as number
    );
    console.log('getAttrInfoList response-----', response);
    if (response.code === 200) {
      setAttrTableData(response.data);
    }
  }

  // 监视三个分类的值
  useEffect(() => {
    setAttrTableData([]);
    if (!categoriesValidFlag) {
      return; // 分类的值无效，直接返回
    }
    // 三个分类的值都有效时，发送请求查询属性列表
    getAttrInfoList();
  }, [selectionCate1, selectionCate2, selectionCate3]);

  return (
    <main className={"attr-component"}>
      <Categories setCategories={setCategories}/>
      <Card
        style={{
          width: "100%",
          marginTop: "20px",
        }}
        title={addAttrBtn}
      >
        <Table
          columns={attrTableColumns}
          dataSource={attrTableData}
          rowKey={'id'}
          bordered
          pagination={false}
        />
      </Card>
    </main>
  );
};

export default AttrManage;
