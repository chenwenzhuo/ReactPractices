import {FC, useEffect, useState} from "react";
import {Outlet, useLocation, useNavigate} from "react-router-dom";
import {Layout} from 'antd';

import './AppLayout.scss';
import {useAppDispatch, useAppSelector} from "@/redux/hooks.ts";
import {selectAllSettingState, toggleRefresh} from "@/redux/settingSlice.ts";
import Logo from "@/components/Logo/Logo.tsx";
import SiderMenu from "@/components/SiderMenu/SiderMenu.tsx";
import TopBar from "@/components/TopBar/TopBar.tsx";
import {flushSync} from "react-dom";

const {Header, Footer, Sider, Content} = Layout;

const AppLayout: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const {siderCollapsed, refresh} = useAppSelector(selectAllSettingState);
  const [mainContentFlag, setMainContentFlag] = useState<boolean>(true);

  useEffect(() => {
    // 当用户在地址栏直接输入 /admin 路径时，重定向到首页
    if (location.pathname === '/admin') {
      navigate('/admin/home');
    }
  }, []);

  // 监听Redux中refresh标记的值变化
  useEffect(() => {
    // 使用flushSync强制同步更新DOM，在DOM更新完成后，将refresh标记的值改回去
    // flushSync不能在useEffect钩子中调用，使用Promise.resolve().then()将其加入微队列中执行
    Promise.resolve().then(() => {
      flushSync(() => setMainContentFlag(!refresh));
      if (refresh) {
        dispatch(toggleRefresh());
      }
    });
  }, [refresh]);

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
          {mainContentFlag && <Outlet/>}
        </Content>
        <Footer className={"home-footer"}>Footer</Footer>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
