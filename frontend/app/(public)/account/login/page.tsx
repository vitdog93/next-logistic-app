"use client";

import Link from "next/link";
// import { useForm } from "react-hook-form";
import { Button, Form, Input } from "antd";

import { useUserService } from "_services";

export default Login;

function Login() {
  const userService = useUserService();

  async function onSubmit({ username, password }: any) {
    await userService.login(username, password);
  }

  return (
    <div className="card">
      <h4 className="card-header">Login</h4>
      <div className="card-body">
        <Form layout="vertical" onFinish={onSubmit} >
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
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <Button
            //   disabled={formState.isSubmitting}
              type="primary"
              htmlType="submit"
            >
              {/* {formState.isSubmitting && (
                <span className="spinner-border spinner-border-sm me-1"></span>
              )} */}
              Login
            </Button>
            <Link href="/account/register">
              <Button type="link">Register</Button>
            </Link>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
