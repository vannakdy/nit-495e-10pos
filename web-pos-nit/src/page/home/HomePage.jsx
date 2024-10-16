import { useEffect, useState } from "react";
import { request } from "../../util/helper";
import HomeGrid from "../../component/home/HomeGrid";
import HomeSaleChart from "../../component/home/HomeSaleChart";
import HomePurchaseChart from "../../component/home/HomePurchaseChart";
import { Button } from "antd";
import { configStore } from "../../store/configStore";

function HomePage() {
  const { config } = configStore();
  const [home, setHome] = useState([]);

  useEffect(() => {
    getList();
    console.log(config);
  }, []);

  const getList = async () => {
    const res = await request("home", "get");
    if (res) {
      setHome(res.list);
    }
  };

  return (
    <div>
      {config?.category &&
        config.category?.map((item, index) => (
          <div key={index}>{item.name}</div>
        ))}
      <HomeGrid data={home} />
      <HomeSaleChart />
      <HomePurchaseChart />
    </div>
  );
}

export default HomePage;
