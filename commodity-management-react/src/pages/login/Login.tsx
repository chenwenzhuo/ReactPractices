import {FC, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {Col, Row, Button, Form, Input, notification} from 'antd';
import {UserOutlined, LockOutlined} from '@ant-design/icons';

import './Login.scss';
import {LoginForm} from "@/api/user/types.ts";
import {doLogin} from "@/redux/userSlice.ts";
import {useAppDispatch} from "@/redux/hooks.ts";
import {getTime} from "@/utils/time.ts";

const FormItem = Form.Item;
const initialFormValues = {
  username: 'admin',
  password: '111111',
}

const Login: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();

  // 登录按钮的加载状态
  const [loginLoading, setLoginLoading] = useState<boolean>(false);

  // 表单校验规则
  const getFormRules = (itemName: 'username' | 'password') => {
    const itemMap = {username: '账号', password: '密码'}
    // 根据字段名改变提示内容
    return [
      {required: true, message: `${itemMap[itemName]}不能为空！`},
      {min: 4, max: 16, message: `${itemMap[itemName]}长度不少于4位，不多于16位！`},
      {pattern: /^[0-9a-zA-Z_]+$/, message: `${itemMap[itemName]}应该由字母、数字、下划线组成！`},
    ];
  }

  const onLogin = async (formValues: LoginForm) => {
    setLoginLoading(true);
    try {
      await dispatch(doLogin(formValues));
      const {targetPath} = location.state || {};
      if (targetPath) {
        navigate(targetPath, {
          state: {targetPath}
        });
      } else {
        navigate('/admin');
      }

      const time: string = getTime();
      notification.success({
        message: `Hi，${time}好！`,
        description: '欢迎回来',
      });
    } catch (error: any) {
      notification.error({message: error.message});
    } finally {
      setLoginLoading(false);
    }
  }

  return (
    <main className={"login-component"}>
      <Row>
        {/* 响应式布局 */}
        <Col xs={0} sm={0} md={4} lg={8} xl={12}
             className={"placeholder-col"}
        ></Col>
        <Col xs={24} sm={24} md={20} lg={16} xl={12}
             className={"form-col"}
        >
          <div className={"form-area"}>
            <div className={"form-title"}>欢迎来到商品管理经营平台</div>
            <Form
              initialValues={initialFormValues}
              onFinish={onLogin}
              className={"form-body"}
            >
              <FormItem<LoginForm>
                name={"username"}
                rules={getFormRules('username')}
                validateDebounce={1000}
              >
                <Input
                  placeholder={"请输入账号"}
                  prefix={<UserOutlined/>}
                />
              </FormItem>
              <FormItem<LoginForm>
                name={"password"}
                rules={getFormRules('password')}
                validateDebounce={1000}
              >
                <Input.Password
                  placeholder={"请输入密码"}
                  prefix={<LockOutlined/>}
                />
              </FormItem>
              <FormItem>
                <Button type={"primary"}
                        htmlType={"submit"}
                        loading={loginLoading}
                        className={"login-btn"}>
                  登录
                </Button>
              </FormItem>
            </Form>
          </div>
        </Col>
      </Row>
    </main>
  );
};

export default Login;
