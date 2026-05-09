import mongoose, { Schema, model, models } from "mongoose";

const ProductSchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true, default: 0 },

    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },

    images: [{ type: String }], // array of image URLs

    // Animal-specific fields
    animalType: {
      type: String,
      enum: ["dog", "cat", "bird", "fish", "small-animal", "wild-animal", "other"],
      required: true,
    },
    breed: { type: String },   // "Golden Retriever", only for live animals
    age: { type: String },     // "8 weeks", "3 months"
    gender: { type: String, enum: ["male", "female", "unknown"] },
    isLiveAnimal: { type: Boolean, default: false },

    // Store metrics
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },

    tags: [{ type: String }],           // for search/filtering e.g. "puppy", "indoor"
    discount: { type: Number, default: 0 }, // percentage discount
    weight: { type: String },           // (kg), useful for shipping
  },
  { timestamps: true }
);

export const Product = models.Product || model("Product", ProductSchema);