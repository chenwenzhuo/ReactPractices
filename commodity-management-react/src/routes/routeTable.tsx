import {createBrowserRouter, Navigate} from "react-router-dom";
import store from "@/redux/store.ts";
import App from "@/App.tsx";
import Login from "@/pages/login/Login.tsx";
import AppLayout from "@/pages/layout/AppLayout.tsx";
import NotFound from "@/pages/404/NotFound.tsx";
import Home from "@/pages/home/Home.tsx";
import UserManage from "@/pages/acl/user/UserManage.tsx";
import RoleManage from "@/pages/acl/role/RoleManage.tsx";
import PermissionManage from "@/pages/acl/permission/PermissionManage.tsx";
import TrademarkManage from "@/pages/product/trademark/TrademarkManage.tsx";
import AttrManage from "@/pages/product/attr/AttrManage.tsx";
import SpuManage from "@/pages/product/spu/SpuManage.tsx";
import SkuManage from "@/pages/product/sku/SkuManage.tsx";

import {RoutesMapType} from "@/api/types.ts";

const userState = store.getState().user; // 获得 redux store 中的数据

// 计算 /admin/acl 和 /admin/product 路由的重定向地址
// 若用户有权限访问这两个路由，则重定向到其第一个子路由
const getNavigateTarget = (path: 'acl' | 'product') => {
  const {menuRoutes} = userState;
  const routeObj = menuRoutes.find(item => item.path === path);
  if (!routeObj)
    return null;
  return routeObj.children[0].path;
}

const routesMap: RoutesMapType = {
  home: {path: 'home', element: <Home/>},
  acl: {path: 'acl', element: <Navigate to={`/admin/acl/${getNavigateTarget('acl')}`}/>},
  product: {path: 'product', element: <Navigate to={`/admin/product/${getNavigateTarget('product')}`}/>},
  user: {path: 'user', element: <UserManage/>},
  role: {path: 'role', element: <RoleManage/>},
  permission: {path: 'permission', element: <PermissionManage/>},
  trademark: {path: 'trademark', element: <TrademarkManage/>},
  attr: {path: 'attr', element: <AttrManage/>},
  spu: {path: 'spu', element: <SpuManage/>},
  sku: {path: 'sku', element: <SkuManage/>},
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <App/>,
    children: [
      {index: true, element: <Navigate to={"/login"}/>}, // 索引路由
      {
        path: 'login',
        element: <Login/>,
      },
      {
        path: 'admin',
        element: <AppLayout/>,
        // typescript中使用变量作为索引来访问未知类型，例如泛型对象成员时，会报错TS7053
        // 所以为 routesMap 显式指定了类型，并将 route.path 断言为 routesMapType 的键
        children: userState.menuRoutes.map(route => {
          const result = routesMap[route.path as keyof RoutesMapType];
          if (route.children) {
            result.children = route.children.map(
              (child: any) => routesMap[child.path as keyof RoutesMapType]
            );
          }
          return result;
        }),
      },
    ]
  },
  {
    path: '*',
    element: <NotFound/>
  }
]);

export default router;
