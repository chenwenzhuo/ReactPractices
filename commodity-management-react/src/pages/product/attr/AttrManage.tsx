import {FC, useEffect, useState} from "react";
import {Button, Card, Form, Input, notification, Popconfirm, Table, Tag} from "antd";
import {DeleteOutlined, FormOutlined, PlusOutlined} from "@ant-design/icons";
import {nanoid} from "@reduxjs/toolkit";

import './AttrManage.scss';
import Categories from "@/components/categories/Categories.tsx";
import {reqAddOrUpdateAttr, reqAttrInfoList, reqDeleteAttr} from "@/api/product/attr";
import {getRandomIndex} from "@/utils";
import {Attr, AttrResponseData, AttrValue} from "@/api/product/attr/types";

enum Scene {
  DISPLAY_ATTR = "display_attr",
  ADD_ATTR = "add_attr",
  UPDATE_ATTR = "update_attr",
}

const FormItem = Form.Item;
const tagType = ["success", "processing", "error", "warning"]; // 属性值Tag组件的样式

const AttrManage: FC = () => {
  const [selectionCate1, setSelectionCate1] = useState<number | null>(null); // 一级分类选中项
  const [selectionCate2, setSelectionCate2] = useState<number | null>(null); // 二级分类选中项
  const [selectionCate3, setSelectionCate3] = useState<number | null>(null); // 三级分类选中项
  const [attrTableData, setAttrTableData] = useState<Attr[]>([]); // 属性表格数据
  const [scene, setScene] = useState<string>(Scene.DISPLAY_ATTR); // 场景标记，展示/添加/更新属性
  const [newAttrName, setNewAttrName] = useState<string>(''); // 添加/更新属性时，新属性名称
  const [newAttrVals, setNewAttrVals] = useState<AttrValue[]>([]);// 添加/更新属性时，新属性的值的列表
  const [attrIdToUpdate, setAttrIdToUpdate] = useState<number | null>(null); // 更新属性时，属性的id

  const [attrNameForm] = Form.useForm();

  // 添加属性按钮禁用标志
  const categoriesValidFlag = selectionCate1 !== null && selectionCate2 !== null && selectionCate3 !== null;
  const addAttrBtn = (
    <Button type={"primary"} icon={<PlusOutlined/>}
            disabled={!categoriesValidFlag}
            onClick={() => changeScene(1)}>
      添加平台属性
    </Button>
  );

  // 展示属性的表格的列配置
  const attrDisplayTableColumns: any[] = [
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
      render: (_: any, record: Attr) => {
        return record.attrValueList.map((item: AttrValue) => (
          <Tag color={tagType[getRandomIndex(tagType.length)]} key={item.id}>
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
      render: (_: any, record: Attr) => {
        return (<>
          <Button
            icon={<FormOutlined/>}
            className={"opt-btn update-btn"}
            onClick={() => onUpdateAttrClick(record)}
          ></Button>
          <Popconfirm
            title="删除属性"
            description="是否确认删除当前属性？"
            okText="确认"
            cancelText="取消"
            okButtonProps={{danger: true}}
            onConfirm={() => deleteAttr(record.id as number)}
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

  // 添加属性的表格的列配置
  const attrAddTableColumns: any[] = [
    {
      title: '序号',
      dataIndex: 'index',
      width: 100,
      align: 'center',
      className: 'index-col',
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: '属性值',
      render: (_: any, record: AttrValue, index: number) => (
        <Input
          autoFocus={scene === Scene.ADD_ATTR}
          placeholder={"请输入属性值名称"}
          defaultValue={record.valueName}
          onBlur={(e: any) => setAttrValueName(e, index)}
        />
      ),
    },
    {
      title: '操作',
      width: 200,
      align: 'center',
      render: (_: any, __: any, index: number) => {
        return (<>
          <Popconfirm
            title="删除属性值"
            description="是否确认删除当前属性值？"
            okText="确认"
            cancelText="取消"
            okButtonProps={{danger: true}}
            onConfirm={() => deleteAttrVal(index)}
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

  function setCategories(cate1: number | null, cate2: number | null, cate3: number | null) {
    setSelectionCate1(cate1);
    setSelectionCate2(cate2);
    setSelectionCate3(cate3);
  }

  async function getAttrInfoList() {
    const response: AttrResponseData = await reqAttrInfoList(
      selectionCate1 as number,
      selectionCate2 as number,
      selectionCate3 as number
    );
    if (response.code === 200) {
      setAttrTableData(response.data);
    }
  }

  // 改变当前功能场景
  function changeScene(index: number) {
    const sceneArr = [Scene.DISPLAY_ATTR, Scene.ADD_ATTR, Scene.UPDATE_ATTR];
    if (index < 0 || index >= sceneArr.length) {
      return;
    }
    setScene(sceneArr[index]);
  }

  // 添加属性时，新属性输入框改变回调
  function onNewAttrNameChange(e: any) {
    setNewAttrName(e.target.value);
  }

  // 添加一个属性值
  function addAttrValue() {
    setNewAttrVals([...newAttrVals, {valueName: "", key: nanoid()}]);
  }

  // 修改属性值valueName   index-要修改的属性值的下标
  function setAttrValueName(e: any, index: number) {
    console.log('setAttrValueName---', e.target.value, index);
    setNewAttrVals([
      ...newAttrVals.slice(0, index),
      {...newAttrVals[index], valueName: e.target.value.trim()},
      ...newAttrVals.slice(index + 1),
    ]);
  }

  // 删除一个属性值
  function deleteAttrVal(index: number) {
    setNewAttrVals([
      ...newAttrVals.slice(0, index),
      ...newAttrVals.slice(index + 1),
    ])
  }

  // 保存新增的属性及属性值
  async function saveNewAttr() {
    // 检查属性值不能为空
    const attrValsValid = newAttrVals.reduce(
      (prev: boolean, attrVal: AttrValue) => prev && attrVal.valueName !== "",
      true
    );
    if (!attrValsValid) {
      notification.open({
        type: "error",
        message: "属性值无效！",
        description: "属性值不能为空或以空格开头、结尾，请检查您的输入。"
      });
      return;
    }
    // 发送请求
    const response: any = await reqAddOrUpdateAttr({
      id: attrIdToUpdate,
      attrName: newAttrName,
      attrValueList: newAttrVals,
      categoryId: selectionCate3 as number,
      categoryLevel: 3,
    });
    if (response.code !== 200) {
      notification.open({
        type: 'error',
        message: `${scene === Scene.ADD_ATTR ? '添加' : '更新'}属性失败！`,
      });
      return;
    }
    notification.open({
      type: 'success',
      message: `${scene === Scene.ADD_ATTR ? '添加' : '更新'}属性成功！`,
    });
    // 回到展示界面，重新查询属性列表
    changeScene(0);
    setAttrTableData([]);
    getAttrInfoList();
    // 清空输入
    setAttrIdToUpdate(null);
    setNewAttrName("");
    setNewAttrVals([]);
    attrNameForm.resetFields();
  }

  // 更新属性按钮点击回调
  function onUpdateAttrClick(record: Attr) {
    changeScene(2);
    attrNameForm.setFieldValue("newAttrName", record.attrName);
    setAttrIdToUpdate(record.id as number);
    setNewAttrName(record.attrName);
    setNewAttrVals(record.attrValueList.map(item => ({...item, key: nanoid()})));
  }

  // 删除属性
  async function deleteAttr(attrId: number) {
    const response: any = await reqDeleteAttr(attrId);
    if (response.code === 200) {
      notification.open({
        type: 'success',
        message: `删除属性成功！`,
      });
      getAttrInfoList();
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
      <Categories
        setCategories={setCategories}
        disabled={scene === Scene.ADD_ATTR}
      />
      <Card
        title={scene === Scene.DISPLAY_ATTR && addAttrBtn}
        style={{width: "100%", marginTop: "20px", overflow: "auto"}}
      >
        {/*展示属性区域*/}
        {
          scene === Scene.DISPLAY_ATTR &&
          <Table
            columns={attrDisplayTableColumns}
            dataSource={attrTableData}
            rowKey={'id'}
            bordered
            pagination={false}
          />
        }
        {/*添加属性区域*/}
        {
          (scene === Scene.ADD_ATTR || scene === Scene.UPDATE_ATTR) &&
          <div>
            <Form
              form={attrNameForm}
              name={"attrNameForm"}
              layout={"inline"}
              autoComplete={"off"}
            >
              <FormItem
                label={"属性名称"}
                name={"newAttrName"}
              >
                <Input
                  placeholder={"请输入新属性名称"}
                  onChange={onNewAttrNameChange}
                  className={"add-attr-input"}
                />
              </FormItem>
            </Form>
            <div>
              <Button
                type={"primary"}
                icon={<PlusOutlined/>}
                disabled={!newAttrName}
                onClick={addAttrValue}
                className={"add-attr-val-btn"}
              >
                添加属性值
              </Button>
            </div>
            <Table
              columns={attrAddTableColumns}
              dataSource={newAttrVals}
              rowKey={"key"}
              bordered
              pagination={false}
              className={"add-attr-table"}
            />
            <div>
              <Button
                type={"primary"}
                disabled={newAttrName === "" || newAttrVals.length === 0}
                onClick={saveNewAttr}
              >
                保存
              </Button>
              <Button onClick={() => changeScene(0)}
                      className={"cancel-attr-adding-btn"}>
                取消
              </Button>
            </div>
          </div>
        }
      </Card>
    </main>
  );
};

export default AttrManage;
