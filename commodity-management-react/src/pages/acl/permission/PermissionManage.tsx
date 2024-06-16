import {FC, useEffect, useState} from "react";
import {Button, Card, Empty, Form, Input, Modal, notification, Popconfirm, Table} from "antd";

import './PermissionManage.scss';
import {MenuListResponse, MenuRecord} from "@/api/acl/menu/types.ts";
import {reqAddOrUpdateMenu, reqAllMenus, reqDeleteMenu} from "@/api/acl/menu";
import {DeleteOutlined, FormOutlined, PlusOutlined} from "@ant-design/icons";

const FormItem = Form.Item;

const PermissionManage: FC = () => {
  const [menuEditForm] = Form.useForm();
  const [allMenuList, setAllMenuList] = useState<MenuRecord[]>([]); // 所有菜单数据列表
  const [showMenuEditModal, setShowMenuEditModal] = useState<boolean>(false); // 是否展示编辑菜单的对话框
  const [menuEditModalScene, setMenuEditModalScene] = useState<0 | 1 | 2>(0); // 对话框场景 0-隐藏，1-添加，,2-编辑
  const [selectedMenu, setSelectedMenu] = useState<MenuRecord | null>(null); // 操作菜单时，选中的菜单项数据
  const [menuEditFormData, setMenuEditFormData] = useState<any>({ // 新增/更新菜单对话框内表单数据
    menuName: "", permissionVal: "",
  });

  const menuEditModalTitles = ["", "添加菜单", "修改菜单"];

  const menuTableColumns: any[] = [
    {
      title: '名称',
      dataIndex: 'name',
    },
    {
      title: '权限值',
      dataIndex: 'code',
    },
    {
      title: '修改时间',
      dataIndex: 'updateTime',
    },
    {
      title: '操作',
      width: 320,
      align: 'center',
      render: (_: any, record: MenuRecord) => (<div className={"opt-btns-wrapper"}>
        {
          record.level <= 3 &&
          <Button
            type={"primary"}
            icon={<PlusOutlined/>}
            size={"small"}
            className={"opt-btn"}
            onClick={() => onAddClick(record)}
          >
            添加{record.level >= 3 ? "功能" : "菜单"}
          </Button>
        }
        <Button
          type={"primary"}
          icon={<FormOutlined/>}
          size={"small"}
          disabled={record.level === 1}
          onClick={() => onUpdateClick(record)}
          className={"opt-btn"}
        >
          编辑
        </Button>
        <Popconfirm
          title="删除菜单"
          description="是否确认删除当前菜单？"
          okText="确认"
          cancelText="取消"
          okButtonProps={{danger: true}}
          onConfirm={() => deleteMenu(record.id as number)}
        >
          <Button
            type={"primary"}
            icon={<DeleteOutlined/>}
            size={"small"}
            danger
            disabled={record.level === 1}
            className={"opt-btn"}
          >
            删除
          </Button>
        </Popconfirm>
      </div>)
    }
  ];

  // 获取所有菜单数据
  async function getAllMenuList() {
    const response: MenuListResponse = await reqAllMenus();
    if (response.data) {
      setAllMenuList(response.data);
    }
  }

  // 保存新增/更新菜单对话框表单数据
  function saveMenuEditFormData(attrName: string, attrVal: string) {
    setMenuEditFormData({...menuEditFormData, [attrName]: attrVal});
  }

  // 添加按钮点击回调
  function onAddClick(record: MenuRecord) {
    setSelectedMenu(record);
    setShowMenuEditModal(true);
    setMenuEditModalScene(1);
  }

  // 编辑按钮点击回调
  function onUpdateClick(record: MenuRecord) {
    setSelectedMenu(record);
    setShowMenuEditModal(true);
    setMenuEditModalScene(2);
  }

  // 提交添加/更新菜单
  async function submitAddOrUpdateMenu() {
    const params: MenuRecord = {
      id: menuEditModalScene === 2 ? selectedMenu?.id : undefined,
      pid: menuEditModalScene === 2 ? selectedMenu?.pid as number : selectedMenu?.id as number,
      name: menuEditFormData.menuName,
      code: menuEditFormData.permissionVal,
      level: (selectedMenu?.level as number) + 1,
    };
    const response: any = await reqAddOrUpdateMenu(params);
    if (response.code === 200) {
      notification.open({
        type: "success",
        message: `${menuEditModalTitles[menuEditModalScene]}成功！`
      });
      getAllMenuList();
      onModalClose();
    } else {
      notification.open({
        type: "error",
        message: `${menuEditModalTitles[menuEditModalScene]}失败！`,
        description: response.data,
      });
    }
  }

  // 对话框关闭回调
  function onModalClose() {
    setSelectedMenu(null);
    setShowMenuEditModal(false);
    setMenuEditModalScene(0);
    setMenuEditFormData({menuName: "", permissionVal: ""});
    menuEditForm.resetFields();
  }

  // 删除菜单
  async function deleteMenu(id: number) {
    const response: any = await reqDeleteMenu(id);
    if (response.code === 200) {
      notification.open({
        type: "success",
        message: `删除菜单成功！`,
      });
      getAllMenuList();
    } else {
      notification.open({
        type: "error",
        message: `删除菜单失败！`,
        description: response.data,
      });
    }
  }

  useEffect(() => {
    getAllMenuList();
  }, []);

  useEffect(() => {
    if (showMenuEditModal && selectedMenu && menuEditModalScene === 2) {
      const data = {menuName: selectedMenu.name, permissionVal: selectedMenu.code};
      menuEditForm.setFieldsValue(data);
      setMenuEditFormData(data);
    }
  }, [showMenuEditModal, selectedMenu, menuEditModalScene]);

  return (
    <main className={"permission-component"}>
      <Card style={{width: "100%"}}>
        {
          allMenuList.length > 0 &&
          <Table
            columns={menuTableColumns}
            dataSource={allMenuList}
            rowKey={"id"}
            bordered
            pagination={false}
            expandable={{defaultExpandAllRows: true}}
          />
        }
        {
          allMenuList.length === 0 &&
          <Empty/>
        }
      </Card>

      {/*添加/编辑菜单对话框*/}
      <Modal
        open={showMenuEditModal}
        title={menuEditModalTitles[menuEditModalScene]}
        centered
        onOk={submitAddOrUpdateMenu}
        onCancel={onModalClose}
      >
        <Form
          form={menuEditForm}
          name={"menuEditForm"}
          labelCol={{span: 4}}
        >
          <FormItem
            label={"名称"}
            name={"menuName"}
            rules={[{required: true, message: "菜单名称不能为空"}]}
          >
            <Input
              placeholder={`请输入${selectedMenu && selectedMenu.level <= 2 ? '菜单' : "功能"}名称`}
              onChange={(e: any) => saveMenuEditFormData("menuName", e.target.value)}
            />
          </FormItem>
          <FormItem
            label={"权限值"}
            name={"permissionVal"}
            rules={[{required: true, message: "菜单权限值不能为空"}]}
          >
            <Input
              placeholder={"请输入菜单权限值"}
              onChange={(e: any) => saveMenuEditFormData("permissionVal", e.target.value)}
            />
          </FormItem>
        </Form>
      </Modal>
    </main>
  );
};

export default PermissionManage;
