import {FC} from "react";

import "./Logo.scss";
import logoImg from "@/assets/images/mall-logo.png";

const Logo: FC = () => {
  return (
    <main className={"logo-component"}>
      <img src={logoImg} alt={""}
           className={"logo-img"}
      />
      <span className={"mall-title"}>商品管理经营平台</span>
    </main>
  );
};

export default Logo;
