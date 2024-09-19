import { useEffect, useState } from "react";
import { request } from "../../util/helper";
import { Button, Form, Input, message, Modal, Space, Table, Tag } from "antd";
function RolePage() {
  const [state, setState] = useState({
    list: [],
    loading: false,
    visible: false,
  });
  const [form] = Form.useForm();

  useEffect(() => {
    getList();
  }, []);

  const getList = async () => {
    const res = await request("role", "get");
    if (res && !res.error) {
      setState((pre) => ({
        ...pre,
        list: res.list,
      }));
    }
  };

  const clickBtnEdit = (item) => {
    form.setFieldsValue({
      ...item,
      // id : item.id,
      // code : item.code,
      // name : item.name,
    });
    handleOpenModal();
  };
  const clickBtnDelete = (item) => {
    Modal.confirm({
      title: "Delete",
      content: "Are you sure to remove?",
      onOk: async () => {
        const res = await request("role", "delete", {
          id: item.id,
        });
        if (res && !res.error) {
          message.success(res.message);
          const newList = state.list.filter((item1) => item1.id != item.id);
          setState((pre) => ({
            ...pre,
            list: newList,
          }));
        }
      },
    });
  };

  const onFinish = async (item) => {
    var data = {
      id: form.getFieldValue("id"),
      code: item.code,
      name: item.name,
    };
    var method = "post";
    if (form.getFieldValue("id")) {
      method = "put";
    }
    const res = await request("role", method, data);
    if (res && !res.error) {
      message.success(res.message);
      getList();
      handleCloseModal();
    } else {
      message.warning(res.error);
    }
  };

  const handleOpenModal = () => {
    setState((pre) => ({
      ...pre,
      visible: true,
    }));
  };

  const handleCloseModal = () => {
    setState((pre) => ({
      ...pre,
      visible: false,
    }));
    form.resetFields();
  };

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
          <div>Role</div>
          <Input.Search style={{ marginLeft: 10 }} placeholder="Search" />
        </div>
        <Button type="primary" onClick={handleOpenModal}>
          New
        </Button>
      </div>
      <Modal
        title={form.getFieldValue("id") ? "Update" : "New Role"}
        open={state.visible}
        onCancel={handleCloseModal}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item name="name" label="Role Name">
            <Input placeholder="Role Name" />
          </Form.Item>
          <Form.Item name="code" label="Role Code">
            <Input placeholder="Role Code" />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button onClick={handleCloseModal}>Cancel</Button>
              <Button type="primary" htmlType="submit">
                {form.getFieldValue("id") ? "Update" : "Save"}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

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
            key: "code",
            title: "Code",
            dataIndex: "code",
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

export default RolePage;
