import {FC} from "react";
import {Menu} from 'antd';
import {
  GoldOutlined,
  HomeOutlined,
  KeyOutlined,
  ShopOutlined,
  ShoppingCartOutlined,
  ShoppingOutlined,
  TagsOutlined,
  TeamOutlined,
  ToolOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {useAppSelector} from "@/redux/hooks.ts";
import {nanoid} from "@reduxjs/toolkit";
import {routesMapType} from "@/api/types.ts";

const iconMap = {
  home: <HomeOutlined/>,
  acl: <KeyOutlined/>,
  user: <UserOutlined/>,
  role: <TeamOutlined/>,
  permission: <ToolOutlined/>,
  product: <GoldOutlined/>,
  trademark: <ShopOutlined/>,
  attr: <TagsOutlined/>,
  spu: <ShoppingCartOutlined/>,
  sku: <ShoppingOutlined/>
};

export const SiderMenu: FC = () => {
  const {menuRoutes} = useAppSelector(state => state.user);

  // 根据用户具有权限的路由，动态生成菜单项
  const menuRoutesToItems = (routesArr: any[]) => {
    return routesArr.map(routeItem => {
      const result = {
        key: nanoid(),
        icon: iconMap[routeItem.path as keyof routesMapType],
        label: routeItem.name,
      } as any;
      if (routeItem.children) {
        result.children = menuRoutesToItems(routeItem.children);
      }
      return result;
    });
  }
  const menuItems = menuRoutesToItems(menuRoutes);

  return (
    <main className={"sider-menu-component"}>
      <Menu
        defaultSelectedKeys={[menuItems[0].key]}
        mode="inline"
        theme="dark"
        items={menuItems}
      />
    </main>
  );
};
