import React from "react";
import Link from "next/link";

import { connectToDatabase } from "@/lib/db";
import { Category } from "@/lib/models/Category";
import { Product } from "@/lib/models/Product";

type ProductItem = {
  _id: any;
  name: string;
  slug?: string;
  price?: number;
  images?: string[];
  isFeatured?: boolean;
};

export const revalidate = 0;

export default async function ShopPage() {
  await connectToDatabase();

  const products = (await Product.find({ isActive: true }).lean().limit(200)) as ProductItem[];

  return (
    <main className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-semibold mb-6">Shop</h1>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {products.map((p) => {
          const id = p._id?.toString?.() ?? String(p._id);
          const price = typeof p.price === "number" ? (p.price / 100).toFixed(2) : "-";

          return (
            <article key={id} className="border rounded-md p-4 hover:shadow">
              <Link href={`/shop/${id}`} className="block">
                <div className="h-40 bg-gray-100 rounded-md mb-3 flex items-center justify-center text-3xl">
                  {p.images && p.images.length > 0 ? (
                    // image present: use first image
                    // note: using plain img tag keeps this simple
                    <img src={p.images[0]} alt={p.name} className="object-cover h-full w-full rounded-md" />
                  ) : (
                    <span>🐾</span>
                  )}
                </div>

                <h2 className="text-lg font-medium">{p.name}</h2>
                <div className="mt-2 flex items-center justify-between text-sm text-gray-600">
                  <span className="font-semibold">${price}</span>
                  {p.isFeatured ? <span className="text-xs bg-yellow-200 px-2 py-1 rounded">Featured</span> : null}
                </div>
              </Link>
            </article>
          );
        })}
      </div>
    </main>
  );
}
