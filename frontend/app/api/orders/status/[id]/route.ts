import joi from "joi";

import { cookies } from "next/headers";

import { apiHandler } from "_helpers/server/api";
import { ordersRepo } from "_helpers/server";

module.exports = apiHandler({
  PUT: update,
});

async function update(req: Request, { params: { id } }: any) {
  const body = await req.json();
  console.log(body)
  return await ordersRepo.update(id, body);
}

update.schema = joi.object({
  status: joi.string().required(),
});