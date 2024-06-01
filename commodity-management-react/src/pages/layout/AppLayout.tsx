import {FC} from "react";
import {Layout} from 'antd';

import './AppLayout.scss';
import Logo from "@/components/Logo/Logo.tsx";
import {SiderMenu} from "@/components/SiderMenu/SiderMenu.tsx";
import {Outlet} from "react-router-dom";

const {Header, Footer, Sider, Content} = Layout;

const AppLayout: FC = () => {
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
