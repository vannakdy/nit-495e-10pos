import React, { useEffect, useState } from "react";
import { Button, Input, Modal, Space, Table, Tag } from "antd";
import { request } from "../../util/helper";
import { MdAdd, MdDelete, MdEdit } from "react-icons/md";
function CategoryPage() {
  const [list, setList] = useState([]);
  const [state, setState] = useState({
    visibleModal: false,
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
    console.log(data);
  };
  const onClickDelete = (data, index) => {
    console.log(data);
  };
  const onClickAddBtn = () => {
    setState({
      ...state,
      visibleModal: true,
    });
  };
  const onCloseModal = () => {
    setState({
      ...state,
      visibleModal: false,
    });
  };
  const onSave = async () => {
    var data = {
      Name: state.name,
      Description: state.descriptoin,
      Status: state.status,
      ParentId: state.parentId,
    };
    const res = await request("category", "post", data);
    console.log(res);
  };

  return (
    <div>
      <Button type="primary" icon={<MdAdd />} onClick={onClickAddBtn}>
        New
      </Button>
      <Modal
        open={state.visibleModal}
        title="New Category"
        footer={null}
        onCancel={onCloseModal}
      >
        <Input
          placeholder="name"
          onChange={(e) =>
            setState({
              ...state,
              name: e.target.value,
            })
          }
        />
        <Input
          placeholder="description"
          onChange={(e) => {
            setState({
              ...state,
              descriptoin: e.target.value,
            });
          }}
        />
        <Input
          placeholder="status"
          onChange={(e) => {
            setState({
              ...state,
              status: e.target.value,
            });
          }}
        />
        <Space>
          <Button>Cancel</Button>
          <Button type="primary" onClick={onSave}>
            Save
          </Button>
        </Space>
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
