import { headers } from "next/headers";
import { db } from "./db";
import mongoose from "mongoose";
import { ordersRepo } from "_helpers/server/";

const Rating = db.Rating;
const Order = db.Order;

export const ratingsRepo = {
  create,
  getById,
};

interface RatingInput {
  _id?: string;
  order: string;
  rating: number;
  comment: string;
}

async function create(params: RatingInput) {
  if (
    await Rating.findOne({ order: new mongoose.Types.ObjectId(params.order) })
  ) {
    throw `Already rated on order: ${params.order}`;
  }
  const rating = new Rating(params);
  await rating.save();
  await ordersRepo.update(params.order, {rating: rating._id});
  return rating;
}

async function getById(id: string) {
  try {
    return await Rating.findById(id).populate("order");
  } catch {
    return null;
  }
}
