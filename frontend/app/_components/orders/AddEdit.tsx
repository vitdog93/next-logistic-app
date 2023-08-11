"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button, DatePicker, Input, Row, Col, Space, Form } from "antd";

import { useAlertService, useOrderService } from "_services";
// import {Rating} from "./Rating";
import dayjs from "dayjs";

export { AddEdit };
interface IFormAddressInput {
  addressLine1: string;
  addressLine2: string;
  city: string;
  country: string;
  postCode: string;
}

interface IFormCustomerInput {
  firstName: string;
  lastName: string;
  email: string;
}

interface IFormInput {
  orderNumber: string;
  customer: IFormCustomerInput;
  recipientAddress: IFormAddressInput;
  shippingAddress: IFormAddressInput;
  shippingAt: Date;
  deliveryAt: Date;
}

function AddEdit({
  title,
  order,
  user,
}: {
  title: string;
  order?: any;
  user?: any;
}) {
  const router = useRouter();
  const alertService = useAlertService();
  const orderService = useOrderService();
  const orderData = {
    ...order,
    ...(order?.shippingAt && {
      shippingAt: dayjs(order.shippingAt),
    }),
    ...(order?.deliveryAt && {
      deliveryAt: dayjs(order.deliveryAt),
    }),
  };

  const onFinish = async (values: IFormInput) => {
    alertService.clear();
    try {
      // create or update user based on user prop
      let message;
      if (order) {
        await orderService.update(order.id, values);
        message = "Order updated";
      } else {
        await orderService.create(values);
        message = "Order added";
      }

      // redirect to user list with success message
      router.push("/orders");
      alertService.success(message, true);
    } catch (error: any) {
      alertService.error(error);
    }
  };

  const disableForm =
    order?.user?.role === "USER" && order?.status === "DELIVERED";

  // const handleRating = (values: {rating: number, comment: string}) => {
  //   const ratingData = {...values, order: order.id}
  //   console.log("ratingData", ratingData);
  //   orderService.rating(ratingData);
  //   // return ratingData;
  // }

  return (
    <>
      {/* <Rating onSubmit={handleRating} rating={order.rating}/> */}
      <Form
        onFinish={onFinish}
        layout="vertical"
        initialValues={orderData}
        disabled={disableForm}
      >
        <Row>
          <Col span={10}>
            <Form.Item
              label="Order Number"
              name="orderNumber"
              // initialValue={order?.orderNumber}
              rules={[
                {
                  required: true,
                  message: "Please input your order number!",
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <h6>Customer Info</h6>
            <Row gutter={12}>
              <Col span={10}>
                <Form.Item
                  label="Firsts Name"
                  name={["customer", "firstName"]}
                  rules={[
                    {
                      required: true,
                      message: "Please input your customer first name!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={10}>
                <Form.Item
                  label="Last Name"
                  name={["customer", "lastName"]}
                  rules={[
                    {
                      required: true,
                      message: "Please input your customer last name!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={10}>
                <Form.Item
                  label="Email"
                  name={["customer", "email"]}
                  rules={[
                    {
                      required: true,
                      message: "Please input your customer email!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>
          </Col>
          <Col span={12}>
            <h6>Shipping Day & Delivery Day</h6>
            <Row gutter={12}>
              <Col span={12}>
                <Form.Item
                  label="Shipping at"
                  name={"shippingAt"}
                  rules={[
                    {
                      required: true,
                      message: "Please input shipping date!",
                    },
                  ]}
                >
                  <DatePicker style={{ width: "100%" }} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Delivery at"
                  name={"deliveryAt"}
                  rules={[
                    {
                      required: true,
                      message: "Please input delivery date!",
                    },
                  ]}
                >
                  <DatePicker style={{ width: "100%" }} />
                </Form.Item>
              </Col>
            </Row>
          </Col>
        </Row>

        {/* Recipient Adress */}
        <Row>
          <Col span={12}>
            <h6>Recipient Address</h6>
            <Row gutter={12}>
              <Col span={20}>
                <Form.Item
                  label="Address Line 1"
                  name={["recipientAddress", "addressLine1"]}
                  rules={[
                    {
                      required: true,
                      message: "Please input recipient address line 1!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={20}>
                <Form.Item
                  label="Address Line 2"
                  name={["recipientAddress", "addressLine2"]}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={12}>
              <Col span={10}>
                <Form.Item
                  label="City"
                  name={["recipientAddress", "city"]}
                  rules={[
                    {
                      required: true,
                      message: "Please input recipient address: city!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={10}>
                <Form.Item
                  label="Country"
                  name={["recipientAddress", "country"]}
                  rules={[
                    {
                      required: true,
                      message: "Please input recipient address: country!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={10}>
                <Form.Item
                  label="Post code"
                  name={["recipientAddress", "postCode"]}
                  rules={[
                    {
                      required: true,
                      message: "Please input recipient address: post code!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>
          </Col>
          <Col span={12}>
            <h6>Shipping Address</h6>
            <Row gutter={12}>
              <Col span={20}>
                <Form.Item
                  label="Address Line 1"
                  name={["shippingAddress", "addressLine1"]}
                  rules={[
                    {
                      required: true,
                      message: "Please input recipient address line 1!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={20}>
                <Form.Item
                  label="Address Line 2"
                  name={["shippingAddress", "addressLine2"]}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={12}>
              <Col span={10}>
                <Form.Item
                  label="City"
                  name={["shippingAddress", "city"]}
                  rules={[
                    {
                      required: true,
                      message: "Please input shipping address: city!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={10}>
                <Form.Item
                  label="Country"
                  name={["shippingAddress", "country"]}
                  rules={[
                    {
                      required: true,
                      message: "Please input shipping address: country!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={10}>
                <Form.Item
                  label="Post code"
                  name={["shippingAddress", "postCode"]}
                  rules={[
                    {
                      required: true,
                      message: "Please input shipping address: post code!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>
          </Col>
        </Row>
        {/* shipping address */}

        <Row justify="end">
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
              <Button type="default" htmlType="reset">
                Reset
              </Button>
              <Link href="/orders">
                <Button type="link">Cancel</Button>
              </Link>
            </Space>
          </Form.Item>
        </Row>
      </Form>
    </>
  );
}
