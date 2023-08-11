"use client";

import Link from "next/link";
import { Button, Form, Input } from "antd";

import { useUserService } from "_services";

export default Register;

function Register() {
  const userService = useUserService();

  // get functions to build form with useForm() hook
  async function onSubmit(user: any) {
    await userService.register(user);
  }

  return (
    <div className="card">
      <h4 className="card-header">Register</h4>
      <div className="card-body">
        <Form layout="vertical" onFinish={onSubmit}>
          <Form.Item
            label="First name"
            name="firstName"
            rules={[
              {
                required: true,
                message: "First Name is required!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Last name"
            name="lastName"
            rules={[
              {
                required: true,
                message: "Password is required!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Username"
            name="username"
            rules={[
              {
                required: true,
                message: "Username is required!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[
              {
                required: true,
                message: "Password is required!",
              },
              {
                min: 6,
                message: "Password must be at least 6 characters"
              }
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Register
            </Button>
            <Link href="/account/login">
              <Button type="link">Cancel</Button>
            </Link>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
