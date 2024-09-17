import { useEffect, useState } from "react";
import { request } from "../../util/helper";
import HomeGrid from "../../component/home/HomeGrid";
import HomeSaleChart from "../../component/home/HomeSaleChart";
import HomePurchaseChart from "../../component/home/HomePurchaseChart";
import { create } from "zustand";
import { Button } from "antd";

export const countStore = create((set) => ({
  count: 1,
  profile: {},
  list: [],
  loading: true,
  increase: () => set((state) => ({ count: state.count + 1 })),
  descrease: () =>
    set((state) => ({
      count: state.count - 1,
    })),
}));

function HomePage() {
  const { count, increase, descrease } = countStore();
  const [home, setHome] = useState([]);

  useEffect(() => {
    getList();
  }, []);

  const getList = async () => {
    const res = await request("home", "get");
    if (res) {
      setHome(res.list);
    }
  };

  return (
    <div>
      <h1>{count}</h1>
      <Button onClick={() => increase()}>+</Button>
      <Button onClick={() => descrease()}>-</Button>
      <HomeGrid data={home} />
      <HomeSaleChart />
      <HomePurchaseChart />
    </div>
  );
}

export default HomePage;
