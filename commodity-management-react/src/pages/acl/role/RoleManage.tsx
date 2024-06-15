import {FC, useEffect, useState} from "react";
import {
  Button,
  Card,
  Drawer,
  Form,
  Input,
  message,
  Modal,
  notification,
  Pagination,
  Popconfirm,
  Table,
  Tree
} from "antd";
import {DeleteOutlined, FormOutlined, PlusOutlined, UserOutlined} from "@ant-design/icons";

import './RoleManage.scss';
import {RoleInfoListResponse, RolePermissionResponse, RoleRecord} from "@/api/acl/role/types.ts";
import {
  reqAddOrUpdateRole,
  reqAllPermissionData,
  reqAssignRolePermissions,
  reqDeleteRole,
  reqRoleInfoList
} from "@/api/acl/role";

const FormItem = Form.Item;

const UserManage: FC = () => {
  const [searchForm] = Form.useForm();
  const [roleEditForm] = Form.useForm();
  const [roleNameSearch, setRoleNameSearch] = useState<string>(""); // 搜索框输入的角色名
  // 用户信息表格分页参数
  const [total, setTotal] = useState<number>(1);
  const [pageNo, setPageNo] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(5);
  const [roleInfoList, setRoleInfoList] = useState<RoleRecord[]>([]); // 角色信息列表
  const [showRoleEditModal, setShowRoleEditModal] = useState<boolean>(false); // 是否展示编辑角色的弹窗
  const [roleEditModalScene, setRoleEditModalScene] = useState<0 | 1 | 2>(0); // 编辑角色弹窗的场景  0-关闭，1-添加，2-编辑
  const [roleNameEditing, setRoleNameEditing] = useState<string>(""); // 编辑角色对话框中输入的角色名
  const [selectedRole, setSelectedRole] = useState<RoleRecord | null>(null); // 修改角色名称时，选中的角色对象
  const [showPermissionDrawer, setShowPermissionDrawer] = useState<boolean>(false); // 是否展示分配权限的抽屉组件
  const [allPermissionData, setAllPermissionData] = useState<any[]>([]); // 全部权限数据
  const [checkedPermissions, setCheckedPermissions] = useState<any[]>([]); // 勾选的权限id列表

  const roleEditModalTitles = ["", "添加角色", "编辑角色名称"];
  const addRoleBtn = (
    <Button type={"primary"} icon={<PlusOutlined/>} onClick={onAddRoleClick}>添加角色</Button>
  );

  const roleTableColumns: any[] = [
    {
      title: '序号',
      width: 100,
      align: 'center',
      render: (_: any, __: any, index: number) => index + 1 + (pageNo - 1) * pageSize,
    },
    {
      title: '角色ID',
      dataIndex: 'id',
      width: 100,
      align: 'center',
    },
    {
      title: '角色名称',
      dataIndex: 'roleName',
      align: 'center',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      align: 'center',
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      align: 'center',
    },
    {
      title: '操作',
      align: 'center',
      width: 350,
      render: (_: any, record: RoleRecord) => (
        <div className={"opt-btns-wrapper"}>
          <Button
            type={"primary"}
            icon={<UserOutlined/>}
            size={"small"}
            className={"opt-btn"}
            onClick={() => onAssignPermissionClick(record)}
          >
            分配权限
          </Button>
          <Button
            type={"primary"}
            icon={<FormOutlined/>}
            size={"small"}
            className={"opt-btn"}
            onClick={() => onUpdateRoleClick(record)}
          >
            修改名称
          </Button>
          <Popconfirm
            title="删除角色"
            description="是否确认删除当前角色？"
            onConfirm={() => deleteRole(record)}
            okText="确认"
            cancelText="取消"
            okButtonProps={{danger: true}}
          >
            <Button
              type={"primary"}
              icon={<DeleteOutlined/>}
              size={"small"}
              danger
              className={"opt-btn"}
            >
              删除
            </Button>
          </Popconfirm>
        </div>
      )
    },
  ];

  // 分配权限抽屉组件的页脚
  const permissionDrawerFooter = (<>
    <Button type={"primary"} onClick={submitAssignPermissions}>确定</Button>
    <Button className={"cancel-permission-assign"} onClick={onDrawerClose}>取消</Button>
  </>);

  // 查询角色列表
  async function getRoleInfoList(roleName?: string) {
    const response: RoleInfoListResponse = await reqRoleInfoList(pageNo, pageSize, roleName);
    if (response.code === 200) {
      setRoleInfoList(response.data.records);
      setTotal(response.data.total);
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

  // 搜索栏重置按钮的点击回调
  function onResetSearchForm() {
    getRoleInfoList();
    setRoleNameSearch("");
    searchForm.resetFields();
  }

  // 添加角色按钮点击回调
  function onAddRoleClick() {
    setShowRoleEditModal(true);
    setRoleEditModalScene(1);
  }

  // 修改名称按钮点击回调
  function onUpdateRoleClick(record: RoleRecord) {
    setShowRoleEditModal(true);
    setRoleEditModalScene(2);
    setSelectedRole(record);
    setRoleNameEditing(record.roleName);
  }

  // 编辑角色弹出确定按钮的点击回调
  async function submitAddOrUpdateRole() {
    if (!roleNameEditing) {
      message.warning("请输入正确的角色名称！角色名称不能为空或仅包含空格");
      return;
    }
    const response: any = await reqAddOrUpdateRole({
      id: selectedRole?.id as number,
      roleName: roleNameEditing,
    });
    if (response.code === 200) {
      notification.open({
        type: "success",
        message: `${roleEditModalScene === 1 ? "添加角色" : "修改角色名称"}成功！`,
      });
      onCancelRoleEdit();
      getRoleInfoList();
    } else {
      notification.open({
        type: "error",
        message: `${roleEditModalScene === 1 ? "添加角色" : "修改角色名称"}失败！`,
        description: response.data,
      });
    }
  }

  // 编辑角色弹窗取消的回调
  function onCancelRoleEdit() {
    roleEditForm.resetFields();
    setRoleNameEditing("");
    setSelectedRole(null);
    setShowRoleEditModal(false);
    setRoleEditModalScene(0);
  }

  // 删除角色
  async function deleteRole(record: RoleRecord) {
    const response: any = await reqDeleteRole(record.id as number);
    if (response.code === 200) {
      notification.open({
        type: "success",
        message: `删除角色成功！`,
      });
      getRoleInfoList();
    } else {
      notification.open({
        type: "error",
        message: `删除角色失败！`,
        description: response.data,
      });
    }
  }

  // 分配权限按钮的点击回调
  function onAssignPermissionClick(record: RoleRecord) {
    setSelectedRole(record);
    setShowPermissionDrawer(true);
  }

  // 权限抽屉组件关闭的回调
  function onDrawerClose() {
    setShowPermissionDrawer(false);
    setAllPermissionData([]);
    setCheckedPermissions([]);
    setSelectedRole(null);
  }

  // 获取全部权限数据
  async function getAllPermissionData(roleId: number) {
    const response: RolePermissionResponse = await reqAllPermissionData(roleId);
    if (response.code === 200) {
      const checked: any[] = [];
      processPermissionData(response.data, checked);
      setCheckedPermissions(checked);
      setAllPermissionData(response.data);
    }
  }

  // 处理权限数据
  function processPermissionData(pData: any[], checked: any[]) {
    pData.forEach(item => {
      // 筛选默认勾选的项，只需要筛选第4级
      if (item.level === 4 && item.select) {
        checked.push(item.id);
      }
      if (item.children && item.children.length > 0) {
        processPermissionData(item.children, checked);
      }
    });
  }

  // 树形控件的节点复选框勾选回调
  function onCheckTreeNodes(checkedIds: any) {
    setCheckedPermissions(checkedIds);
  }

  // 树形控件的节点点击勾选回调
  function onSelectTreeNode(_: any, e: any) {
    const {node} = e;
    const permissionCopy = [...checkedPermissions];
    const index = permissionCopy.indexOf(node.id);
    if (index >= 0) {
      permissionCopy.splice(index, 1);
    } else {
      permissionCopy.push(node.id);
    }
    setCheckedPermissions(permissionCopy);
  }

  // 提交分配权限请求
  async function submitAssignPermissions() {
    const response: any = await reqAssignRolePermissions(selectedRole?.id as number, checkedPermissions);
    if (response.code === 200) {
      notification.open({
        type: "success",
        message: "分配权限成功！",
      });
      onDrawerClose();
    } else {
      notification.open({
        type: "error",
        message: "分配权限失败！",
        description: response.data,
      });
    }
  }

  useEffect(() => {
    getRoleInfoList();
  }, [pageNo, pageSize]);

  useEffect(() => {
    // 对话框打开时，为表单赋值
    if (showRoleEditModal && selectedRole && roleEditModalScene === 2) {
      roleEditForm.setFieldValue("roleName", selectedRole.roleName);
    }
  }, [showRoleEditModal, selectedRole, roleEditModalScene]);

  useEffect(() => {
    // 抽屉打开时查询权限数据
    if (showPermissionDrawer && selectedRole) {
      getAllPermissionData(selectedRole.id as number);
    }
  }, [showPermissionDrawer, selectedRole]);

  return (
    <main className={"role-component"}>
      <Card style={{width: "100%"}}>
        <Form
          form={searchForm}
          name={"searchForm"}
          layout={"inline"}
          autoComplete={"off"}
          className={"search-form"}
          onFinish={() => getRoleInfoList(roleNameSearch)}
        >
          <FormItem
            label={"角色名称"}
            name={"roleNameSearch"}
          >
            <Input placeholder={"请输入角色名称"} onChange={(e: any) => setRoleNameSearch(e.target.value.trim())}/>
          </FormItem>
          <FormItem>
            <Button type={"primary"} htmlType={"submit"} disabled={!roleNameSearch}>搜索</Button>
            <Button className={"reset-btn"} onClick={onResetSearchForm}>重置</Button>
          </FormItem>
        </Form>
      </Card>

      <Card
        title={addRoleBtn}
        style={{width: "100%", marginTop: "15px"}}
      >
        <Table
          columns={roleTableColumns}
          dataSource={roleInfoList}
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
      </Card>

      {/*添加角色/修改角色名称对话框*/}
      <Modal
        open={showRoleEditModal}
        title={roleEditModalTitles[roleEditModalScene]}
        centered
        onOk={submitAddOrUpdateRole}
        onCancel={onCancelRoleEdit}
      >
        <Form
          form={roleEditForm}
          name={"roleEditForm"}
          autoComplete={"off"}
        >
          <FormItem
            label={"角色名称"}
            name={"roleName"}
          >
            <Input placeholder={"请输入角色名称"} onChange={(e: any) => setRoleNameEditing(e.target.value.trim())}/>
          </FormItem>
        </Form>
      </Modal>

      {/*分配权限的抽屉组件*/}
      <Drawer
        open={showPermissionDrawer}
        title={"分配权限"}
        footer={permissionDrawerFooter}
        onClose={onDrawerClose}
        width={400}
      >
        {/*有数据时才渲染Tree组件，否则defaultExpandAll会失效*/}
        {
          allPermissionData.length > 0 &&
          <Tree
            checkable
            selectable={false}
            defaultExpandAll
            treeData={allPermissionData}
            checkedKeys={checkedPermissions}
            fieldNames={{title: 'name', key: 'id'}}
            onCheck={onCheckTreeNodes}
            onSelect={onSelectTreeNode}
          />
        }
      </Drawer>
    </main>
  );
};

export default UserManage;
