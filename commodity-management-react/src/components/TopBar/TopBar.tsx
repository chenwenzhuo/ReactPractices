import {FC} from "react";
import {useLocation} from "react-router-dom";
import {Breadcrumb, Button, Dropdown} from "antd";
import {
  DownOutlined,
  ExpandOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SettingOutlined,
  SyncOutlined,
} from '@ant-design/icons';

import './TopBar.scss';
import avatar from '@/assets/react.svg';
import {RoutesMapType} from "@/api/types.ts";
import {useAppDispatch, useAppSelector} from "@/redux/hooks.ts";
import {selectAllUserState} from "@/redux/userSlice.ts";
import {toggleSiderCollapsed} from "@/redux/settingSlice.ts";
import {menuIconMap} from "@/components/SiderMenu/SiderMenu.tsx";

const TopBar: FC = () => {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const {menuRoutes} = useAppSelector(selectAllUserState);
  const {siderCollapsed} = useAppSelector(state => state.setting);

  // 根据路径，得到各级菜单的路由名称
  const menuPaths = location.pathname.split('admin')[1]
    .split('/').slice(1);
  // 根据菜单路由名称，生成面包屑组件配置对象数组
  let searchArr = menuRoutes;
  const breadcrumbItems = menuPaths.map(menu => {
    const menuObj = searchArr.find(item => item.path === menu);
    const result = {
      title: (
        <>
          {menuIconMap[menu as keyof RoutesMapType]}
          <span>{menuObj.name}</span>
        </>
      )
    };
    searchArr = menuObj.children;
    return result;
  });

  // 用户名下拉菜单配置项
  const dropDownItems = [{
    key: 'logOut',
    label: (
      <Button type={"text"}>退出登录</Button>
    )
  }];

  const toggleCollapsed = () => {
    dispatch(toggleSiderCollapsed());
  };

  return (
    <main className={"top-bar-component"}>
      <section className="top-bar-left">
        <Button
          className={"toggle-btn"}
          onClick={toggleCollapsed}
          size={"small"}
        >
          {siderCollapsed ? <MenuUnfoldOutlined/> : <MenuFoldOutlined/>}
        </Button>
        <Breadcrumb separator=">" items={breadcrumbItems}/>
      </section>
      <section className="top-bar-right">
        <Button className={"opt-btn"} shape="circle" icon={<SyncOutlined/>}/>
        <Button className={"opt-btn"} shape="circle" icon={<ExpandOutlined/>}/>
        <Button className={"opt-btn"} shape="circle" icon={<SettingOutlined/>}/>
        <img src={avatar} alt=""/>
        <Dropdown
          menu={{items: dropDownItems}}
          placement={"bottom"}
          arrow={{pointAtCenter: true}}
        >
          <span>
            <span className={"dropdown-uname"}>admin</span>
            <DownOutlined/>
          </span>
        </Dropdown>
      </section>
    </main>
  );
};

export default TopBar;
