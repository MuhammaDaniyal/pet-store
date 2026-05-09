import mongoose, { Schema, model, models } from "mongoose";

const CategorySchema = new Schema({
  name: { type: String, required: true, unique: true }, // "Dogs"
  slug: { type: String, required: true, unique: true }, // "dogs"
  icon: { type: String },                       // emoji or icon name "🐕"
  description: { type: String },
  image: { type: String },                      // category cover image URL
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 },          // display order in UI
});

export const Category = models.Category || model("Category", CategorySchema);