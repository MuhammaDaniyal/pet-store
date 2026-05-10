"use client";

import { useMemo, useState } from "react";
import ProductRow from "./ProductRow";

type CategoryOption = { _id: string; name: string };

type ProductRecord = {
  _id: string;
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  isActive?: boolean;
  category?: { _id?: string; name?: string };
};

export default function ProductsTableClient({ products, categories }: { products: ProductRecord[]; categories: CategoryOption[] }) {
  const [nameQuery, setNameQuery] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [activeFilter, setActiveFilter] = useState<"all" | "active" | "inactive">("all");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const filteredProducts = useMemo(() => {
    const query = nameQuery.trim().toLowerCase();
    const min = minPrice === "" ? null : Number(minPrice);
    const max = maxPrice === "" ? null : Number(maxPrice);

    return products.filter((product) => {
      const matchesName =
        query.length === 0 ||
        String(product.name || "").toLowerCase().includes(query) ||
        String(product.description || "").toLowerCase().includes(query);

      const matchesCategory = categoryId === "" || String(product.category?._id) === categoryId;

      const matchesActive =
        activeFilter === "all" ||
        (activeFilter === "active" && Boolean(product.isActive)) ||
        (activeFilter === "inactive" && !product.isActive);

      const price = Number(product.price || 0);
      const matchesMin = min === null || price >= min;
      const matchesMax = max === null || price <= max;

      return matchesName && matchesCategory && matchesActive && matchesMin && matchesMax;
    });
  }, [products, nameQuery, categoryId, activeFilter, minPrice, maxPrice]);

  return (
    <>
      <div className="mb-6 grid gap-3 rounded-2xl border border-border bg-background/50 p-4 sm:grid-cols-2 lg:grid-cols-5">
        <input
          value={nameQuery}
          onChange={(e) => setNameQuery(e.target.value)}
          placeholder="Filter by name"
          className="w-full rounded-lg border border-border bg-background text-primary px-3 py-2 text-sm"
        />

        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="w-full rounded-lg border border-border bg-background text-primary px-3 py-2 text-sm"
        >
          <option value="">All categories</option>
          {categories.map((category) => (
            <option key={String(category._id)} value={String(category._id)}>
              {category.name}
            </option>
          ))}
        </select>

        <input
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          type="number"
          min="0"
          step="0.01"
          placeholder="Min price"
          className="w-full rounded-lg border border-border bg-background text-primary px-3 py-2 text-sm"
        />

        <input
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          type="number"
          min="0"
          step="0.01"
          placeholder="Max price"
          className="w-full rounded-lg border border-border bg-background text-primary px-3 py-2 text-sm"
        />

        <select
          value={activeFilter}
          onChange={(e) => setActiveFilter(e.target.value as "all" | "active" | "inactive")}
          className="w-full rounded-lg border border-border bg-background text-primary px-3 py-2 text-sm"
        >
          <option value="all">All status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <div className="overflow-x-auto rounded-[28px] border border-border bg-surface shadow-[0_16px_40px_rgba(26,83,92,0.05)]">
        <table className="w-full text-left whitespace-nowrap">
          <thead className="border-b border-border bg-background/50">
            <tr>
              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-muted">Product</th>
              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-muted">Category</th>
              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-muted">Price</th>
              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-muted">Stock</th>
              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-muted">Status</th>
              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-muted">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <ProductRow key={String(product._id)} product={product} categories={categories} />
            ))}

            {filteredProducts.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-sm text-secondary">
                  No products match the selected filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
