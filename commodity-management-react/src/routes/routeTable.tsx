import {createBrowserRouter} from "react-router-dom";
import App from "@/App.tsx";
import Login from "@/pages/login/Login.tsx";
import Home from "@/pages/home/Home.tsx";
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
        path: 'home',
        element: <Home/>,
      },
    ]
  },
  {
    path: '*',
    element: <NotFound/>
  }
]);

export default router;
