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
    // 通过state参数指定了目标路径，且不是以上两个路径，优先重定向到此路径
    const {targetPath} = location.state || {};
    if (targetPath && !['/admin/acl', '/admin/product'].includes(targetPath)) {
      const pathArr = targetPath.split('/');
      return pathArr[pathArr.length - 1];
    }

    // 指定了 /admin/acl 和 /admin/product 的子路由，则直接访问子路由
    let arr = location.pathname.split('/admin/acl');
    if (location.pathname.startsWith('/admin/acl') && arr[arr.length - 1] !== '') {
      return arr[arr.length - 1].substring(1); // 从下标 1 开始取子串，去掉多余的斜杠 /
    }
    arr = location.pathname.split('/admin/product');
    if (location.pathname.startsWith('/admin/product') && arr[arr.length - 1] !== '') {
      return arr[arr.length - 1].substring(1); // 从下标 1 开始取子串，去掉多余的斜杠 /
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
