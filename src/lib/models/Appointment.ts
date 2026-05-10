import { Schema, model, models } from "mongoose";

const AppointmentSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  vet: { type: Schema.Types.ObjectId, ref: "User", required: true },
  pet: { type: String, required: true },  // pet name/description for now
  date: { type: Date, required: true },
  timeSlot: { type: String, required: true },  // "10:00"
  type: { type: String, enum: ["consultation", "grooming", "checkup"], required: true },
  status: { type: String, enum: ["pending", "confirmed", "completed", "cancelled"], default: "pending" },
  notes: { type: String },
  fee: { type: Number },
}, { timestamps: true });

export const Appointment = models.Appointment || model("Appointment", AppointmentSchema);
