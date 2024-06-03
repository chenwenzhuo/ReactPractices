import {FC, useEffect} from "react";
import {Navigate, useLocation, useNavigate} from "react-router-dom";
import {notification} from "antd";
import {useAppDispatch, useAppSelector} from "@/redux/hooks.ts";
import {doLogout, fetchUserInfo, selectAllUserState} from "@/redux/userSlice.ts";
import IntrinsicAttributes = React.JSX.IntrinsicAttributes;

interface AuthGuardProps {
  children: IntrinsicAttributes
}

const AuthGuard: FC<AuthGuardProps> = (props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const {token, menuRoutes} = useAppSelector(selectAllUserState);
  const targetPath = location.pathname;

  // 未登录，但尝试访问应用内页面时，给出提示
  useEffect(() => {
    if (!token && targetPath !== '/login') {
      notification.error({
        message: '您还未登录！',
        description: '登录后将自动跳转到所需页面。',
      });
    }
  }, []);

  // 获取用户信息，失败时退出登录
  useEffect(() => {
    if (!token) {
      return;
    }
    dispatch(fetchUserInfo()).catch(async () => {
      await dispatch(doLogout());
      navigate('/login', {
        state: {targetPath},
      });
      notification.error({
        message: '登录失效',
        description: '请重新登录。',
      });
    });
  });

  // 根据当前路由，修改页面标题
  useEffect(() => {
    const prefix = '商品管理';
    if (targetPath === '/login') {
      document.title = `${prefix}-登录`;
      return;
    }
    let searchArr = menuRoutes;
    const pathArr = targetPath.split('admin')[1]
      .split('/').slice(1);
    const nameArr = pathArr.map(path => {
      const menuObj = searchArr.find(item => item.path === path);
      searchArr = menuObj.children;
      return menuObj.name;
    });
    document.title = `${prefix}-${nameArr.join('-')}`;
  });

  // 已登录，则Redux中有用户token
  if (token) {
    // 已登录不能访问/login，重定向到首页
    if (targetPath === '/login') {
      return <Navigate to={"/admin/home"}/>;
    }
    // 其他路由可以访问
    return <>{props.children}</>;
  }

  // 未登录，只能访问/login
  if (targetPath === '/login') {
    return <>{props.children}</>;
  }
  // 若想要访问其他路由，将其记录在state参数中，登录后直接跳转
  return (
    <Navigate
      to={"/login"}
      state={{targetPath}}
    />
  );
};

export default AuthGuard;
