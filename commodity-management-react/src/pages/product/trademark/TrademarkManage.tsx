import {FC, useEffect, useState} from "react";
import {Button, Card, Form, Input, Modal, notification, Pagination, Popconfirm, Table, Upload} from "antd";
import {DeleteOutlined, FormOutlined, LoadingOutlined, PlusOutlined} from "@ant-design/icons";

import './TrademarkManage.scss';
import {reqCreateOrUpdateTrademark, reqDeleteTrademark, reqTrademarkData} from "@/api/product/trademark";
import {QueryTrademarkResponse, Trademark, TrademarkFormData, TrademarkRecords} from "@/api/product/trademark/types.ts";
import {types} from "sass";
import Error = types.Error;

const FormItem = Form.Item;

const TrademarkManage: FC = () => {
  const [total, setTotal] = useState<number>(1);
  const [pageNo, setPageNo] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(5);
  const [trademarkData, setTrademarkData] = useState<TrademarkRecords>([]);
  // 控制新增、编辑品牌的对话框是否显示
  const [showTrademarkModal, setShowTrademarkModal] = useState<boolean>(false);
  const [modalTitle, setModalTitle] = useState<string>('');
  // 对话框中表单的输入数据
  const [tmFormData, setTmFormData] = useState<TrademarkFormData>({
    tmName: "",
    logoUrl: "",
  });
  const [uploading, setUploading] = useState<boolean>(false); // 图片是否正在上传中
  const [trademarkFormRef] = Form.useForm();

  const cardTitle = (
    <Button type={"primary"} icon={<PlusOutlined/>}
            onClick={onCreateTrademarkClick}>
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
      render: (_: any, record: any) => {
        return (<>
          <Button
            icon={<FormOutlined/>}
            className={"opt-btn update-btn"}
            onClick={() => onUpdateTrademarkClick(record)}
          ></Button>
          <Popconfirm
            title="删除品牌"
            description="是否确认删除当前品牌？"
            onConfirm={() => deleteTrademark(record)}
            okText="确认"
            cancelText="取消"
            okButtonProps={{danger: true}}
          >
            <Button
              icon={<DeleteOutlined/>}
              className={"opt-btn del-btn"}
            ></Button>
          </Popconfirm>
        </>);
      }
    }
  ];

  // 对话框中上传图片的按钮
  const uploadButton = (
    <button style={{border: 0, background: 'none'}} type="button">
      {uploading ? <LoadingOutlined/> : <PlusOutlined/>}
    </button>
  );

  // 获取品牌数据
  async function getTrademarkData() {
    const response: QueryTrademarkResponse = await reqTrademarkData(pageNo, pageSize);
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

  // 新增品牌按钮的点击回调
  function onCreateTrademarkClick() {
    openModal("添加品牌");
  }

  // 编辑品牌按钮的点击回调
  function onUpdateTrademarkClick(record: Trademark) {
    openModal("编辑品牌");
    const {id, tmName, logoUrl} = record;
    setTmFormData({id, tmName, logoUrl});
    trademarkFormRef.setFieldValue('tmName', record.tmName);
  }

  // 删除品牌按钮的点击回调
  async function deleteTrademark(record: Trademark) {
    const response: any = await reqDeleteTrademark(record.id as number);
    if (response.code === 200) {
      notification.open({
        type: "success",
        message: "删除品牌成功！",
      });
      if (pageNo !== 1) {
        setPageNo(1); // 将页码重置为1，useEffect中会自动重新请求表格数据
      } else {
        getTrademarkData();
      }
    } else {
      notification.open({
        type: "error",
        message: "删除品牌失败！",
        description: response.data,
      });
    }
  }

  function onModalOk() {
    trademarkFormRef.validateFields()
      .then(async () => {
        const response = await reqCreateOrUpdateTrademark(tmFormData);
        if (response.code === 200) {
          if (pageNo !== 1) {
            setPageNo(1); // 将页码重置为1，useEffect中会自动重新请求表格数据
          } else {
            getTrademarkData();
          }
          // 弹出提示并关闭对话框
          notification.open({
            type: "success",
            message: `${tmFormData.id ? "更新" : "添加"}品牌成功！`
          });
          trademarkFormRef.resetFields();
          setTmFormData({tmName: "", logoUrl: ""});
          closeModal();
        } else {
          notification.open({
            type: "error",
            message: `${tmFormData.id ? "更新" : "添加"}品牌失败！`,
          });
        }
      })
      .catch(() => {
      });
  }

  function onModalCancel() {
    trademarkFormRef.resetFields();
    setTmFormData({tmName: "", logoUrl: ""});
    closeModal();
  }

  function openModal(title: string) {
    setModalTitle(title);
    setShowTrademarkModal(true);
  }

  function closeModal() {
    setModalTitle("");
    setShowTrademarkModal(false);
  }

  function onTrademarkNameChange(e: any) {
    setTmFormData({
      ...tmFormData,
      tmName: e.target.value,
    });
  }

  function beforeUpload() {
    setUploading(true);
  }

  function onUploadFileChange({fileList}: any) {
    const uploadInfo = fileList[fileList.length - 1];
    if (uploadInfo.percent < 100 || !uploadInfo.response) {
      return;
    }
    const {response} = uploadInfo;
    if (response.code === 200) {
      setTmFormData({
        ...tmFormData,
        logoUrl: response.data,
      });
    }
    setUploading(false);
  }

  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

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
          rowClassName={() => "table-row"}
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

        <Modal
          open={showTrademarkModal}
          title={modalTitle}
          centered
          closable={false}
          okText={"确定"}
          cancelText={"取消"}
          onOk={onModalOk}
          onCancel={onModalCancel}
        >
          <Form
            form={trademarkFormRef}
            name={"trademarkForm"}
            labelCol={{span: 5}}
            wrapperCol={{span: 17, offset: 1}}
            autoComplete="off"
          >
            <FormItem
              label={"品牌名称"}
              name={"tmName"}
              rules={[{required: true, message: "请输入品牌名称"}]}
            >
              <Input placeholder={"请输入品牌名称"} onChange={onTrademarkNameChange}/>
            </FormItem>
            <FormItem
              label={"品牌Logo"}
              name={"logoUrl"}
              valuePropName={"fileList"}
              getValueFromEvent={normFile}
              rules={[{
                validator: () => {
                  if (!tmFormData.logoUrl) {
                    return Promise.reject(new Error("请上传品牌Logo图片！"));
                  }
                  return Promise.resolve();
                }
              }]}
            >
              {/* Upload组件不能设置 name 属性，否则会上传失败 */}
              <Upload
                action={"/api/admin/product/fileUpload"}
                listType={"picture-card"}
                showUploadList={false}
                accept={".jpg,.jpeg,.png"}
                beforeUpload={beforeUpload}
                onChange={onUploadFileChange}
              >
                {
                  tmFormData.logoUrl ?
                    <img src={tmFormData.logoUrl} alt="" style={{width: '100%'}}/> :
                    uploadButton
                }
              </Upload>
            </FormItem>
          </Form>
        </Modal>
      </Card>
    </main>
  );
};

export default TrademarkManage;
