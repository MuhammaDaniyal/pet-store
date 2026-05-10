import { Schema, model, models } from "mongoose";

const VetSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  specialization: { type: String },  // "General", "Exotic Animals", "Surgery"
  bio: { type: String },
  experience: { type: Number },      // years
  consultationFee: { type: Number },
  availableDays: [{ type: String }], // ["Monday", "Wednesday", "Friday"]
  timeSlots: [{ type: String }],     // ["09:00", "10:00", "11:00"]
  isVerified: { type: Boolean, default: false },
  isAvailable: { type: Boolean, default: true },
}, { timestamps: true });

export const Vet = models.Vet || model("Vet", VetSchema);
