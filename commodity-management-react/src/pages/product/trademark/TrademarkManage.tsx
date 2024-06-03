import {FC} from "react";
import {Button, Card, Table} from "antd";
import {DeleteOutlined, FormOutlined, PlusOutlined} from "@ant-design/icons";

import './TrademarkManage.scss';

const TrademarkManage: FC = () => {
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
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: '品牌名称',
      dataIndex: 'name',
      align: 'center',
      className: 'name-col',
    },
    {
      title: '品牌LOGO',
      dataIndex: 'logo',
      align: 'center',
      className: 'logo-col',
      render: (_: any, record: any) => {
        return (
          <img src={record.logo} alt={''} style={{height: "80px"}}/>
        );
      }
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
            style={{
              width: "50px",
              backgroundColor: "#ffb500",
              color: "#fff",
              marginRight: "10px",
              border: "0",
            }}
          ></Button>
          <Button
            icon={<DeleteOutlined/>}
            style={{
              width: "50px",
              backgroundColor: "#ff4400",
              color: "#fff",
              border: "0",
            }}
          ></Button>
        </>);
      }
    }
  ];

  const tableData = [
    {
      key: 1,
      name: '小米',
      logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQaoXbVS3HYx9_IrqH1KWaCw9wGyDJfb0Mr1w&s'
    },
    {
      key: 2,
      name: '小米',
      logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQaoXbVS3HYx9_IrqH1KWaCw9wGyDJfb0Mr1w&s'
    },
  ];

  return (
    <main className={"trademark-component"}>
      <Card
        title={cardTitle}
        style={{width: "100%", height: "100%", overflow: "auto"}}
      >
        <Table
          columns={tableColumns}
          dataSource={tableData}
          bordered
          rowClassName={() => "table-row-abc"}
        />
      </Card>
    </main>
  );
};

export default TrademarkManage;
