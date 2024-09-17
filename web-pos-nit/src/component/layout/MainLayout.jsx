import React, { useEffect, useState } from "react";
import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  SmileOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Breadcrumb, Button, Dropdown, Input, Layout, Menu, theme } from "antd";
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
import { countStore } from "../../page/home/HomePage";

const { Header, Content, Footer, Sider } = Layout;

const items = [
  {
    key: "",
    label: "Dashabord",
    children: null,
  },
  {
    key: "pos",
    label: "POS",
    children: null,
  },
  {
    key: "customer",
    label: "Customer",
    children: null,
  },
  {
    key: "order",
    label: "Order",
    children: null,
  },
  {
    key: "product",
    label: "Product",
    children: [
      {
        key: "product",
        label: "List Porduct",
        children: null,
      },
      {
        key: "category",
        label: "Category",
        children: null,
      },
    ],
  },
  {
    key: "purchase",
    label: "Purchase",
    children: [
      {
        key: "supplier",
        label: "Supplier",
        children: null,
      },
      {
        key: "purchase",
        label: "List purchase",
        children: null,
      },
      {
        key: "purchase_product",
        label: "Purchase Product",
        children: null,
      },
    ],
  },
  {
    key: "expanse",
    label: "Expanse",
    children: [
      {
        key: "expanse_type",
        label: "Expanse Type",
        children: null,
      },
      {
        key: "expanse",
        label: "Expanse",
        children: null,
      },
    ],
  },
  {
    key: "employee",
    label: "Employee",
    children: [
      {
        key: "employee",
        label: "Employee",
        children: null,
      },
      {
        key: "payroll",
        label: "Payroll",
        children: null,
      },
    ],
  },

  {
    key: "user",
    label: "User",
    children: [
      {
        key: "user",
        label: "User",
        children: null,
      },
      {
        key: "role",
        label: "Role",
        children: null,
      },
      {
        key: "role_permission",
        label: "Role Permmission",
        children: null,
      },
    ],
  },

  {
    key: "Setting",
    label: "Setting",
    children: [
      {
        key: "Currency",
        label: "Currency",
        children: null,
      },
      {
        key: "langauge",
        label: "Langauge",
        children: null,
      },
    ],
  },
];

const MainLayout = () => {
  const { count, increase, descrease } = countStore();
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

  const itemsDropdown = [
    {
      key: "1",
      label: (
        <a target="_blank" rel="noopener noreferrer" href="/">
          profile
        </a>
      ),
    },
    {
      key: "2",
      label: (
        <a target="_blank" rel="noopener noreferrer" href="/">
          chage password
        </a>
      ),
      icon: <SmileOutlined />,
      disabled: true,
    },
    {
      key: "logout",
      danger: true,
      label: "Logout",
    },
  ];

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
              <div className="txt-brand-name">Count : {count}</div>

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
            <div>
              <div className="txt-username">{profile?.name}</div>
              <div>{profile?.role_name}</div>
            </div>
            <Dropdown
              menu={{
                items: itemsDropdown,
                onClick: (event) => {
                  if (event.key == "logout") {
                    onLoginOut();
                  }
                },
              }}
            >
              <img className="img-user" src={ImgUser} alt="Logo" />
            </Dropdown>
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
