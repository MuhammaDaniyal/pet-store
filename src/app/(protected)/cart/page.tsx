"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Minus, Plus, ShoppingCart, Trash2, Loader2, ArrowRight } from "lucide-react";

import { formatMoney } from "@/lib/money";

interface CartProductCategory {
  name?: string;
  slug?: string;
}

interface CartProduct {
  _id: string;
  name: string;
  price: number;
  images?: string[];
  animalType?: string;
  category?: CartProductCategory | null;
}

interface CartItem {
  _id?: string;
  product: CartProduct;
  quantity: number;
}

interface CartDocument {
  items: CartItem[];
}

interface CartResponse {
  cart: CartDocument;
}

export default function CartPage() {
  const [cart, setCart] = useState<CartDocument | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [savingIds, setSavingIds] = useState<Record<string, boolean>>({});

  useEffect(() => {
    let mounted = true;

    async function loadCart() {
      setIsLoading(true);
      setError("");

      try {
        const response = await fetch("/api/cart", { cache: "no-store" });
        const data = (await response.json()) as Partial<CartResponse> & { message?: string };

        if (!response.ok) {
          throw new Error(data.message ?? "Unable to fetch cart.");
        }

        if (mounted) {
          setCart(data.cart ?? { items: [] });
        }
      } catch (loadError) {
        if (mounted) {
          setError(loadError instanceof Error ? loadError.message : "Unable to fetch cart.");
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    loadCart();

    return () => {
      mounted = false;
    };
  }, []);

  const subtotal = useMemo(
    () => cart?.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0) ?? 0,
    [cart],
  );

  async function updateQuantity(productId: string, nextQuantity: number) {
    if (!cart) return;

    const previousCart = cart;
    const nextItems = cart.items
      .map((item) =>
        item.product._id === productId
          ? {
              ...item,
              quantity: nextQuantity,
            }
          : item,
      )
      .filter((item) => item.quantity > 0);

    setCart({ items: nextItems });
    setSavingIds((current) => ({ ...current, [productId]: true }));

    try {
      const response = await fetch("/api/cart/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity: nextQuantity }),
      });

      const data = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(data.message ?? "Unable to update item quantity.");
      }
    } catch (updateError) {
      setCart(previousCart);
      setError(updateError instanceof Error ? updateError.message : "Unable to update item quantity.");
    } finally {
      setSavingIds((current) => {
        const clone = { ...current };
        delete clone[productId];
        return clone;
      });
    }
  }

  async function removeItem(productId: string) {
    if (!cart) return;

    const previousCart = cart;
    setCart({ items: cart.items.filter((item) => item.product._id !== productId) });
    setSavingIds((current) => ({ ...current, [productId]: true }));

    try {
      const response = await fetch("/api/cart/remove", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });

      const data = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(data.message ?? "Unable to remove item.");
      }
    } catch (removeError) {
      setCart(previousCart);
      setError(removeError instanceof Error ? removeError.message : "Unable to remove item.");
    } finally {
      setSavingIds((current) => {
        const clone = { ...current };
        delete clone[productId];
        return clone;
      });
    }
  }

  if (isLoading) {
    return <CartSkeleton />;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  if (!cart || cart.items.length === 0) {
    return <EmptyState />;
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center gap-3">
        <ShoppingCart className="h-6 w-6 text-accent" />
        <div>
          <h1 className="text-3xl font-semibold text-primary">Your Cart</h1>
          <p className="text-sm text-secondary">Review items before you continue to checkout.</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_360px]">
        <section className="space-y-4">
          {cart.items.map((item) => {
            const productId = item.product._id;
            const lineTotal = item.product.price * item.quantity;
            const image = item.product.images?.[0];

            return (
              <article key={productId} className="rounded-[28px] border border-border bg-surface p-4 shadow-[0_16px_40px_rgba(26,83,92,0.05)]">
                <div className="flex flex-col gap-4 sm:flex-row">
                  <div className="h-28 w-full overflow-hidden rounded-2xl bg-background sm:h-24 sm:w-24 sm:shrink-0">
                    {image ? (
                      <img src={image} alt={item.product.name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-3xl">🐾</div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-muted">
                          {item.product.category?.name ?? item.product.animalType ?? "Product"}
                        </p>
                        <h2 className="mt-2 text-lg font-semibold text-primary">{item.product.name}</h2>
                        <p className="mt-1 text-sm text-secondary">Unit price: {formatMoney(item.product.price)}</p>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeItem(productId)}
                        disabled={Boolean(savingIds[productId])}
                        className="inline-flex items-center gap-2 self-start rounded-full border border-border bg-background px-3 py-2 text-sm font-medium text-primary transition-colors hover:border-accent/30 hover:bg-accent/10 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <Trash2 className="h-4 w-4 text-accent" />
                        Remove
                      </button>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center gap-3">
                      <div className="inline-flex items-center rounded-full border border-border bg-background">
                        <button
                          type="button"
                          onClick={() => updateQuantity(productId, Math.max(1, item.quantity - 1))}
                          disabled={item.quantity <= 1 || Boolean(savingIds[productId])}
                          className="px-3 py-2 text-primary transition-colors hover:bg-accent/10 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="min-w-12 px-4 py-2 text-center text-sm font-semibold text-primary">
                          {savingIds[productId] ? <Loader2 className="mx-auto h-4 w-4 animate-spin text-accent" /> : item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(productId, item.quantity + 1)}
                          disabled={Boolean(savingIds[productId])}
                          className="px-3 py-2 text-primary transition-colors hover:bg-accent/10 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>

                      <p className="text-sm text-secondary">
                        Line total: <span className="font-semibold text-primary">{formatMoney(lineTotal)}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </section>

        <aside className="h-fit rounded-[28px] border border-border bg-surface p-5 shadow-[0_16px_40px_rgba(26,83,92,0.05)] lg:sticky lg:top-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-muted">Order summary</p>
          <div className="mt-4 space-y-3 border-b border-border pb-4 text-sm text-secondary">
            <div className="flex items-center justify-between">
              <span>Subtotal</span>
              <span className="font-semibold text-primary">{formatMoney(subtotal)}</span>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <span className="text-sm font-semibold text-primary">Total</span>
            <span className="text-2xl font-semibold text-primary">{formatMoney(subtotal)}</span>
          </div>

          <div className="mt-6 space-y-3">
            <Link
              href="/checkout"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
            >
              Proceed to Checkout
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/shop"
              className="inline-flex w-full items-center justify-center rounded-full border border-border bg-background px-5 py-3 text-sm font-semibold text-primary transition-colors hover:border-accent/30 hover:bg-accent/10"
            >
              Continue Shopping
            </Link>
          </div>
        </aside>
      </div>
    </main>
  );
}

function CartSkeleton() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-6 h-10 w-56 animate-pulse rounded-2xl bg-border/40" />
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_360px]">
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="h-40 animate-pulse rounded-[28px] bg-border/30" />
          ))}
        </div>
        <div className="h-80 animate-pulse rounded-[28px] bg-border/30" />
      </div>
    </main>
  );
}

function EmptyState() {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-3xl items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
      <div className="rounded-[32px] border border-border bg-surface p-8 text-center shadow-[0_16px_40px_rgba(26,83,92,0.05)]">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-accent/10 text-3xl">
          🛒
        </div>
        <h1 className="mt-5 text-2xl font-semibold text-primary">Your cart is empty</h1>
        <p className="mt-3 text-sm leading-relaxed text-secondary">
          Add a few products from the shop and they will appear here.
        </p>
        <Link
          href="/shop"
          className="mt-6 inline-flex items-center justify-center rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
        >
          Go to Shop
        </Link>
      </div>
    </main>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-3xl items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
      <div className="rounded-[32px] border border-border bg-surface p-8 text-center shadow-[0_16px_40px_rgba(26,83,92,0.05)]">
        <h1 className="text-2xl font-semibold text-primary">Unable to load cart</h1>
        <p className="mt-3 text-sm leading-relaxed text-secondary">{message}</p>
        <Link
          href="/shop"
          className="mt-6 inline-flex items-center justify-center rounded-full border border-border bg-background px-5 py-3 text-sm font-semibold text-primary transition-colors hover:border-accent/30 hover:bg-accent/10"
        >
          Continue Shopping
        </Link>
      </div>
    </main>
  );
}
