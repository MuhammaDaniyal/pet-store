"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AlertCircle, Heart, Loader2, ShoppingCart, CheckCircle2 } from "lucide-react";

import { formatMoney } from "@/lib/money";

export interface ShopProductCategory {
  name: string;
  slug?: string;
}

export interface ShopProduct {
  id: string;
  name: string;
  slug?: string;
  price: number;
  images: string[];
  animalType: string;
  category?: ShopProductCategory | null;
  isFeatured?: boolean;
}

interface ProductCardProps {
  product: ShopProduct;
  initialWishlisted: boolean;
  isLoggedIn: boolean;
}

export function ProductCard({ product, initialWishlisted, isLoggedIn }: ProductCardProps) {
  const router = useRouter();
  const [wishlisted, setWishlisted] = useState(initialWishlisted);
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);
  const [isCartLoading, setIsCartLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ tone: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    setWishlisted(initialWishlisted);
  }, [initialWishlisted]);

  useEffect(() => {
    if (!feedback) {
      return;
    }

    const timer = window.setTimeout(() => setFeedback(null), 1800);
    return () => window.clearTimeout(timer);
  }, [feedback]);

  async function handleAddToCart() {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    setIsCartLoading(true);

    try {
      const response = await fetch("/api/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id, quantity: 1 }),
      });

      const data = (await response.json()) as { message?: string };

      if (response.status === 401) {
        router.push("/login");
        return;
      }

      if (!response.ok) {
        throw new Error(data.message ?? "Unable to add item to cart.");
      }

      setFeedback({ tone: "success", message: "Added to cart." });
    } catch (error) {
      setFeedback({ tone: "error", message: error instanceof Error ? error.message : "Unable to add item to cart." });
    } finally {
      setIsCartLoading(false);
    }
  }

  async function handleToggleWishlist() {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    const previousState = wishlisted;
    setWishlisted((current) => !current);
    setIsWishlistLoading(true);

    try {
      const response = await fetch("/api/wishlist/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id }),
      });

      const data = (await response.json()) as { wishlisted?: boolean; message?: string };

      if (response.status === 401) {
        router.push("/login");
        return;
      }

      if (!response.ok || typeof data.wishlisted !== "boolean") {
        throw new Error(data.message ?? "Unable to update wishlist.");
      }

      setWishlisted(data.wishlisted);
      setFeedback({ tone: "success", message: data.wishlisted ? "Saved to wishlist." : "Removed from wishlist." });
    } catch (error) {
      setWishlisted(previousState);
      setFeedback({ tone: "error", message: error instanceof Error ? error.message : "Unable to update wishlist." });
    } finally {
      setIsWishlistLoading(false);
    }
  }

  const image = product.images?.[0];

  return (
    <article className="group relative overflow-hidden rounded-[28px] border border-border bg-surface shadow-[0_16px_40px_rgba(26,83,92,0.05)] transition-transform hover:-translate-y-1">
      {feedback ? (
        <div
          className={`absolute right-4 top-4 z-20 inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-semibold shadow-md ${
            feedback.tone === "success"
              ? "bg-[#EAF7EF] text-[#1E6B45]"
              : "bg-[#FFE8E5] text-[#B91C1C]"
          }`}
        >
          {feedback.tone === "success" ? (
            <CheckCircle2 className="h-3.5 w-3.5" />
          ) : (
            <AlertCircle className="h-3.5 w-3.5" />
          )}
          {feedback.message}
        </div>
      ) : null}

      <Link href={`/shop/${product.id}`} className="block">
        <div className="relative aspect-square sm:aspect-video md:aspect-4/3 overflow-hidden bg-background">
          {image ? (
            <img
              src={image}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-5xl">🐾</div>
          )}

          {product.isFeatured ? (
            <span className="absolute left-4 top-4 rounded-full border border-accent/20 bg-accent/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-white shadow-[0_12px_25px_rgba(255,107,53,0.2)]">
              Featured
            </span>
          ) : null}
        </div>

        <div className="space-y-1.5 p-3 md:p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[9px] md:text-[10px] font-semibold uppercase tracking-[0.3em] text-muted">
                {product.category?.name ?? product.animalType}
              </p>
              <h3 className="mt-1 md:mt-2 text-sm md:text-lg font-semibold leading-snug text-primary">{product.name}</h3>
            </div>

            <p className="shrink-0 text-sm md:text-base font-semibold text-primary">{formatMoney(product.price)}</p>
          </div>

          <p className="text-[10px] md:text-sm leading-relaxed text-secondary capitalize">
            {product.animalType.replaceAll("-", " ")}
          </p>
        </div>
      </Link>

      <div className="flex gap-2 md:gap-3 border-t border-border p-2.5 md:p-4">
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={isCartLoading}
          className="inline-flex flex-1 items-center justify-center gap-1.5 md:gap-2 rounded-full bg-accent px-3 md:px-4 py-1.5 md:py-2.5 text-xs md:text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isCartLoading ? <Loader2 className="h-3.5 w-3.5 md:h-4 md:w-4 animate-spin" /> : <ShoppingCart className="h-3.5 w-3.5 md:h-4 md:w-4" />}
          {isCartLoading ? "Adding..." : "Add to Cart"}
        </button>

        <button
          type="button"
          onClick={handleToggleWishlist}
          disabled={isWishlistLoading}
          aria-pressed={wishlisted}
          className={`inline-flex items-center justify-center rounded-full border px-3 md:px-4 py-1.5 md:py-2.5 transition-colors disabled:cursor-not-allowed disabled:opacity-70 ${
            wishlisted
              ? "border-[#F6B0B0] bg-[#FFF1F1] text-[#C62828]"
              : "border-border bg-background text-primary hover:border-accent/30 hover:bg-accent/10"
          }`}
        >
          {isWishlistLoading ? (
            <Loader2 className="h-3.5 w-3.5 md:h-4 md:w-4 animate-spin" />
          ) : (
            <Heart className={`h-3.5 w-3.5 md:h-4 md:w-4 ${wishlisted ? "fill-current" : ""}`} />
          )}
        </button>
      </div>
    </article>
  );
}
