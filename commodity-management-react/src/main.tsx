import React from 'react'
import ReactDOM from 'react-dom/client'
import {RouterProvider} from "react-router-dom";
import {Provider} from "react-redux";
import {ConfigProvider} from 'antd'; // 引入ConfigProvider全局化配置
import zhCN from 'antd/es/locale/zh_CN';  // 引入中文包

import '@/styles/index.scss'
import router from "@/routes/routeTable.tsx";
import store from "@/redux/store.ts";

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <ConfigProvider locale={zhCN}>
        <RouterProvider router={router}/>
      </ConfigProvider>
    </Provider>
  </React.StrictMode>,
)
