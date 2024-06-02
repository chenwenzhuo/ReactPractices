import {FC, useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
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
import {RoutesMapType} from "@/api/types.ts";

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

const keyMap = new Map();// 记录下路由路径与随机key的映射

export const SiderMenu: FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {menuRoutes} = useAppSelector(state => state.user);

  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [selectedMenuKeys, setSelectedMenuKeys] = useState<string[]>([]); // 选中的菜单项的key
  const [openedMenuKeys, setOpenedMenuKeys] = useState<string[]>([]); // 展开的子菜单的key

  // 根据用户具有权限的路由，动态生成菜单项
  const menuRoutesToItems = (routesArr: any[]) => {
    return routesArr.map(routeItem => {
      const key = nanoid();
      keyMap.set(routeItem.path, key);
      const result = {
        key,
        path: routeItem.path,
        icon: iconMap[routeItem.path as keyof RoutesMapType],
        label: routeItem.name,
      } as any;
      if (routeItem.children) {
        result.children = menuRoutesToItems(routeItem.children);
      }
      return result;
    });
  }

  // 根据当前路由路径，计算菜单的选中项和展开项
  const getMenuItemKeys = () => {
    const pathArr = location.pathname.split('/');
    const selectedPath = pathArr[pathArr.length - 1];

    let selectedKey = keyMap.get(selectedPath), openedKey = '';
    if (['user', 'role', 'permission'].includes(selectedPath))
      openedKey = keyMap.get('acl');
    else if (['trademark', 'attr', 'spu', 'sku'].includes(selectedPath))
      openedKey = keyMap.get('product');
    return [selectedKey, openedKey];
  }

  // 菜单点击事件处理
  const onMenuClick = ({keyPath}: { keyPath: string[] }) => {
    let targetPath = '/admin';
    let searchArr = menuItems;
    let pathArr: string[] = [];
    for (let i = keyPath.length - 1; i >= 0; i--) {
      let k = keyPath[i];
      const menuObj = searchArr.find(item => item.key === k);
      searchArr = menuObj.children;
      targetPath = `${targetPath}/${menuObj.path}`;
      pathArr.push(menuObj.path);
    }
    navigate(targetPath);

    if (pathArr.length === 1) {
      setSelectedMenuKeys([keyMap.get(pathArr[0])]);
      setOpenedMenuKeys([]);
    } else {
      setSelectedMenuKeys([keyMap.get(pathArr[1])]);
      setOpenedMenuKeys([keyMap.get(pathArr[0])]);
    }
  }

  // 子菜单展开/关闭处理
  const onSubmenuOpenChange = (paths: string[]) => {
    setOpenedMenuKeys([paths[paths.length - 1]]);
  }

  // 组件加载完成，生成菜单项
  useEffect(() => {
    setMenuItems(menuRoutesToItems(menuRoutes));
  }, []);

  // 菜单项生成后，计算选中和展开的项
  useEffect(() => {
    const [selected, opened] = getMenuItemKeys();
    setSelectedMenuKeys([selected]);
    setOpenedMenuKeys(opened ? [opened] : []);
  }, [menuItems]);

  return (
    <main className={"sider-menu-component"}>
      <Menu
        selectedKeys={selectedMenuKeys}
        openKeys={openedMenuKeys}
        mode="inline"
        theme="dark"
        items={menuItems}
        onClick={onMenuClick}
        onOpenChange={onSubmenuOpenChange}
      />
    </main>
  );
};
