/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { connectToDatabase } from "@/lib/db";
import { Product } from "@/lib/models/Product";
import { Category } from "@/lib/models/Category"; // Must import to populate properly
import ShopClient from "./ShopClient"; 

export const revalidate = 0; // always render fresh on server during development

export default async function ShopPage() {
  await connectToDatabase();
  
  // Ensure the Category model is initialized before populating
  Category.init();

  // Fetch products and POPULATE the category reference
  const products = await Product.find({ isActive: true })
    .populate("category")
    .lean()
    .limit(200);

  // We serialize the ObjectIds and handle potential missing data safely
  const serializedProducts = products.map((p: any) => ({
    _id: p._id.toString(),
    name: p.name,
    description: p.description || "",
    price: p.price,
    images: p.images || [],
    isFeatured: p.isFeatured || false,
    category: p.category ? {
      _id: p.category._id.toString(),
      name: p.category.name,
    } : { _id: "unassigned", name: "Uncategorized" }
  }));

  return (
    // Pass the prepared data to the interactive client component
    <ShopClient initialProducts={serializedProducts} />
  );
}