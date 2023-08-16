"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Button, Space, Table } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";

import { Spinner } from "_components";
import { useUserService, IUser } from "_services";

export default Users;

function Users() {
  const userService = useUserService();
  const users = userService.users;

  useEffect(() => {
    userService.getAll();
  }, []);

  const columns: ColumnsType<IUser> = [
    {
      title: "First name",
      dataIndex: "firstName",
      key: "firstName",
    },
    {
      title: "Last name",
      dataIndex: "lastName",
      key: "lastName",
    },
    {
      title: "username",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Action",
      key: "action",
      align: "center",
      render: (_, user) => (
        <Space>
          <Link href={`/users/edit/${user.id}`} className="me-1">
            <Button type="primary">Edit</Button>
          </Link>
          <Button
            type="primary"
            danger
            onClick={() => userService.delete(user.id)}
            disabled={user.isDeleting}
          >
            {user.isDeleting ? (
              <span className="spinner-border spinner-border-sm"></span>
            ) : (
              <span>Delete</span>
            )}
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <>
      <div className="d-flex justify-between align-items-center">
        <h2>Users</h2>
        <Link href="/users/add">
          <Button type="primary">
            Add User
          </Button>
        </Link>
      </div>
      <Table
        columns={columns}
        rowKey={(record) => record.id}
        dataSource={users && users.length ? users : []}
        loading={users ? false : true}
      />
    </>
  );
}
