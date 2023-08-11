"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Space, Table, Tag, Button, Spin, Dropdown } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import { DownOutlined } from "@ant-design/icons";
import { MenuProps, Tooltip } from "antd";
// import { Spinner } from "_components";

import { Filter } from "_components/orders/Filter";
import { RatingModal } from "_components/orders";
import {
  useOrderService,
  IOrderAddress,
  IOrder,
  useUserService,
  IUser,
} from "_services";
import { formatTimeDisplay, formatTimeQuery } from "_helpers/client";

export default Orders;

interface TableParams {
  pagination?: TablePaginationConfig;
  // sortField?: string;
  // sortOrder?: string;
  // filters?: Record<string, FilterValue>;
}

function renderAddress({
  addressLine1,
  addressLine2,
  city,
  country,
  postCode,
}: IOrderAddress) {
  return `${addressLine1}, ${addressLine2}, ${city}, ${country}, ${postCode}`;
}

function Orders() {
  const orderService = useOrderService();
  const userService = useUserService();
  const currentUser = userService.currentUser;
  const orders = orderService.orders;
  const totalCount = orderService.total;
  const [queries, setQueries] = useState({
    orderNumber: undefined,
    customerName: undefined,
    shippingDate: undefined,
    page: 1,
    pageSize: 10,
  });
  // const [loading, setLoading] = useState(false);
  const [ratingData, setRatingData] = useState({
    order: "",
    rating: 5,
    comment: "",
  });
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });

  useEffect(() => {
    orderService.getAll();
    userService.getCurrent();
  }, []);

  const onClick: MenuProps["onClick"] = ({ key }) => {
    const { status, id } = JSON.parse(key);
    orderService.changeStatus(id, status);
  };

  const handleRating = (value: { rating: number; comment: string }) => {
    orderService.rating({ ...value, order: ratingData.order });
    setRatingData({ order: "", rating: 5, comment: "" });
  };

  function displayOrderStatus(
    user: IUser | any,
    status: string,
    orderId: string
  ) {
    let color = "";
    switch (status) {
      case "PENDING":
        color = "warning";
        break;
      case "SHIPPING":
        color = "processing";
        break;
      case "DELIVERED":
        color = "success";
        break;
    }
    const tag = <Tag color={color}>{status.toUpperCase()}</Tag>;
    if (!user?.role || user.role !== "ADMIN") {
      return tag;
    } else {
      const items: MenuProps["items"] = [
        {
          label: "Pending",
          key: JSON.stringify({ status: "PENDING", id: orderId }),
        },
        {
          label: "Shipping",
          key: JSON.stringify({ status: "SHIPPING", id: orderId }),
        },
        {
          label: "Delivered",
          key: JSON.stringify({ status: "DELIVERED", id: orderId }),
        },
      ];
      return (
        <Dropdown.Button
          type="link"
          menu={{ items, onClick }}
          icon={<DownOutlined />}
          size="small"
        >
          {tag}
        </Dropdown.Button>
      );
    }
  }

  const columns: ColumnsType<IOrder> = [
    {
      title: "Order Number",
      dataIndex: "orderNumber",
      key: "orderNumber",
      responsive: ["md"],
      width: 90,
      fixed: 'left',
    },
    {
      title: "Customer Name",
      dataIndex: "customer",
      key: "name",
      render: (customer) => `${customer.firstName} ${customer.lastName}`,
      responsive: ["md"],
      width: 100
    },
    {
      title: "Recipient Address",
      dataIndex: "recipientAddress",
      key: "recipientAddress",
      render: (address) => (
        <Tooltip placement="bottomLeft" title={renderAddress(address)}>
          {renderAddress(address)}
        </Tooltip>
      ),
      responsive: ["md"],
      ellipsis: {
        showTitle: false,
      },
    },
    {
      title: "Shipping Address",
      dataIndex: "shippingAddress",
      key: "shippingAddress",
      render: (address) => (
        <Tooltip placement="bottomLeft" title={renderAddress(address)}>
          {renderAddress(address)}
        </Tooltip>
      ),
      responsive: ["md"],
      ellipsis: {
        showTitle: false,
      },
    },
    {
      title: "Shipping Date",
      dataIndex: "shippingAt",
      key: "shippingAt",
      render: (time) => formatTimeDisplay(time),
      responsive: ["md"],
      width: 110
    },
    {
      title: "Delivery Date",
      dataIndex: "deliveryAt",
      key: "deliveryAt",
      render: (time) => formatTimeDisplay(time),
      responsive: ["md"],
      width: 110
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (_, { id, status }) =>
        displayOrderStatus(currentUser, status, id),
      responsive: ["md"],
      width: 150      
    },
    {
      title: "Action",
      key: "action",
      responsive: ["sm"],
      render: (_, order) => (
        <Space size="small">
          {order.status === "DELIVERED" && currentUser?.role === "USER" ? (
            <Button
              type="link"
              htmlType="button"
              onClick={() => {
                if (order.rating) {
                  setRatingData({
                    order: order.id,
                    rating: order?.rating?.rating,
                    comment: order?.rating?.comment,
                  });
                } else setRatingData({ ...ratingData, order: order.id });
              }}
            >
              Rate now
            </Button>
          ) : (
            <>
              {" "}
              <Link href={`/orders/edit/${order.id}`}>
                <Button type="primary" htmlType="button">
                  Edit
                </Button>
              </Link>
              <Button
                onClick={() => orderService.delete(order.id)}
                type="primary"
                danger
                loading={order.isDeleting}
              >
                Delete
              </Button>
              {order.rating ? (
                <Button
                  type="link"
                  htmlType="button"
                  onClick={() => {
                    if (order.rating) {
                      setRatingData({
                        order: order.id,
                        rating: order?.rating?.rating,
                        comment: order?.rating?.comment,
                      });
                    }
                  }}
                >
                  Rating
                </Button>
              ) : null}
            </>
          )}
        </Space>
      ),
    },
  ];

  useEffect(() => {
    setQueries({
      ...queries,
      page: tableParams.pagination?.current
        ? tableParams.pagination?.current
        : 1,
    });
  }, [JSON.stringify(tableParams)]);

  useEffect(() => {
    orderService.filter(queries);
  }, [JSON.stringify(queries)]);

  function onFilter(values: any) {
    setQueries({ ...queries, ...values });
    // orderService.filter(values);
  }

  const handleTableChange = (pagination: TablePaginationConfig) => {
    setTableParams({
      pagination,
    });
  };

  return (
    <>
      <h2>Orders</h2>
      <Filter onFilter={onFilter} />
      <Table
        columns={columns}
        rowKey={(record) => record.id}
        dataSource={orders && orders.length ? orders : []}
        loading={orders ? false : true}
        onChange={handleTableChange}
        pagination={tableParams.pagination}
        scroll={{ x: 1200 }}
      />
      <RatingModal
        // show={showRatingModal}
        rated={ratingData}
        onClose={() => setRatingData({ order: "", rating: 5, comment: "" })}
        onSubmit={handleRating}
      />
    </>
  );
}
