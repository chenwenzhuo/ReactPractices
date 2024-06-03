import {FC, useEffect} from "react";
import {Outlet, useLocation, useNavigate} from "react-router-dom";
import {useAppSelector} from "@/redux/hooks.ts";
import {selectAllUserState} from "@/redux/userSlice.ts";

interface Props {
  middlePath: 'acl' | 'product';
}

// 地址栏输入 /admin/acl 和 /admin/product 路由进行访问时，需要重定向到其第一个子路由
// 将此组件作为重定向的中转站
const Index: FC<Props> = (props) => {
  const {middlePath} = props;
  const navigate = useNavigate();
  const location = useLocation();
  const {menuRoutes} = useAppSelector(selectAllUserState);

  // 计算 /admin/acl 和 /admin/product 路由的重定向地址
  const getNavigateTarget = () => {
    // 通过state参数指定了目标路径，优先重定向到此路径
    const {targetPath} = location.state || {};
    if (targetPath) {
      const pathArr = targetPath.split('/');
      return pathArr[pathArr.length - 1];
    }

    // 否则重定向到其第一个子路由
    const routeObj = menuRoutes.find(item => item.path === middlePath);
    if (!routeObj)
      return null;
    return routeObj.children[0].path;
  }

  useEffect(() => {
    const target = getNavigateTarget();
    navigate(`/admin/${middlePath}/${target}`);
  }, []);

  return (
    <Outlet/>
  );
};

export default Index;
