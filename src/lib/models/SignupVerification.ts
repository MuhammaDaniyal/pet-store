import { Schema, model, models } from "mongoose";

const SignupVerificationSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, index: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      province: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    role: { type: String, enum: ["user", "vet"], default: "user", required: true },
    codeHash: { type: String, required: true },
    attempts: { type: Number, default: 0 },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true },
);

SignupVerificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

if (models.SignupVerification) {
  delete models.SignupVerification;
}

export const SignupVerification = model("SignupVerification", SignupVerificationSchema);
