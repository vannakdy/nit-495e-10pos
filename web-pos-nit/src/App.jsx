// import { useState } from "react";
// import reactLogo from "./assets/react.svg";
// import viteLogo from "/vite.svg";
// import { Button } from "antd";
// import { DeleteFilled } from "@ant-design/icons";
// import { MdDelete } from "react-icons/md";
// import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./page/home/HomePage";
import LogingPage from "./page/auth/LogingPage";
import RegisterPage from "./page/auth/RegisterPage";

import MainLayout from "./component/layout/MainLayout";
import MainLayoutAuth from "./component/layout/MainLayoutAuth";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/category" element={<LogingPage />} />
          <Route path="/product" element={<RegisterPage />} />
          <Route path="*" element={<h1>404-Route Not Found!</h1>} />
        </Route>

        <Route element={<MainLayoutAuth />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LogingPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
