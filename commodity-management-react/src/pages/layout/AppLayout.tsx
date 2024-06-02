import {FC, useEffect} from "react";
import {Outlet, useLocation, useNavigate} from "react-router-dom";
import {Layout} from 'antd';

import './AppLayout.scss';
import Logo from "@/components/Logo/Logo.tsx";
import {SiderMenu} from "@/components/SiderMenu/SiderMenu.tsx";

const {Header, Footer, Sider, Content} = Layout;

const AppLayout: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // 当用户在地址栏直接输入 /admin 路径时，重定向到首页
    if (location.pathname === '/admin') {
      navigate('/admin/home');
    }
  }, []);

  return (
    <Layout className={"home-component"}>
      <Sider width={"360px"} className={"home-sider"}>
        <div className="logo-container">
          <Logo/>
        </div>
        <div className="menu-container">
          <SiderMenu/>
        </div>
      </Sider>
      <Layout>
        <Header className={"home-header"}>Header</Header>
        <Content className={"home-content"}>
          <Outlet/>
        </Content>
        <Footer className={"home-footer"}>Footer</Footer>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
