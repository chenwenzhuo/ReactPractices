import {FC, useEffect} from "react";
import {Outlet, useLocation, useNavigate} from "react-router-dom";
import {Layout} from 'antd';

import './AppLayout.scss';
import {useAppSelector} from "@/redux/hooks.ts";
import {selectAllSettingState} from "@/redux/settingSlice.ts";
import Logo from "@/components/Logo/Logo.tsx";
import SiderMenu from "@/components/SiderMenu/SiderMenu.tsx";
import TopBar from "@/components/TopBar/TopBar.tsx";

const {Header, Footer, Sider, Content} = Layout;

const AppLayout: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {siderCollapsed} = useAppSelector(selectAllSettingState);

  useEffect(() => {
    // 当用户在地址栏直接输入 /admin 路径时，重定向到首页
    if (location.pathname === '/admin') {
      navigate('/admin/home');
    }
  }, []);

  return (
    <Layout className={"home-component"}>
      <Sider
        width={"360px"}
        className={"home-sider"}
        collapsed={siderCollapsed}
      >
        <div className="logo-container">
          <Logo/>
        </div>
        <div className="menu-container">
          <SiderMenu/>
        </div>
      </Sider>
      <Layout>
        <Header className={"home-header"}>
          <TopBar/>
        </Header>
        <Content className={"home-content"}>
          <Outlet/>
        </Content>
        <Footer className={"home-footer"}>Footer</Footer>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
