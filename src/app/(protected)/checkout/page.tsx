"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";

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

interface CheckoutFieldErrors {
  fullName?: string;
  phone?: string;
  street?: string;
  city?: string;
  province?: string;
  postalCode?: string;
  form?: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState<CartDocument | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<CheckoutFieldErrors>({});
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    street: "",
    city: "",
    province: "",
    postalCode: "",
  });

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

  function validateForm() {
    const nextErrors: CheckoutFieldErrors = {};

    if (!form.fullName.trim()) nextErrors.fullName = "Full name is required.";
    if (!form.phone.trim()) nextErrors.phone = "Phone number is required.";
    if (!form.street.trim()) nextErrors.street = "Street address is required.";
    if (!form.city.trim()) nextErrors.city = "City is required.";
    if (!form.province.trim()) nextErrors.province = "Province is required.";
    if (!form.postalCode.trim()) nextErrors.postalCode = "Postal code is required.";

    setFieldErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/orders/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address: form,
        }),
      });

      const data = (await response.json()) as { message?: string; orderId?: string; fieldErrors?: CheckoutFieldErrors };

      if (!response.ok) {
        if (data.fieldErrors) {
          setFieldErrors(data.fieldErrors);
        }
        throw new Error(data.message ?? "Unable to place order.");
      }

      setCart({ items: [] });
      router.push(`/orders/success?orderId=${data.orderId ?? ""}`);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unable to place order.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return <CheckoutSkeleton />;
  }

  if (error && !cart) {
    return <ErrorState message={error} />;
  }

  if (!cart || cart.items.length === 0) {
    return <EmptyState />;
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center gap-3">
        <CheckCircle2 className="h-6 w-6 text-accent" />
        <div>
          <h1 className="text-3xl font-semibold text-primary">Checkout</h1>
          <p className="text-sm text-secondary">Review your delivery details and place the order.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_360px]">
        <section className="rounded-[28px] border border-border bg-surface p-6 shadow-[0_16px_40px_rgba(26,83,92,0.05)]">
          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-muted">Delivery form</p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <Field
              label="Full Name"
              value={form.fullName}
              error={fieldErrors.fullName}
              onChange={(value) => setForm((current) => ({ ...current, fullName: value }))}
            />
            <Field
              label="Phone Number"
              value={form.phone}
              error={fieldErrors.phone}
              onChange={(value) => setForm((current) => ({ ...current, phone: value }))}
            />
            <Field
              label="Street Address"
              value={form.street}
              error={fieldErrors.street}
              onChange={(value) => setForm((current) => ({ ...current, street: value }))}
              className="sm:col-span-2"
            />
            <Field
              label="City"
              value={form.city}
              error={fieldErrors.city}
              onChange={(value) => setForm((current) => ({ ...current, city: value }))}
            />
            <Field
              label="Province"
              value={form.province}
              error={fieldErrors.province}
              onChange={(value) => setForm((current) => ({ ...current, province: value }))}
            />
            <Field
              label="Postal Code"
              value={form.postalCode}
              error={fieldErrors.postalCode}
              onChange={(value) => setForm((current) => ({ ...current, postalCode: value }))}
            />
          </div>

          <div className="mt-6 rounded-2xl border border-border bg-background/70 p-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-muted">Payment method</p>
            <div className="mt-2 flex items-center gap-3 text-sm font-medium text-primary">
              <span className="inline-flex rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
                Cash on Delivery
              </span>
              <span>Cash on Delivery only</span>
            </div>
          </div>

          {fieldErrors.form ? <p className="mt-4 text-sm text-error">{fieldErrors.form}</p> : null}
          {error ? <p className="mt-4 text-sm text-error">{error}</p> : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {isSubmitting ? "Placing order..." : "Place Order"}
          </button>
        </section>

        <aside className="h-fit rounded-[28px] border border-border bg-surface p-5 shadow-[0_16px_40px_rgba(26,83,92,0.05)] lg:sticky lg:top-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-muted">Order summary</p>

          <div className="mt-5 space-y-4">
            {cart.items.map((item) => {
              const image = item.product.images?.[0];
              const lineTotal = item.product.price * item.quantity;

              return (
                <div key={item.product._id} className="flex gap-3 rounded-2xl border border-border bg-background/70 p-3">
                  <div className="h-16 w-16 overflow-hidden rounded-2xl bg-surface">
                    {image ? (
                      <img src={image} alt={item.product.name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-2xl">🐾</div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-primary">{item.product.name}</p>
                    <p className="text-xs text-secondary">Qty {item.quantity}</p>
                    <p className="mt-1 text-sm font-semibold text-primary">{formatMoney(lineTotal)}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-5 space-y-3 border-t border-border pt-4 text-sm text-secondary">
            <div className="flex items-center justify-between">
              <span>Subtotal</span>
              <span className="font-semibold text-primary">{formatMoney(subtotal)}</span>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <span className="text-sm font-semibold text-primary">Total</span>
            <span className="text-2xl font-semibold text-primary">{formatMoney(subtotal)}</span>
          </div>

          <Link
            href="/cart"
            className="mt-6 inline-flex w-full items-center justify-center rounded-full border border-border bg-background px-5 py-3 text-sm font-semibold text-primary transition-colors hover:border-accent/30 hover:bg-accent/10"
          >
            Back to Cart
          </Link>
        </aside>
      </form>
    </main>
  );
}

function Field({
  label,
  value,
  error,
  onChange,
  className,
}: {
  label: string;
  value: string;
  error?: string;
  onChange: (value: string) => void;
  className?: string;
}) {
  return (
    <label className={`space-y-2 ${className ?? ""}`}>
      <span className="text-sm font-medium text-primary">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-primary placeholder:text-muted focus:border-accent focus:outline-none"
      />
      {error ? <p className="text-sm text-error">{error}</p> : null}
    </label>
  );
}

function CheckoutSkeleton() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-6 h-10 w-56 animate-pulse rounded-2xl bg-border/40" />
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_360px]">
        <div className="h-140 animate-pulse rounded-[28px] bg-border/30" />
        <div className="h-140 animate-pulse rounded-[28px] bg-border/30" />
      </div>
    </main>
  );
}

function EmptyState() {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-3xl items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
      <div className="rounded-[32px] border border-border bg-surface p-8 text-center shadow-[0_16px_40px_rgba(26,83,92,0.05)]">
        <h1 className="text-2xl font-semibold text-primary">No items ready for checkout</h1>
        <p className="mt-3 text-sm leading-relaxed text-secondary">
          Add products to your cart before placing an order.
        </p>
        <Link
          href="/shop"
          className="mt-6 inline-flex items-center justify-center rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
        >
          Back to Shop
        </Link>
      </div>
    </main>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-3xl items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
      <div className="rounded-[32px] border border-border bg-surface p-8 text-center shadow-[0_16px_40px_rgba(26,83,92,0.05)]">
        <h1 className="text-2xl font-semibold text-primary">Unable to load checkout</h1>
        <p className="mt-3 text-sm leading-relaxed text-secondary">{message}</p>
        <Link
          href="/cart"
          className="mt-6 inline-flex items-center justify-center rounded-full border border-border bg-background px-5 py-3 text-sm font-semibold text-primary transition-colors hover:border-accent/30 hover:bg-accent/10"
        >
          Back to Cart
        </Link>
      </div>
    </main>
  );
}
