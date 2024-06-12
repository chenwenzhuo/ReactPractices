import {FC} from "react";

import "./Logo.scss";
import logoImg from "@/assets/images/mall-logo.png";
import {useAppSelector} from "@/redux/hooks.ts";
import {selectAllSettingState} from "@/redux/settingSlice.ts";

const Logo: FC = () => {
  const {siderCollapsed} = useAppSelector(selectAllSettingState);

  return (
    <main className={"logo-component"}>
      <img src={logoImg} alt={""}
           className={`${siderCollapsed ? 'logo-img-smaller' : 'logo-img-bigger'}`}
      />
      {!siderCollapsed && <div className={"mall-title"}>商品管理经营平台</div>}
    </main>
  );
};

export default Logo;
