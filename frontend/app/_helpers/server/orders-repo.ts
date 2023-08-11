import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { headers } from "next/headers";
import { db } from "./db";
import moment from "moment";
import mongoose from "mongoose";

const Order = db.Order;

export const ordersRepo = {
  authenticate,
  getAll,
  getById,
  getCurrent,
  create,
  update,
  delete: _delete,
};

async function authenticate({
  username,
  password,
}: {
  username: string;
  password: string;
}) {
  const user = await Order.findOne({ username });

  if (!(user && bcrypt.compareSync(password, user.hash))) {
    throw "Username or password is incorrect";
  }

  // create a jwt token that is valid for 7 days
  const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET!, {
    expiresIn: "7d",
  });

  return {
    user: user.toJSON(),
    token,
  };
}

async function getAll(queries: any, page= 1, pageSize = 10) {
  let $match: any = {};
  const $and = [];
  if(queries?.userRole !== "ADMIN" && queries?.userId) {
    $and.push({user: new mongoose.Types.ObjectId(queries?.userId)})
  }
  if (queries.orderNumber) {
    $and.push({
      orderNumber: { $regex: `.*${queries.orderNumber}.*`, $options: "i" },
    });
  }
  if (queries.customerName) {
    const $firstNameMatch = {
      "customer.firstName": {
        $regex: `.*${queries.customerName}.*`,
        $options: "i",
      },
    };
    const $lastNameMatch = {
      "customer.lastName": {
        $regex: `.*${queries.customerName}.*`,
        $options: "i",
      },
    };
    const $or = { $or: [$firstNameMatch, $lastNameMatch] };
    $and.push($or);
  }
  if (queries.shippingDate && queries.shippingDate.length > 0) {
    const fromDate = queries.shippingDate[0];
    const toDate = queries.shippingDate[1];
    const dateFilter = {shippingAt: { $gte: moment(fromDate).startOf("day").format(), $lte: moment(toDate).endOf('day').format() } }
    $and.push(dateFilter)
  }
  if ($and.length) $match["$and"] = $and;
  const results = await Promise.all([await Order.find($match).skip((page -1)* pageSize ).limit(pageSize).populate("rating"), await Order.countDocuments()]);
  return {data: results[0], total: results[1]}
}

async function getById(id: string) {
  try {
    return await Order.findById(id).populate("user");
  } catch (e) {
    console.log(e);
    throw "Order Not Found";
  }
}

async function getCurrent() {
  try {
    const currentUserId = headers().get("userId");
    return await Order.findById(currentUserId);
  } catch {
    throw "Current Order Not Found";
  }
}

async function create(params: any) {
  // validate
  if (await Order.findOne({ orderNumber: params.orderNumber })) {
    throw 'Order number "' + params.orderNumber + '" is already taken';
  }
  const order = new Order(params);
  await order.save();
  return order;
}

async function update(id: string, params: any) {
  const order = await Order.findById(id);
  // validate
  if (!order) throw "Order not found";
  if (
    order.orderNumber !== params.orderNumber &&
    (await Order.findOne({ orderNumber: params.orderNumber }))
  ) {
    throw 'Order number "' + params.orderNumber + '" is already taken';
  }
  // copy params properties to user
  Object.assign(order, params);
  await order.save();
  return order;
}

async function _delete(id: string) {
  await Order.findByIdAndRemove(id);
}
