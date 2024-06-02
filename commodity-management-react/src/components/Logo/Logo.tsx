import {FC} from "react";

import "./Logo.scss";
import logoImg from "@/assets/images/mall-logo.png";
import {useAppSelector} from "@/redux/hooks.ts";

const Logo: FC = () => {
  const {siderCollapsed} = useAppSelector(state => state.setting);

  return (
    <main className={"logo-component"}>
      <img src={logoImg} alt={""}
           className={`${siderCollapsed ? 'logo-img-smaller' : 'logo-img-bigger'}`}
      />
      {!siderCollapsed && <span className={"mall-title"}>商品管理经营平台</span>}
    </main>
  );
};

export default Logo;
