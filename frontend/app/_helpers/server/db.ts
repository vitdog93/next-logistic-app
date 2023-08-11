import mongoose from "mongoose";

const Schema = mongoose.Schema;

mongoose.connect(process.env.MONGODB_URI!);
mongoose.Promise = global.Promise;

export const db = {
  User: userModel(),
  Order: orderModel(),
  Rating: ratingModel(),
};

// mongoose models with schema definitions

function userModel() {
  const schema = new Schema(
    {
      username: { type: String, unique: true, required: true },
      hash: { type: String, required: true },
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      role: { type: String, enum: ["ADMIN", "USER"] },
    },
    {
      // add createdAt and updatedAt timestamps
      timestamps: true,
    }
  );

  schema.set("toJSON", {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
      //   delete ret._id;
      delete ret.hash;
    },
  });

  return mongoose.models.User || mongoose.model("User", schema);
}

function orderModel() {
  const addressSchema = new Schema({
    addressLine1: { type: String },
    addressLine2: { type: String, default: "" },
    city: { type: String },
    postCode: { type: String },
    country: { type: String },
  });
  const customerSchema = new Schema( {
    firstName: String,
    lastName: String,
    email: String,
  }, { _id : false });
  const schema = new Schema(
    {
      orderNumber: { type: String, unique: true, require: true },
      user: { type: mongoose.SchemaTypes.ObjectId, ref: "User", require: true },
      rating: { type: mongoose.SchemaTypes.ObjectId, ref: "Rating", require: true },
      customer: customerSchema,
      status: {
        type: String,
        enum: ["PENDING", "SHIPPING", "DELIVERED"],
        default: "PENDING",
      },
      recipientAddress: addressSchema,
      shippingAddress: addressSchema,
      shippingAt: Date,
      deliveryAt: Date,
    },
    {
      // add createdAt and updatedAt timestamps
      timestamps: true,
    }
  );
  schema.set("toJSON", {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
      //   delete ret._id;
    },
  });
  return mongoose.models.Order || mongoose.model("Order", schema);
}

function ratingModel() {
  const schema = new Schema(
    {
      order: { type: mongoose.SchemaTypes.ObjectId, ref: "Order" },
      rating: { type: Number, default: 5 },
      comment: { type: String, default: "" },
    },
    {
      // add createdAt and updatedAt timestamps
      timestamps: true,
    }
  );
  schema.set("toJSON", {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
      //   delete ret._id;
    },
  });
  return mongoose.models.Rating || mongoose.model("Rating", schema);
}
