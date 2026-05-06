import { Schema, model, models } from "mongoose";

const SignupVerificationSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, index: true },
    password: { type: String, required: true },
    codeHash: { type: String, required: true },
    attempts: { type: Number, default: 0 },
    expiresAt: { type: Date, required: true, index: true },
  },
  { timestamps: true },
);

SignupVerificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const SignupVerification =
  models.SignupVerification || model("SignupVerification", SignupVerificationSchema);
