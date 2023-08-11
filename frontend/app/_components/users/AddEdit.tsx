"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button, Form, Input, Space } from "antd";
import { useForm } from "react-hook-form";

import { useAlertService, useUserService } from "_services";

export { AddEdit };

function AddEdit({ title, user }: { title: string; user?: any }) {
  const router = useRouter();
  const alertService = useAlertService();
  const userService = useUserService();

  // get functions to build form with useForm() hook
  const { register, handleSubmit, reset, formState } = useForm({
    defaultValues: user,
  });
  const { errors } = formState;

  const fields = {
    firstName: register("firstName", { required: "First Name is required" }),
    lastName: register("lastName", { required: "Last Name is required" }),
    username: register("username", { required: "Username is required" }),
    password: register("password", {
      minLength: {
        value: 6,
        message: "Password must be at least 6 characters",
      },
      // password only required in add mode
      validate: (value) =>
        !user && !value ? "Password is required" : undefined,
    }),
  };

  async function onSubmit(data: any) {
    alertService.clear();
    try {
      // create or update user based on user prop
      let message;
      if (user) {
        await userService.update(user.id, data);
        message = "User updated";
      } else {
        await userService.create(data);
        message = "User added";
      }

      // redirect to user list with success message
      router.push("/users");
      alertService.success(message, true);
    } catch (error: any) {
      alertService.error(error);
    }
  }
  return (
    <Form layout="vertical" onFinish={onSubmit} initialValues={user}>
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
        label={
          <>
            <span>Password</span>
            <em className="ms-1"> (Leave blank to keep the same password)</em>
          </>
        }
        name="password"
        rules={[
          {
            min: 6,
            message: "Password must be at least 6 characters",
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
          <Button type="default" htmlType="reset">
            Reset
          </Button>
          <Link href="/users">
            <Button type="link">Cancel</Button>
          </Link>
        </Space>
      </Form.Item>
    </Form>
  );
}
