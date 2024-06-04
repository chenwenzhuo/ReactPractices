import {FC, useEffect, useState} from "react";
import {Button, Card, Pagination, Table} from "antd";
import {DeleteOutlined, FormOutlined, PlusOutlined} from "@ant-design/icons";

import './TrademarkManage.scss';
import {reqTrademarkData} from "@/api/product/trademark";
import {QueryTrademarkResponse, Trademark, TrademarkRecords} from "@/api/product/trademark/types.ts";

const TrademarkManage: FC = () => {
  const [total, setTotal] = useState<number>(1);
  const [pageNo, setPageNo] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(5);
  const [trademarkData, setTrademarkData] = useState<TrademarkRecords>([]);

  const cardTitle = (
    <Button type={"primary"} icon={<PlusOutlined/>}>
      添加品牌
    </Button>
  );

  const tableColumns: any[] = [
    {
      title: '序号',
      dataIndex: 'index',
      width: 100,
      align: 'center',
      className: 'index-col',
      render: (_: any, __: any, index: number) => index + 1 + (pageNo - 1) * pageSize,
    },
    {
      title: '品牌名称',
      dataIndex: 'tmName',
      align: 'center',
      className: 'name-col',
    },
    {
      title: '品牌LOGO',
      dataIndex: 'logoUrl',
      align: 'center',
      className: 'logo-col',
      render: (_: any, record: any) => (<img src={record.logoUrl} alt={"暂无Logo"} className={"logo-img"}/>)
    },
    {
      title: '操作',
      width: 200,
      align: 'center',
      className: 'opt-col',
      render: () => {
        return (<>
          <Button
            icon={<FormOutlined/>}
            className={"opt-btn modify-btn"}
            onClick={onEditTrademarkClick}
          ></Button>
          <Button
            icon={<DeleteOutlined/>}
            className={"opt-btn del-btn"}
            onClick={onDeleteTrademarkClick}
          ></Button>
        </>);
      }
    }
  ];

  // 获取品牌数据
  async function getTrademarkData() {
    const response: QueryTrademarkResponse = await reqTrademarkData(pageNo, pageSize);
    console.log('getTrademarkData response---', response);
    if (response.code === 200) {
      const {data} = response;
      // 有的返回数据的logoUrl有问题，修复一下
      data.records.forEach((item: Trademark) => {
        if (item.logoUrl && !item.logoUrl.startsWith('http://')) {
          item.logoUrl = `http://${item.logoUrl}`;
        }
      });
      setTotal(data.total);
      setTrademarkData(data.records);
    } else {
      setTotal(0);
      setTrademarkData([]);
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

  // 编辑品牌按钮的点击回调
  function onEditTrademarkClick() {
  }

  // 删除品牌按钮的点击回调
  function onDeleteTrademarkClick() {
  }

  // 分页的页码和页大小发生变化时，重新获取数据
  useEffect(() => {
    getTrademarkData();
  }, [pageNo, pageSize]);

  return (
    <main className={"trademark-component"}>
      <Card
        title={cardTitle}
        style={{width: "100%", height: "100%", overflow: "auto"}}
      >
        <Table
          columns={tableColumns}
          dataSource={trademarkData}
          rowKey={"id"}
          bordered
          pagination={false}
          rowClassName={() => "table-row-abc"}
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
    </main>
  );
};

export default TrademarkManage;
