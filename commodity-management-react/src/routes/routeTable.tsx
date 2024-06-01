import {createBrowserRouter, Navigate} from "react-router-dom";
import store from "@/redux/store.ts";
import App from "@/App.tsx";
import Login from "@/pages/login/Login.tsx";
import AppLayout from "@/pages/layout/AppLayout.tsx";
import NotFound from "@/pages/404/NotFound.tsx";
import Home from "@/pages/home/Home.tsx";

import {routesMapType} from "@/api/types.ts";

const routesMap: routesMapType = {
  home: {path: 'home', element: <Home/>},
  acl: {path: 'acl', element: <Home/>},
  product: {path: 'product', element: <Home/>},
  user: {path: 'user', element: <Home/>},
  role: {path: 'role', element: <Home/>},
  permission: {path: 'permission', element: <Home/>},
  trademark: {path: 'trademark', element: <Home/>},
  attr: {path: 'attr', element: <Home/>},
  spu: {path: 'spu', element: <Home/>},
  sku: {path: 'sku', element: <Home/>},
};
const userState = store.getState().user; // 获得 redux store 中的数据

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
          const result = routesMap[route.path as keyof routesMapType];
          if (route.children) {
            result.children = route.children.map(
              (child: any) => routesMap[child.path as keyof routesMapType]
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
