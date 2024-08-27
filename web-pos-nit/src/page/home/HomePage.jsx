import React, { useEffect, useState } from "react";
import { request } from "../../util/helper";
import HomeGrid from "../../component/home/HomeGrid";

function HomePage() {
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
      <HomeGrid data={home} />
    </div>
  );
}

export default HomePage;
