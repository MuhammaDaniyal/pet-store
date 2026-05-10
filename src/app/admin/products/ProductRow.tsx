"use client";

import React, { useState } from "react";

export default function ProductRow({ product, categories }: { product: any; categories: any[] }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Delete this product?")) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/products/${product._id}`, { method: "DELETE" });
      if (res.ok) window.location.reload();
      else alert("Failed to delete");
    } catch (err) {
      console.error(err);
      alert("Error deleting product");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <tr className="border-b border-border/50 hover:bg-surface/50 transition-colors">
        <td className="px-5 py-4 text-sm">
          <div className="flex items-center gap-3">
            <img src={(product.images && product.images[0]) || ""} alt="thumb" className="h-12 w-12 rounded object-cover" />
            <div>
              <div className="font-medium text-primary">{product.name}</div>
              <div className="text-xs text-secondary line-clamp-1">{product.description}</div>
            </div>
          </div>
        </td>
        <td className="px-5 py-4 text-sm text-secondary">{product.category?.name || "-"}</td>
        <td className="px-5 py-4 text-sm text-secondary">${product.price?.toFixed?.(2) ?? product.price}</td>
        <td className="px-5 py-4 text-sm text-secondary">{product.stock ?? 0}</td>
        <td className="px-5 py-4 text-sm">
          <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-xs font-semibold ${product.isActive ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-amber-50 text-amber-700 border border-amber-200"}`}>
            {product.isActive ? "Active" : "Inactive"}
          </span>
        </td>
        <td className="px-5 py-4 text-sm">
          <div className="flex items-center gap-2">
            <button onClick={() => setIsEditing((v) => !v)} className="rounded-lg border border-border bg-surface px-3 py-1 text-sm">Edit</button>
            <button onClick={handleDelete} disabled={isDeleting} className="rounded-lg border border-red-200 bg-red-50 px-3 py-1 text-sm text-red-700">
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </td>
      </tr>
      {isEditing && (
        <tr>
          <td colSpan={6} className="px-5 py-6 bg-background/40">
            <div className="max-w-3xl">
              {/* Lazy load the form for editing */}
              <React.Suspense fallback={<div>Loading editor...</div>}>
                {/* @ts-ignore */}
                <ProductEditor product={product} categories={categories} onDone={() => window.location.reload()} />
              </React.Suspense>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

function ProductEditor(props: any) {
  // Inline dynamic import to avoid server-side usage
  const Form = require("@/components/admin/ProductForm").default;
  return <Form initialProduct={props.product} categories={props.categories} onSuccess={props.onDone} />;
}
