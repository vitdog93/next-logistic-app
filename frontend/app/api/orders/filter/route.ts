import joi from "joi";

import { ordersRepo } from "_helpers/server";
import { apiHandler } from "_helpers/server/api";

module.exports = apiHandler({
  POST: filter,
});

async function filter(req: Request) {
    // const body = await req.json();
    const body = await req.json()
    const userId= req.headers.get("userId");
    const userRole = req.headers.get("userRole");
    body.userId = userId;
    body.userRole = userRole;
    return await ordersRepo.getAll(body);
  }