import { useState } from "react";
import { Button, DatePicker, Input, Row, Col, Space, Form } from "antd";
import Link from "next/link";

export { Filter };

type FieldType = {
  orderNumber?: string;
  customerName?: string;
  shippingDate?: string[];
};

function Filter({ onFilter }: { onFilter: Function }) {
  const { RangePicker } = DatePicker;
  const onFinish = (values: any) => {
    console.log("Success:", values);
    onFilter(values)
  };
  return (
    <Form
      initialValues={{ remember: true }}
      onFinish={onFinish}
      layout="vertical"
    >
      <Row gutter={8} align="middle">
        <Col span={6}>
          <Form.Item<FieldType> label="Order number" name="orderNumber">
            <Input />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item<FieldType> label="Customer name" name="customerName">
            <Input />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item<FieldType> label="Shipping Date" name="shippingDate">
            <RangePicker />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Space>
            <Button type="primary" htmlType="submit">Search</Button>
            <Link href="/orders/add">
              <Button type="default">Add</Button>
            </Link>
          </Space>
        </Col>
      </Row>
    </Form>
  );
}
{
  /* <Form.Item<FieldType>
      label="Username"
      name="username"
      rules={[{ required: true, message: 'Please input your username!' }]}
    >
      <Input />
    </Form.Item> */
}
