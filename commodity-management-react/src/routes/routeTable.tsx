import {createBrowserRouter} from "react-router-dom";
import App from "@/App.tsx";
import Login from "@/pages/login/Login.tsx";
import AppLayout from "@/pages/layout/AppLayout.tsx";
import NotFound from "@/pages/404/NotFound.tsx";
import Index from "@/pages/index-route/Index.tsx";

const router = createBrowserRouter([
  {
    path: '/',
    element: <App/>,
    children: [
      {index: true, element: <Index/>}, // 索引路由
      {
        path: 'login',
        element: <Login/>,
      },
      {
        path: 'admin',
        element: <AppLayout/>,
      },
    ]
  },
  {
    path: '*',
    element: <NotFound/>
  }
] as any[]);

export default router;
