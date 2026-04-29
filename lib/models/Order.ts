import { Schema, model, models } from "mongoose";

const OrderItemSchema = new Schema({
  product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  name: { type: String, required: true },   // snapshot at time of purchase
  price: { type: Number, required: true },  // snapshot
  quantity: { type: Number, required: true },
  image: { type: String },
});

const OrderSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: [OrderItemSchema],
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    address: {
      fullName: String,
      phone: String,
      street: String,
      city: String,
      province: String,
      postalCode: String,
    },
    paymentMethod: { type: String, default: "cash_on_delivery" },
    trackingNumber: { type: String },
  },
  { timestamps: true }
);

export const Order = models.Order || model("Order", OrderSchema);