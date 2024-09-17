import React, { useEffect, useState } from "react";
import { request } from "../../util/helper";
import { Button, Input, Space, Table, Tag } from "antd";
function UserPage() {
  const [state, setState] = useState({
    list: [],
    loading: false,
  });
  useEffect(() => {
    getList();
  }, []);

  const getList = async () => {
    const res = await request("auth/get-list", "get");
    if (res && !res.error) {
      setState({
        ...state,
        list: res.list,
      });
    }
  };

  const clickBtnEdit = () => {};
  const clickBtnDelete = () => {};

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          paddingBottom: 10,
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <div>User</div>
          <Input.Search style={{ marginLeft: 10 }} placeholder="Search" />
        </div>
        <Button type="primary">New</Button>
      </div>

      <Table
        dataSource={state.list}
        columns={[
          {
            key: "no",
            title: "No",
            render: (value, data, index) => index + 1,
          },
          {
            key: "name",
            title: "Name",
            dataIndex: "name",
          },
          {
            key: "username",
            title: "Username",
            dataIndex: "username",
          },
          {
            key: "role_name",
            title: "Role Name",
            dataIndex: "role_name",
          },
          {
            key: "is_active",
            title: "Status",
            dataIndex: "is_active",
            render: (value) =>
              value ? (
                <Tag color="green">Active</Tag>
              ) : (
                <Tag color="red">In Active</Tag>
              ),
          },
          {
            key: "action",
            title: "Action",
            align: "center",
            render: (value, data) => (
              <Space>
                <Button onClick={() => clickBtnEdit(data)} type="primary">
                  Edit
                </Button>
                <Button
                  onClick={() => clickBtnDelete(data)}
                  danger
                  type="primary"
                >
                  Delete
                </Button>
              </Space>
            ),
          },
        ]}
      />
    </div>
  );
}

export default UserPage;
