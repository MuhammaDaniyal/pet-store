import { connectToDatabase } from "@/lib/db";
import { Product } from "@/lib/models/Product";
import { Category } from "@/lib/models/Category";
import ProductForm from "../../../components/admin/ProductForm";
import ProductsTableClient from "./ProductsTableClient";

export const metadata = {
  title: "Products | Admin",
};

export default async function AdminProductsPage() {
  await connectToDatabase();

  const [productsRaw, categoriesRaw] = await Promise.all([
    Product.find().populate("category").sort({ createdAt: -1 }).lean(),
    Category.find().sort({ order: 1 }).lean(),
  ]);

  const products = JSON.parse(JSON.stringify(productsRaw));
  const categories = JSON.parse(JSON.stringify(categoriesRaw));

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <div className="mb-5">
        <div>
          <h1 className="text-[clamp(1.8rem,3vw,2.6rem)] font-semibold tracking-[-0.04em] text-primary">Products</h1>
          <p className="mt-2 text-sm text-secondary">Manage store products (image URL only).</p>
        </div>
      </div>

      <div className="mb-6 rounded-2xl border border-border bg-surface p-4 sm:p-5">
        <ProductForm categories={categories} />
      </div>

      <ProductsTableClient products={products} categories={categories} />
    </div>
  );
}
