import React, { useEffect, useState } from "react";
import {
  Button,
  Form,
  Image,
  Input,
  InputNumber,
  message,
  Modal,
  Select,
  Space,
  Table,
  Tag,
  Upload,
} from "antd";
import { request } from "../../util/helper";
import { MdAdd, MdDelete, MdEdit } from "react-icons/md";
import MainPage from "../../component/layout/MainPage";
import { configStore } from "../../store/configStore";
// aaaa
// id	category_id	barcode	name	brand	description	qty	price	discount	status	image
const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

function ProductPage() {
  const { config } = configStore();
  const [form] = Form.useForm();
  const [state, setState] = useState({
    visibleModal: false,
    id: null,
    name: "",
    descriptoin: "",
    status: "",
    parentId: null,
    txtSearch: "",
  });

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [imageDefault, setImageDefault] = useState([]);
  const [imageOptional, setImageOptional] = useState([]);

  useEffect(() => {
    // getList();
  }, []);

  const onCloseModal = () => {};
  const onFinish = (items) => {
    console.log(items);
  };
  const onBtnNew = () => {
    setState((p) => ({
      ...p,
      visibleModal: true,
    }));
  };

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };

  const handleChangeImageDefault = ({ fileList: newFileList }) =>
    setImageDefault(newFileList);
  const handleChangeImageOptional = ({ fileList: newFileList }) =>
    setImageOptional(newFileList);

  return (
    <MainPage loading={false}>
      <div className="pageHeader">
        <Space>
          <div>Product</div>
          <Input.Search
            onChange={(value) =>
              setState((p) => ({ ...p, txtSearch: value.target.value }))
            }
            allowClear
            placeholder="Search"
          />
          <Select
            allowClear
            style={{ width: 130 }}
            placeholder="Category"
            options={config.category}
          />
          <Select
            allowClear
            style={{ width: 130 }}
            placeholder="Brand"
            options={config.brand}
          />
          <Button type="primary">Filter</Button>
        </Space>
        <Button type="primary" onClick={onBtnNew}>
          NEW
        </Button>
      </div>
      <Modal
        open={state.visibleModal}
        title={form.getFieldValue("id") ? "Edit Product" : "New Product"}
        footer={null}
        onCancel={onCloseModal}
      >
        <Form layout="vertical" onFinish={onFinish} form={form}>
          <Form.Item
            name={"name"}
            label="Product name"
            rules={[
              {
                required: true,
                message: "Please fill in product name",
              },
            ]}
          >
            <Input placeholder="Product name" />
          </Form.Item>
          <Form.Item
            name={"category_id"}
            label="Category"
            rules={[
              {
                required: true,
                message: "Please fill in product name",
              },
            ]}
          >
            <Select placeholder="Select category" options={config.category} />
          </Form.Item>
          <Form.Item
            name={"brand"}
            label="Brand"
            rules={[
              {
                required: true,
                message: "Please fill in product name",
              },
            ]}
          >
            <Select
              placeholder="Select brand"
              options={config.brand?.map((item) => ({
                label: item.label + " (" + item.country + ")",
                value: item.value,
              }))}
            />
          </Form.Item>
          <Form.Item name={"description"} label="description">
            <Input.TextArea placeholder="description" />
          </Form.Item>
          <Form.Item name={"qty"} label="Quantity">
            <InputNumber placeholder="Quantity" style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name={"price"} label="Price">
            <InputNumber placeholder="Price" style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name={"discount"} label="Discount">
            <InputNumber placeholder="Discount" style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name={"status"} label="status">
            <Select
              placeholder="Select status"
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

          <Form.Item name={"image_default"} label="Image">
            <Upload
              customRequest={(options) => {
                options.onSuccess();
                // options.onProgress({ percent: 0 });
                // options.onProgress({ percent: 100 });
              }}
              listType="picture-card"
              fileList={imageDefault}
              onPreview={handlePreview}
              onChange={handleChangeImageDefault}
            >
              <div>+Upload</div>
            </Upload>
          </Form.Item>

          <Form.Item name={"image_optional"} label="Image (Optional)">
            <Upload
              customRequest={(options) => {
                options.onSuccess();
              }}
              listType="picture-card"
              multiple={true}
              maxCount={5}
              fileList={imageOptional}
              onPreview={handlePreview}
              onChange={handleChangeImageOptional}
            >
              <div>+Upload</div>
            </Upload>
          </Form.Item>

          {previewImage && (
            <Image
              wrapperStyle={{
                display: "none",
              }}
              preview={{
                visible: previewOpen,
                onVisibleChange: (visible) => setPreviewOpen(visible),
                afterOpenChange: (visible) => !visible && setPreviewImage(""),
              }}
              src={previewImage}
            />
          )}

          <Space>
            <Button onClick={onCloseModal}>Cancel</Button>
            <Button type="primary" htmlType="submit">
              {form.getFieldValue("id") ? "Update" : "Save"}
            </Button>
          </Space>
        </Form>
      </Modal>
      {/* <Table
        dataSource={list}
        columns={[
          {
            key: "No",
            title: "No",
            render: (item, data, index) => index + 1,
          },
          {
            key: "name",
            title: "name",
            dataIndex: "name",
          },
          {
            key: "description",
            title: "description",
            dataIndex: "description",
          },
          {
            key: "status",
            title: "status",
            dataIndex: "status",
            render: (status) =>
              status == 1 ? (
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
      /> */}
    </MainPage>
  );
}

export default ProductPage;
