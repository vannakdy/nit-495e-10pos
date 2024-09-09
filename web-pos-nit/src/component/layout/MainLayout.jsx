import React, { useEffect, useState } from "react";
import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Breadcrumb, Input, Layout, Menu, theme } from "antd";
import { Outlet, useNavigate } from "react-router-dom";
import "./MainLayout.css";
import Logo from "../../assets/INT_LOGO.png";
import ImgUser from "../../assets/user-mage.jpg";
import { IoIosNotifications } from "react-icons/io";
import { MdOutlineMarkEmailUnread } from "react-icons/md";
import {
  getProfile,
  setAcccessToken,
  setProfile,
} from "../../store/profile.store";

const { Header, Content, Footer, Sider } = Layout;

const items = [
  {
    key: "",
    label: "Dashabord",
    icon: <PieChartOutlined />,
    children: null,
  },
  {
    key: "employee",
    label: "Employe",
    icon: <PieChartOutlined />,
    children: null,
  },
  {
    key: "customer",
    label: "Customer",
    icon: <PieChartOutlined />,
    children: null,
  },
  {
    key: "product",
    label: "Product",
    icon: <PieChartOutlined />,
    children: [
      {
        key: "product/category",
        label: "Category",
        icon: <PieChartOutlined />,
        children: null,
      },
      {
        key: "product/category1",
        label: "Stock",
        icon: <PieChartOutlined />,
        children: null,
      },
      {
        key: "product/category1",
        label: "Stock1",
        icon: <PieChartOutlined />,
        children: null,
      },
    ],
  },
];

const MainLayout = () => {
  const profile = getProfile();
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const navigate = useNavigate();

  useEffect(() => {
    if (!profile) {
      navigate("/login");
    }
  }, []);

  const onClickMenu = (item) => {
    navigate(item.key);
  };
  const onLoginOut = () => {
    setProfile("");
    setAcccessToken("");
    navigate("/login");
  };

  if (!profile) {
    return null;
  }

  return (
    <Layout
      style={{
        minHeight: "100vh",
      }}
    >
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          defaultSelectedKeys={["1"]}
          mode="inline"
          items={items}
          onClick={onClickMenu}
        />
      </Sider>
      <Layout>
        <div className="admin-header">
          <div className="admin-header-g1">
            <div>
              <img className="admin-logo" src={Logo} alt="Logo" />
            </div>
            <div>
              <div className="txt-brand-name">POS-NIT</div>
              <div>Computer & Phone Shop</div>
            </div>
            <div>
              <Input.Search
                style={{ width: 180, marginLeft: 15, marginTop: 10 }}
                size="large"
                placeholder="Search"
              />
            </div>
          </div>
          <div className="admin-header-g2">
            <IoIosNotifications className="icon-notify" />
            <MdOutlineMarkEmailUnread className="icon-email" />
            <div>{profile && <button onClick={onLoginOut}>Logout</button>}</div>
            <div>
              <div className="txt-username">{profile?.name}</div>
              <div>{profile?.role_id}</div>
            </div>
            <img className="img-user" src={ImgUser} alt="Logo" />
          </div>
        </div>
        <Content
          style={{
            margin: "10px",
          }}
        >
          <div
            className="admin-body"
            style={{
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};
export default MainLayout;
