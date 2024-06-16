import {FC} from "react";
import {useAppSelector} from "@/redux/hooks.ts";
import {selectAllUserState} from "@/redux/userSlice.ts";
import {Card} from "antd";
import {getTime} from "@/utils/time.ts";
import welcomeImg from "@/assets/icons/welcome.svg";
import './Home.scss';

const Home: FC = () => {
  const {username, avatar} = useAppSelector(selectAllUserState);

  return (
    <main className={"home-component"}>
      <Card style={{width: "100%"}}>
        <div className={"card-content"}>
          <img src={avatar} alt={""}/>
          <div className={"text"}>
            <p className={"greeting"}>{username}，{getTime()}好!</p>
            <p className={"platform"}>商品管理经营平台</p>
          </div>
        </div>
      </Card>
      <div className={"welcome-img-wrapper"}>
        <img src={welcomeImg} alt={""}/>
      </div>
    </main>
  );
};

export default Home;
