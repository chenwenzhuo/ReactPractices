import {FC, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {Breadcrumb, Button, Dropdown} from "antd";
import {
  CompressOutlined,
  DownOutlined,
  ExpandOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SettingOutlined,
  SyncOutlined,
} from '@ant-design/icons';

import './TopBar.scss';
import {RoutesMapType} from "@/api/types.ts";
import {useAppDispatch, useAppSelector} from "@/redux/hooks.ts";
import {clearDataOnLogout, selectAllUserState} from "@/redux/userSlice.ts";
import {selectAllSettingState, toggleSiderCollapsed, toggleRefresh} from "@/redux/settingSlice.ts";
import {menuIconMap} from "@/components/SiderMenu/SiderMenu.tsx";

const TopBar: FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const {username, avatar, menuRoutes} = useAppSelector(selectAllUserState);
  const {siderCollapsed} = useAppSelector(selectAllSettingState);
  const [fullscreen, setFullscreen] = useState<boolean>(false);

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

  const toggleCollapsed = () => {
    dispatch(toggleSiderCollapsed());
  };

  const onRefreshClick = () => {
    dispatch(toggleRefresh());
  }

  const onFullScreenClick = () => {
    // DOM对象的一个属性，获取当前全屏显示的DOM元素，可用于判断当前是否全屏模式
    const fullElem = document.fullscreenElement;
    if (!fullElem) {
      // 文档根节点的 requestFullscreen 方法，开启全屏模式
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen(); // 退出全屏
    }
    setFullscreen(!fullElem);
  };

  const onLogoutClick = () => {
    dispatch(clearDataOnLogout()); // 清除Redux中存储的数据
    navigate('/login', {
      state: {targetPath: location.pathname}
    });
  }

  // 用户名下拉菜单配置项
  const dropDownItems = [{
    key: 'logOut',
    label: (
      <Button type={"text"} onClick={onLogoutClick}>退出登录</Button>
    )
  }];

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
        <Button className={"opt-btn"} shape="circle" icon={<SyncOutlined/>}
                onClick={onRefreshClick}/>
        <Button className={"opt-btn"} shape="circle"
                icon={fullscreen ? <CompressOutlined/> : <ExpandOutlined/>}
                onClick={onFullScreenClick}/>
        <Button className={"opt-btn"} shape="circle" icon={<SettingOutlined/>}/>
        <img src={avatar} alt=""/>
        <Dropdown
          menu={{items: dropDownItems}}
          placement={"bottom"}
          arrow={{pointAtCenter: true}}
        >
          <span>
            <span className={"dropdown-uname"}>
              {username}
            </span>
            <DownOutlined/>
          </span>
        </Dropdown>
      </section>
    </main>
  );
};

export default TopBar;
