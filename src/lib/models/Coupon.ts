import { Schema, model, models } from "mongoose";

const CouponSchema = new Schema({
  code: { type: String, required: true, unique: true, uppercase: true },
  discountType: { type: String, enum: ["percentage", "fixed"], required: true },
  discountValue: { type: Number, required: true },
  minOrderAmount: { type: Number, default: 0 },
  maxUses: { type: Number },
  usedCount: { type: Number, default: 0 },
  expiresAt: { type: Date },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export const Coupon = models.Coupon || model("Coupon", CouponSchema);