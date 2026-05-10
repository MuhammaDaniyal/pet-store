"use client";

import React, { useState } from "react";
import { Loader2 } from "lucide-react";

type CategoryOption = { _id: string; name: string };

type ProductLike = {
  _id: string;
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  images?: string[];
  isActive?: boolean;
  category?: { _id?: string } | string;
};

type ProductFormProps = {
  categories: CategoryOption[];
  initialProduct?: ProductLike | null;
  onSuccess?: (product?: ProductLike) => void;
};

type ProductFormState = {
  name: string;
  description: string;
  price: string;
  category: string;
  stock: string;
  imageUrl: string;
  isActive: boolean;
};

export default function ProductForm({ categories, initialProduct = null, onSuccess = () => {} }: ProductFormProps) {
  const emptyForm = {
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    imageUrl: "",
    isActive: true,
  };

  const [form, setForm] = useState<ProductFormState>(() => {
    if (!initialProduct) return emptyForm;
    return {
      name: initialProduct.name || "",
      description: initialProduct.description || "",
      price: String(initialProduct.price ?? ""),
      category:
        typeof initialProduct.category === "string"
          ? initialProduct.category
          : initialProduct.category?._id || "",
      stock: String(initialProduct.stock ?? ""),
      imageUrl: initialProduct.images?.[0] || "",
      isActive: initialProduct.isActive ?? true,
    };
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const target = e.target;
    const field = target.name as keyof ProductFormState;

    if (target instanceof HTMLInputElement && target.type === "checkbox") {
      setForm((prev) => ({ ...prev, [field]: target.checked }));
      return;
    }

    setForm((prev) => ({ ...prev, [field]: target.value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        name: form.name,
        description: form.description,
        price: Number(form.price),
        category: form.category,
        stock: Number(form.stock),
        images: form.imageUrl ? [form.imageUrl] : [],
        isActive: !!form.isActive,
      };

      const method = initialProduct ? "PATCH" : "POST";
      const url = initialProduct ? `/api/admin/products/${initialProduct._id}` : `/api/admin/products`;

      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!res.ok) {
        const data = await res.json();
        alert(data.message || "Failed");
      } else {
        const data = await res.json();
        if (!initialProduct) {
          setForm(emptyForm);
        }
        onSuccess(data?.product);
      }
    } catch (err) {
      console.error(err);
      alert("Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
      <div>
        <label className="block text-sm font-medium text-primary">Name</label>
        <input name="name" value={form.name} onChange={handleChange} className="mt-2 w-full rounded-lg border border-border bg-background text-primary px-3 py-2" />
      </div>

      <div>
        <label className="block text-sm font-medium text-primary">Category</label>
        <select name="category" value={form.category} onChange={handleChange} className="mt-2 w-full rounded-lg border border-border bg-background text-primary px-3 py-2">
          <option value="">Select</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>{c.name}</option>
          ))}
        </select>
      </div>

      <div className="sm:col-span-2">
        <label className="block text-sm font-medium text-primary">Description</label>
        <textarea name="description" value={form.description} onChange={handleChange} className="mt-2 w-full rounded-lg border border-border bg-background text-primary px-3 py-2" rows={3} />
      </div>

      <div>
        <label className="block text-sm font-medium text-primary">Price</label>
        <input name="price" type="number" step="0.01" value={form.price} onChange={handleChange} className="mt-2 w-full rounded-lg border border-border bg-background text-primary px-3 py-2" />
      </div>

      <div>
        <label className="block text-sm font-medium text-primary">Stock</label>
        <input name="stock" type="number" value={form.stock} onChange={handleChange} className="mt-2 w-full rounded-lg border border-border bg-background text-primary px-3 py-2" />
      </div>

      <div>
        <label className="block text-sm font-medium text-primary">Image URL</label>
        <input name="imageUrl" type="url" value={form.imageUrl} onChange={handleChange} className="mt-2 w-full rounded-lg border border-border bg-background text-primary px-3 py-2" />
        {form.imageUrl && (
          <img src={form.imageUrl} alt="preview" className="mt-2 h-20 w-20 rounded object-cover" />
        )}
      </div>

      <div className="flex items-center gap-3">
        <label className="flex items-center gap-2">
          <input name="isActive" type="checkbox" checked={form.isActive} onChange={handleChange} />
          <span className="text-sm text-secondary">Active</span>
        </label>
      </div>

      <div className="sm:col-span-2 flex gap-3">
        <button type="submit" disabled={loading} className="rounded-lg bg-accent px-4 py-2 text-white font-semibold">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : (initialProduct ? "Save" : "Add product")}
        </button>
      </div>
    </form>
  );
}
