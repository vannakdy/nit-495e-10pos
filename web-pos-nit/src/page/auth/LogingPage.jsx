import React from "react";
import { Form, Button, Modal, message, Input, Space } from "antd";
import { request } from "../../util/helper";
import { setAcccessToken, setProfile } from "../../store/profile.store";
import { useNavigate } from "react-router-dom";
function LogingPage() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const onLogin = async (item) => {
    var param = {
      username: item.username, //"adminnit@gmail.com",///"sokdara@gmailcom",
      password: item.password,
    };
    const res = await request("auth/login", "post", param);
    if (res && !res.error) {
      setAcccessToken(res.access_token);
      // local storage can not store object
      // profile = {
      //   id : 1,
      //   name : ""
      // }
      // but can string object
      setProfile(JSON.stringify(res.profile));
      navigate("/");
    } else {
      alert(JSON.stringify(res));
    }
  };
  return (
    <div>
      <h1>Login</h1>
      <Form layout="vertical" form={form} onFinish={onLogin}>
        <Form.Item name="username" label="Username">
          <Input placeholder="Username" />
        </Form.Item>
        <Form.Item name="password" label="Password">
          <Input.Password placeholder="Password" />
        </Form.Item>
        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit">
              LOGIN
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
}

export default LogingPage;
