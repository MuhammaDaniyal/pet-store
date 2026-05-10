"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Heart, AlertTriangle, LayoutGrid, ListTree, ShoppingCart, Loader2, ArrowUpDown, SlidersHorizontal } from "lucide-react";
import Image from "next/image";
import { SortPanel } from "@/components/shop/SortPanel";
import { FilterPanel, type FilterState } from "@/components/shop/FilterPanel";

type CategoryItem = {
  _id: string;
  name: string;
};

type ProductItem = {
  _id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  isFeatured: boolean;
  category: CategoryItem;
};

interface ShopClientProps {
  initialProducts: ProductItem[];
}

export default function ShopClient({ initialProducts }: ShopClientProps) {
  // State to toggle between flat grid and grouped views
  const [isGrouped, setIsGrouped] = useState(true);
  const [wishlistedIds, setWishlistedIds] = useState<Set<string>>(new Set());
  const [loadingCart, setLoadingCart] = useState<string | null>(null);
  const [loadingWishlist, setLoadingWishlist] = useState<string | null>(null);

  const [isSortExpanded, setIsSortExpanded] = useState(false);
  const [sortBy, setSortBy] = useState("none");

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({ categories: [], prices: [] });

  const sortProducts = (products: ProductItem[]) => {
    if (sortBy === "none") return products;
    return [...products].sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });
  };

  const getFilteredAndSortedProducts = () => {
    let result = [...initialProducts];

    // Filter by Category
    if (filters.categories.length > 0) {
      result = result.filter((p) => filters.categories.includes(p.category.name));
    }

    // Filter by Price
    if (filters.prices.length > 0) {
      result = result.filter((p) => {
        return filters.prices.some((priceRange) => {
          if (priceRange === "under-50") return p.price < 5000;
          if (priceRange === "50-200") return p.price >= 5000 && p.price <= 20000;
          if (priceRange === "200-800") return p.price > 20000 && p.price <= 80000;
          if (priceRange === "over-800") return p.price > 80000;
          return false;
        });
      });
    }

    return sortProducts(result);
  };

  const filteredAndSortedProducts = getFilteredAndSortedProducts();

  // Group products by category name
  const groupedProducts = filteredAndSortedProducts.reduce((acc, product) => {
    const catName = product.category.name;
    if (!acc[catName]) acc[catName] = [];
    acc[catName].push(product);
    return acc;
  }, {} as Record<string, ProductItem[]>);

  const handleAddToCart = async (e: React.MouseEvent, productId: string) => {
    e.preventDefault();
    setLoadingCart(productId);
    try {
      const res = await fetch("/api/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity: 1 }),
      });
      
      if (res.status === 401) {
        window.location.href = "/login";
        return;
      }
      
      if (!res.ok) {
        const data = await res.json();
        alert(data.message || "Failed to add to cart");
        return;
      }
      
      alert("Added to cart!");
    } catch (error) {
      console.error("Add to cart error:", error);
      alert("Something went wrong");
    } finally {
      setLoadingCart(null);
    }
  };

  const handleToggleWishlist = async (e: React.MouseEvent, productId: string) => {
    e.preventDefault();
    setLoadingWishlist(productId);
    try {
      const res = await fetch("/api/wishlist/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });
      
      if (res.status === 401) {
        window.location.href = "/login";
        return;
      }
      
      if (!res.ok) {
        const data = await res.json();
        alert(data.message || "Failed to update wishlist");
        return;
      }
      
      const data = await res.json();
      setWishlistedIds((prev) => {
        const newSet = new Set(prev);
        if (data.wishlisted) {
          newSet.add(productId);
        } else {
          newSet.delete(productId);
        }
        return newSet;
      });
    } catch (error) {
      console.error("Wishlist toggle error:", error);
      alert("Something went wrong");
    } finally {
      setLoadingWishlist(null);
    }
  };

  // The individual Card Component
  const ProductCard = ({ p }: { p: ProductItem }) => {
    const price = typeof p.price === "number" ? (p.price / 100).toFixed(2) : "0.00";
    const isWishlisted = wishlistedIds.has(p._id);
    const isCartLoading = loadingCart === p._id;
    const isWishlistLoading = loadingWishlist === p._id;

    return (
      <div className="h-full">
        <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border/50 bg-card text-card-foreground transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:hover:shadow-primary/10">
          
          {/* Image Header container */}
          <div className="relative h-56 w-full bg-muted/50">
            {p.images && p.images.length > 0 ? (
              <Image
                src={p.images[0]}
                alt={p.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-4xl">🐾</div>
            )}

            {/* Badges */}
            {p.isFeatured && (
              <span className="absolute left-3 top-3 rounded bg-[#fce075] px-2.5 py-1 text-xs font-medium text-amber-900 shadow-sm">
                Best Seller
              </span>
            )}
            
            {/* Heart Icon */}
            <button 
              className={`absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full transition-colors shadow-sm ${
                isWishlisted
                  ? "bg-red-100 text-red-500 dark:bg-red-950/50"
                  : "bg-background/90 hover:bg-red-50 hover:text-red-500 dark:bg-background/50 dark:hover:bg-background/90"
              }`}
              onClick={(e) => handleToggleWishlist(e, p._id)}
              disabled={isWishlistLoading}
            >
              {isWishlistLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Heart className={`h-4 w-4 ${isWishlisted ? "fill-current" : ""}`} />
              )}
            </button>
          </div>

          {/* Card Body */}
          <div className="flex flex-1 flex-col p-4">
            <Link href={`/shop/${p._id}`} className="block hover:underline">
              <h3 className="text-lg font-serif text-primary">{p.name}</h3>
            </Link>
            <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">{p.description}</p>
            <div className="mt-auto pt-4">
              <span className="text-lg font-bold text-[#e76f51] dark:text-[#f4a261]">${price}</span>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={(e) => handleAddToCart(e, p._id)}
              disabled={isCartLoading}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCartLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <ShoppingCart className="h-4 w-4" />
                  Add to Cart
                </>
              )}
            </button>
          </div>
        </article>
      </div>
    );
  };

  return (
    <main className="mx-auto max-w-7xl px-6 py-10 min-h-screen">
      
      {/* Header & Toggle Button */}
      <div className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="text-4xl font-bold font-serif text-primary">Shop</h1>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center gap-2 rounded-full border border-primary/20 bg-background px-5 py-2.5 text-sm font-medium text-primary shadow-sm transition-colors hover:bg-primary/5 dark:border-primary/30 dark:hover:bg-primary/10"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </button>

          <button
            onClick={() => setIsSortExpanded(!isSortExpanded)}
            className="flex items-center gap-2 rounded-full border border-primary/20 bg-background px-5 py-2.5 text-sm font-medium text-primary shadow-sm transition-colors hover:bg-primary/5 dark:border-primary/30 dark:hover:bg-primary/10"
          >
            <ArrowUpDown className="h-4 w-4" />
            Sort
          </button>

          <button
            onClick={() => setIsGrouped(!isGrouped)}
            className="flex items-center gap-2 rounded-full border border-primary/20 bg-background px-5 py-2.5 text-sm font-medium text-primary shadow-sm transition-colors hover:bg-primary/5 dark:border-primary/30 dark:hover:bg-primary/10"
          >
            {isGrouped ? (
              <>
                <LayoutGrid className="h-4 w-4" />
                View All Pets
              </>
            ) : (
              <>
                <ListTree className="h-4 w-4" />
                Group by Category
              </>
            )}
          </button>
        </div>
      </div>

      <SortPanel
        sortBy={sortBy}
        setSortBy={setSortBy}
        isExpanded={isSortExpanded}
      />

      <FilterPanel
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filters={filters}
        setFilters={setFilters}
      />

      {/* RENDER LOGIC */}
      {isGrouped ? (
        <div className="space-y-16">
          {Object.entries(groupedProducts).map(([categoryName, items]) => (
            <section key={categoryName}>
              
              {/* Category Header */}
              <div className="mb-6 rounded-xl bg-[#f8f9eb]/80 dark:bg-primary/5 px-6 py-4 shadow-sm">
                <h2 className="text-2xl font-serif text-primary">
                  {categoryName} <span className="text-sm font-sans font-normal text-muted-foreground">({items.length} items)</span>
                </h2>
              </div>

              {/* SPECIAL WILD PETS WARNING BANNER */}
              {(categoryName.toLowerCase() === "wild pets" || categoryName === "Wild Pets") && (
                <div className="mb-6 flex items-center gap-3 rounded-md border border-amber-200 bg-[#fff9e6] px-5 py-4 text-sm text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-200 shadow-sm">
                  <AlertTriangle className="h-5 w-5 shrink-0 text-amber-500" />
                  <p>Exotic pets may require special permits in your area. Please check local regulations.</p>
                </div>
              )}

              {/* Category Grid */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {items.map((p) => (
                  <ProductCard key={p._id} p={p} />
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        /* Flat Grid View */
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredAndSortedProducts.map((p) => (
            <ProductCard key={p._id} p={p} />
          ))}
        </div>
      )}
    </main>
  );
}