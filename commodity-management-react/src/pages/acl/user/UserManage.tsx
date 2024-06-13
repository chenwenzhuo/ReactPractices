import {FC, useEffect, useState} from "react";
import {Button, Card, Checkbox, Drawer, Form, Input, message, notification, Pagination, Popconfirm, Table} from "antd";
import {DeleteOutlined, FormOutlined, PlusOutlined, UserOutlined} from "@ant-design/icons";

import './UserManage.scss';
import {
  AssignRoleData,
  RoleListResponse,
  RoleRecord,
  UserEditFormType,
  UserInfoListResponse,
  UserRecord
} from "@/api/acl/user/types.ts";
import {
  reqAddOrUpdateUser,
  reqAllAssignableRoles, reqAssignUserRoles,
  reqDeleteUser,
  reqDeleteUserBatch,
  reqUserInfoList
} from "@/api/acl/user";

const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;

const UserManage: FC = () => {
  const [searchForm] = Form.useForm();
  const [userEditForm] = Form.useForm();
  const [assignRoleForm] = Form.useForm();
  const [usernameSearch, setUsernameSearch] = useState<string>(""); // 搜索框输入的用户名
  // 用户信息表格分页参数
  const [total, setTotal] = useState<number>(1);
  const [pageNo, setPageNo] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(5);
  const [userInfoList, setUserInfoList] = useState<UserRecord[]>([]); // 用户信息列表
  const [selectedRowIds, setSelectedRowIds] = useState<number[]>([]); // 表格选中行的id
  const [showDrawer, setShowDrawer] = useState<boolean>(false); // 是否展示添加/修改用户抽屉组件
  const [drawerScene, setDrawerScene] = useState<0 | 1 | 2 | 3>(0); // 抽屉组件的场景 0-抽屉关闭，1-添加用户，2-修改用户，3-分配角色
  const [userEditFormData, setUserEditFormData] = useState<UserEditFormType>({ // 添加/修改用户表单的数据类型
    username: "", nickname: "", password: ""
  });
  const [selectedUser, setSelectedUser] = useState<UserRecord | null>(null); // 操作用户时，选中的用户数据
  const [allRoleOptions, setAllRoleOptions] = useState<RoleRecord[]>([]); // 分配角色时，角色选项列表
  const [checkedRoleList, setCheckedRoleList] = useState<number[]>([]); // 分配角色时，选中的角色列表

  const checkAll = allRoleOptions.length === checkedRoleList.length;
  const indeterminate = checkedRoleList.length > 0 && checkedRoleList.length < allRoleOptions.length;

  // 主要内容<Card/>的title
  const mainCardTitle = (<>
    <Button
      type={"primary"}
      icon={<PlusOutlined/>}
      onClick={onCreateUserClick}
    >
      添加用户
    </Button>
    <Button
      type={"primary"}
      icon={<DeleteOutlined/>}
      danger
      disabled={!selectedRowIds.length}
      className={"delete-batch-btn"}
      onClick={deleteUserBatch}
    >
      批量删除
    </Button>
  </>);

  // 用户表格列定义
  const userTableColumns: any[] = [
    {
      title: '序号',
      dataIndex: 'index',
      width: 100,
      align: 'center',
      render: (_: any, __: any, index: number) => index + 1 + (pageNo - 1) * pageSize,
    },
    {
      title: '用户ID',
      dataIndex: 'id',
      width: 100,
      align: 'center',
    },
    {
      title: '用户名',
      dataIndex: 'username',
      align: 'center',
    },
    {
      title: '用户昵称',
      dataIndex: 'name',
      align: 'center',
    },
    {
      title: '用户角色',
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
      width: 300,
      render: (_: any, record: UserRecord) => (
        <div className={"opt-btns-wrapper"}>
          <Button
            type={"primary"}
            icon={<UserOutlined/>}
            size={"small"}
            className={"opt-btn"}
            onClick={() => onAssignRoleClick(record)}
          >
            分配角色
          </Button>
          <Button
            type={"primary"}
            icon={<FormOutlined/>}
            size={"small"}
            className={"opt-btn"}
            onClick={() => onUpdateUserClick(record)}
          >
            更新
          </Button>
          <Popconfirm
            title="删除用户"
            description="是否确认删除当前用户？"
            onConfirm={() => deleteUser(record)}
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
      ),
    },
  ];

  const drawerTitles = ["", "添加用户", "更新用户", "分配用户角色"];

  // 用户名搜索框的onChange回调
  function onUsernameSearchChange(e: any) {
    setUsernameSearch(e.target.value);
  }

  // 查询用户信息列表
  async function getUserInfoList(username?: string) {
    const response: UserInfoListResponse = await reqUserInfoList(pageNo, pageSize, username);
    if (response.code === 200) {
      const {data} = response;
      setUserInfoList(data.records);
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

  // 表格选中行改变的回调
  function onRowSelectionChange(selectedRowKeys: any[]) {
    setSelectedRowIds(selectedRowKeys);
  }

  // 搜索按钮的点击回调
  function onSearchUserByName() {
    if (!usernameSearch) {
      message.error('请输入用户名！');
      return;
    }
    getUserInfoList(usernameSearch);
  }

  // 重置按钮的点击回调
  function onResetSearchForm() {
    getUserInfoList();
    setUsernameSearch("");
    searchForm.resetFields();
  }

  // 添加用户按钮的点击回调，展示抽屉，场景改为添加
  function onCreateUserClick() {
    setShowDrawer(true);
    setDrawerScene(1);
  }

  // 更新用户按钮的点击回调
  function onUpdateUserClick(record: UserRecord) {
    setShowDrawer(true);
    setDrawerScene(2);
    setSelectedUser(record);
  }

  // 抽屉关闭的回调
  function onDrawerClose() {
    setShowDrawer(false);
    setDrawerScene(0);
    setSelectedUser(null);
    if (drawerScene === 1 || drawerScene === 2) {
      setUserEditFormData({username: '', password: '', nickname: ''});
      userEditForm.resetFields();
    } else if (drawerScene === 3) {
      setAllRoleOptions([]);
      setCheckedRoleList([]);
      assignRoleForm.resetFields();
    }
  }

  // 保存编辑用户表单的数据
  function saveUserEditFormData(attrName: keyof UserEditFormType, attrVal: string) {
    setUserEditFormData({...userEditFormData, [attrName]: attrVal});
  }

  // 提交添加/更新用户请求
  async function submitAddOrUpdateUser() {
    try {
      await userEditForm.validateFields();
      const params = {
        id: selectedUser?.id,
        username: userEditFormData.username,
        name: userEditFormData.nickname,
        password: userEditFormData.password,
      };
      const response: any = await reqAddOrUpdateUser(params);
      if (response.code === 200) {
        notification.open({
          type: "success",
          message: `${params.id ? '更新' : '添加'}用户成功！`
        });
        onDrawerClose();
        // 更新用户，直接重新请求当前分页数据，
        // 添加用户，重新请求第1页，通过重置页码，触发useEffect发送请求
        // 但若当前就在第一页，setPageNo无法触发useEffect，也需要直接发请求
        if (params.id || pageNo === 1) {
          getUserInfoList();
        } else {
          setPageNo(1);
        }
      } else {
        notification.open({
          type: "error",
          message: `${params.id ? '更新' : '添加'}用户失败！`,
          description: response.data,
        });
      }
    } catch {
      console.log("表单校验失败");
    }
  }

  // 批量删除用户
  async function deleteUserBatch() {
    const response: any = await reqDeleteUserBatch(selectedRowIds);
    if (response.code === 200) {
      notification.open({
        type: "success",
        message: "批量删除用户成功！"
      });
      getUserInfoList();
      setSelectedRowIds([]);
    } else {
      notification.open({
        type: "error",
        message: "批量删除用户失败！",
        description: response.data,
      });
    }
  }

  // 删除用户
  async function deleteUser(record: UserRecord) {
    const response: any = await reqDeleteUser(record.id as number);
    if (response.code === 200) {
      notification.open({
        type: "success",
        message: "删除用户成功！"
      });
      getUserInfoList();
    } else {
      notification.open({
        type: "error",
        message: "删除用户失败！",
        description: response.data,
      });
    }
  }

  // 分配角色按钮点击事件
  function onAssignRoleClick(record: UserRecord) {
    setSelectedUser(record);
    setShowDrawer(true);
    setDrawerScene(3);
  }

  // 分配角色时，角色列表多选框改变的回调
  function onCheckedRoleChange(roleList: number[]) {
    console.log('roleList---', roleList);
    setCheckedRoleList(roleList);
  }

  // 分配角色时，角色列表全选多选框改变的回调
  function onCheckAllRoleChange(e: any) {
    if (!e.target.checked) {
      setCheckedRoleList([]);
      assignRoleForm.setFieldValue("roleList", []);
      return;
    }
    const checkedValues = allRoleOptions.map(item => item.id);
    setCheckedRoleList(checkedValues);
    assignRoleForm.setFieldValue("roleList", checkedValues);
  }

  // 获取当前账号可分配的全部角色
  async function getAllAssignableRoles(userId: number) {
    const response: RoleListResponse = await reqAllAssignableRoles(userId);
    console.log('getAllAssignableRoles response---', response);
    if (response.code === 200) {
      setAllRoleOptions(response.data.allRolesList);
      const checkedValues = response.data.assignRoles.map(item => item.id);
      setCheckedRoleList(checkedValues);
      assignRoleForm.setFieldValue("roleList", checkedValues);
    }
  }

  // 提交分配角色请求
  async function submitAssigningRole() {
    const params: AssignRoleData = {
      userId: selectedUser?.id as number,
      roleIdList: checkedRoleList,
    };
    const response: any = await reqAssignUserRoles(params);
    if (response.code === 200) {
      notification.open({
        type: "success",
        message: "分配角色成功！",
      });
      onDrawerClose();
      getUserInfoList();
    } else {
      notification.open({
        type: "error",
        message: "分配角色失败！",
        description: response.data,
      });
    }
  }

  // 编辑用户表单校验规则
  const getFormRules = (itemName: 'username' | 'password') => {
    const itemMap = {username: '用户名', password: '密码'}
    // 根据字段名改变提示内容
    return [
      {required: true, message: `${itemMap[itemName]}不能为空！`},
      {min: 4, max: 16, message: `${itemMap[itemName]}长度不少于4位，不多于16位！`},
      {pattern: /^[0-9a-zA-Z_]+$/, message: `${itemMap[itemName]}应该由字母、数字、下划线组成！`},
    ];
  }

  useEffect(() => {
    getUserInfoList();
  }, [pageNo, pageSize]);

  useEffect(() => {
    if (drawerScene === 1 || drawerScene === 2) {
      const formData = {
        username: selectedUser?.username || "",
        nickname: selectedUser?.name || "",
        password: selectedUser?.password || "",
      };
      setUserEditFormData(formData);
      // 仅当抽屉打开，内部表单挂载时，对其进行赋值
      showDrawer && userEditForm.setFieldsValue(formData);
    } else if (drawerScene === 3) {
      // 获取角色选项
      getAllAssignableRoles(selectedUser?.id as number);
      assignRoleForm.setFieldValue("username", selectedUser?.username);
    }
  }, [selectedUser, showDrawer]);

  return (
    <main className={"user-component"}>
      <Card style={{width: "100%"}}>
        <Form
          form={searchForm}
          name={"searchForm"}
          layout={"inline"}
          autoComplete={"off"}
          className={"search-form"}
          onFinish={onSearchUserByName}
        >
          <FormItem
            label={"用户名"}
            name={"usernameSearch"}
          >
            <Input placeholder={"请输入用户名"} onChange={onUsernameSearchChange}/>
          </FormItem>
          <FormItem>
            <Button type={"primary"} htmlType={"submit"}>搜索</Button>
            <Button className={"cancel-btn"} onClick={onResetSearchForm}>重置</Button>
          </FormItem>
        </Form>
      </Card>

      <Card
        title={mainCardTitle}
        style={{width: "100%", marginTop: "15px"}}
      >
        <Table
          columns={userTableColumns}
          dataSource={userInfoList}
          rowKey={"id"}
          bordered
          pagination={false}
          rowSelection={{type: "checkbox", onChange: onRowSelectionChange}}
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
        open={showDrawer}
        title={drawerTitles[drawerScene]}
        onClose={onDrawerClose}
        width={500}
      >
        {/*drawerScene为1、2，显示编辑用户表单*/}
        {
          (drawerScene === 1 || drawerScene === 2) &&
          <Form
            form={userEditForm}
            name={"userEditForm"}
            labelCol={{span: 4}}
            onFinish={submitAddOrUpdateUser}
          >
            <FormItem
              label={"用户名"}
              name={"username"}
              rules={getFormRules('username')}
            >
              <Input
                placeholder={"请填写用户名"}
                onChange={(e: any) => saveUserEditFormData("username", e.target.value)}
              />
            </FormItem>
            <FormItem
              label={"用户昵称"}
              name={"nickname"}
            >
              <Input
                placeholder={"请填写用户昵称"}
                onChange={(e: any) => saveUserEditFormData("nickname", e.target.value)}
              />
            </FormItem>
            <FormItem
              label={"密码"}
              name={"password"}
              rules={getFormRules('password')}
            >
              <Input.Password
                placeholder={"请填写用户密码"}
                onChange={(e: any) => saveUserEditFormData("password", e.target.value)}
              />
            </FormItem>
            <FormItem>
              <div className={"edit-user-btns-wrapper"}>
                <Button type={"primary"} htmlType={"submit"}>确定</Button>
                <Button className={"cancel-edit-user-btn"} onClick={onDrawerClose}>取消</Button>
              </div>
            </FormItem>
          </Form>
        }
        {/*drawerScene为3，显示分配角色表单*/}
        {
          drawerScene === 3 &&
          <Form
            form={assignRoleForm}
            name={"assignRoleForm"}
            labelCol={{span: 4}}
            onFinish={submitAssigningRole}
          >
            <FormItem
              label={"用户名"}
              name={"username"}
            >
              <Input placeholder={"待分配角色的用户名"} disabled/>
            </FormItem>
            <FormItem
              label={"角色列表"}
            >
              <div>
                <FormItem name={"roleCheckAll"}>
                  <Checkbox indeterminate={indeterminate} onChange={onCheckAllRoleChange} checked={checkAll}>
                    全选
                  </Checkbox>
                </FormItem>
                <FormItem name={"roleList"}>
                  <CheckboxGroup
                    options={
                      allRoleOptions.map(item => ({
                        label: item.roleName,
                        value: item.id
                      }))
                    }
                    onChange={onCheckedRoleChange}
                  />
                </FormItem>
              </div>
            </FormItem>
            <FormItem>
              <div className={"assign-role-btns-wrapper"}>
                <Button type={"primary"} htmlType={"submit"}>确定</Button>
                <Button className={"cancel-assign-role-btn"} onClick={onDrawerClose}>取消</Button>
              </div>
            </FormItem>
          </Form>
        }
      </Drawer>
    </main>
  );
};

export default UserManage;
