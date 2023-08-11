import joi from "joi";

import { ratingsRepo } from "_helpers/server";
import { apiHandler } from "_helpers/server/api";

module.exports = apiHandler({
  POST: create,
});

async function create(req: Request) {
  const body = await req.json();
  return await ratingsRepo.create(body);
}
