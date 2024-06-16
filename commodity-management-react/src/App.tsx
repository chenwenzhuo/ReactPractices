import {FC} from "react";
import {Outlet} from "react-router-dom";
import {ConfigProvider, theme} from 'antd';
import {useAppSelector} from "@/redux/hooks.ts";
import {selectAllSettingState} from "@/redux/settingSlice.ts";

const App: FC = () => {
  const {themeColor, darkMode} = useAppSelector(selectAllSettingState);

  return (
    <>
      <ConfigProvider
        theme={{
          token: {colorPrimary: themeColor},
          algorithm: darkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
        }}
      >
        <Outlet/>
      </ConfigProvider>
    </>
  )
}

export default App
