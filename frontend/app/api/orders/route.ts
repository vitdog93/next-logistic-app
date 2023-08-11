import joi from "joi";

import { ordersRepo } from "_helpers/server";
import { apiHandler } from "_helpers/server/api";

module.exports = apiHandler({
  GET: getAll,
  POST: create,
});

async function getAll(req: Request) {
  // const body = await req.json();
  const userId= req.headers.get("userId");
  const userRole = req.headers.get("userRole");
  return await ordersRepo.getAll({userId, userRole});
}

async function create(req: Request) {
  const body = await req.json();
  return await ordersRepo.create(body);
}

const addressSchema = joi.object({
  addressLine1: joi.string().required(),
  addressLine2: joi.any(),
  city: joi.string().required(),
  postCode: joi.string().required(),
  country: joi.string().required(),
});

const customerSchema = joi.object({
  firstName: joi.string().required(),
  lastName: joi.string().required(),
  email: joi.string().required(),
});

create.schema = joi.object({
  orderNumber: joi.string().required(),
  user: joi.string().required(),
  customer: customerSchema,
  recipientAddress: addressSchema,
  shippingAddress: addressSchema,
  shippingAt: joi.date().min("now").required(),
  deliveryAt: joi.date().greater(joi.ref("shippingAt")).required(),
});
