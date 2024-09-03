import React, { useEffect, useState } from "react";
import {
  Button,
  Form,
  Input,
  message,
  Modal,
  Select,
  Space,
  Table,
  Tag,
} from "antd";
import { request } from "../../util/helper";
import { MdAdd, MdDelete, MdEdit } from "react-icons/md";
function CategoryPage() {
  const [formRef] = Form.useForm();
  const [list, setList] = useState([]);
  const [state, setState] = useState({
    visibleModal: false,
    id: null,
    name: "",
    descriptoin: "",
    status: "",
    parentId: null,
  });

  useEffect(() => {
    getList();
  }, []);
  const getList = async () => {
    const res = await request("category", "get");
    if (res) {
      setList(res.list);
    }
  };
  const onClickEdit = (data, index) => {
    setState({
      ...state,
      visibleModal: true,
    });
    formRef.setFieldsValue({
      Id: data.Id, // hiden id (save? | update?)
      Name: data.Name,
      Description: data.Description,
      Status: data.Status,
    });
    //
    // formRef.getFieldValue("Id")
  };
  const onClickDelete = async (data, index) => {
    Modal.confirm({
      title: "លុ​ប",
      descriptoin: "Are you sure to remove?",
      okText: "យល់ព្រម",
      onOk: async () => {
        const res = await request("category", "delete", {
          Id: data.Id,
        });
        if (res && !res.error) {
          // getList(); // request to api response
          // remove in local
          message.success(res.message);
          const newList = list.filter((item) => item.Id != data.Id);
          setList(newList);
        }
      },
    });
  };
  const onClickAddBtn = () => {
    setState({
      ...state,
      visibleModal: true,
    });
  };
  const onCloseModal = () => {
    formRef.resetFields();
    setState({
      ...state,
      visibleModal: false,
      id: null,
    });
  };

  const onFinish = async (items) => {
    var data = {
      Id: formRef.getFieldValue("Id"),
      Name: items.Name,
      Description: items.Description,
      Status: items.Status,
      ParentId: 1,
    };
    var method = "post";
    if (formRef.getFieldValue("Id")) {
      // case update
      method = "put";
    }
    const res = await request("category", method, data);
    if (res && !res.error) {
      message.success(res.message);
      getList();
      onCloseModal();
    }
  };

  return (
    <div>
      <Button type="primary" icon={<MdAdd />} onClick={onClickAddBtn}>
        New
      </Button>
      <Modal
        open={state.visibleModal}
        title={formRef.getFieldValue("Id") ? "Edit Category" : "New Category"}
        footer={null}
        onCancel={onCloseModal}
      >
        <Form layout="vertical" onFinish={onFinish} form={formRef}>
          <Form.Item name={"Name"} label="Category Name">
            <Input placeholder="Input Category Name" />
          </Form.Item>
          <Form.Item name={"Description"} label="Description">
            <Input.TextArea placeholder="Description" />
          </Form.Item>
          <Form.Item name={"Status"} label="Status">
            <Select
              placeholder="Select Status"
              options={[
                {
                  label: "Active",
                  value: 1,
                },
                {
                  label: "InActive",
                  value: 0,
                },
              ]}
            />
          </Form.Item>

          <Space>
            <Button>Cancel</Button>
            <Button type="primary" htmlType="submit">
              {formRef.getFieldValue("Id") ? "Update" : "Save"}
            </Button>
          </Space>
        </Form>
      </Modal>
      <Table
        dataSource={list}
        columns={[
          {
            key: "No",
            title: "No",
            render: (item, data, index) => index + 1,
          },
          {
            key: "Name",
            title: "Name",
            dataIndex: "Name",
          },
          {
            key: "Description",
            title: "Description",
            dataIndex: "Description",
          },
          {
            key: "Status",
            title: "Status",
            dataIndex: "Status",
            render: (Status) =>
              Status == 1 ? (
                <Tag color="green">Active</Tag>
              ) : (
                <Tag color="red">InActive</Tag>
              ),
          },
          {
            key: "Action",
            title: "Action",
            align: "center",
            render: (item, data, index) => (
              <Space>
                <Button
                  type="primary"
                  icon={<MdEdit />}
                  onClick={() => onClickEdit(data, index)}
                />
                <Button
                  type="primary"
                  danger
                  icon={<MdDelete />}
                  onClick={() => onClickDelete(data, index)}
                />
              </Space>
            ),
          },
        ]}
      />
    </div>
  );
}

export default CategoryPage;
