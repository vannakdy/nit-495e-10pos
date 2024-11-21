// import { useState } from "react";
// import reactLogo from "./assets/react.svg";
// import viteLogo from "/vite.svg";
// import { Button } from "antd";
// import { DeleteFilled } from "@ant-design/icons";
// import { MdDelete } from "react-icons/md";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./page/home/HomePage";
import LogingPage from "./page/auth/LogingPage";
import RegisterPage from "./page/auth/RegisterPage";

import MainLayout from "./component/layout/MainLayout";
import MainLayoutAuth from "./component/layout/MainLayoutAuth";
import EmployeePage from "./page/employee/EmployeePage";
import CustomerPage from "./page/customer/CustomerPage";
import CategoryPage from "./page/category/CategoryPage";
import UserPage from "./page/user/UserPage";
import RolePage from "./page/role/RolePage";
import SupplierPage from "./page/purchase/SupplierPage";
import ProductPage from "./page/product/ProductPage";
import ExpanseTypePage from "./page/expanse/ExpanseTypePage";
import ExpansePage from "./page/expanse/ExpansePage";
import PosPage from "./page/pos/PosPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/employee" element={<EmployeePage />} />
          <Route path="/customer" element={<CustomerPage />} />
          <Route path="/pos" element={<PosPage />} />
          <Route path="/category" element={<CategoryPage />} />
          <Route path="/product" element={<ProductPage />} />
          <Route path="/user" element={<UserPage />} />
          <Route path="/role" element={<RolePage />} />
          <Route path="/supplier" element={<SupplierPage />} />

          <Route path="/expanse_type" element={<ExpanseTypePage />} />
          <Route path="/expanse" element={<ExpansePage />} />

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
