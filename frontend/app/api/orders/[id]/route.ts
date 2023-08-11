import joi from "joi";

import { cookies } from "next/headers";

import { apiHandler } from "_helpers/server/api";
import { ordersRepo } from "_helpers/server";

module.exports = apiHandler({
  GET: getById,
  PUT: update,
  DELETE: _delete,
});

async function getById(req: Request, { params: { id } }: any) {
  return await ordersRepo.getById(id);
}

async function update(req: Request, { params: { id } }: any) {
  const body = await req.json();
  console.log(body)
  return await ordersRepo.update(id, body);
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
  email: joi.string().required()
});

update.schema = joi.object({
  orderNumber: joi.string().required(),
  customer: customerSchema,
  recipientAddress: addressSchema,
  shippingAddress: addressSchema,
  shippingAt: joi.date().min("now").required(),
  deliveryAt: joi.date().greater(joi.ref("shippingAt")).required(),
});

async function _delete(req: Request, { params: { id } }: any) {
  await ordersRepo.delete(id);

  // auto logout if deleted self
  if (id === req.headers.get("userId")) {
    cookies().delete("authorization");
    return { deletedSelf: true };
  }
}
