"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Package, ArrowRight, Clock3, Truck, Loader2 } from "lucide-react";
import { formatMoney } from "@/lib/money";

interface OrderItem {
  product: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface OrderAddress {
  fullName: string;
  phone: string;
  street: string;
  city: string;
  province: string;
  postalCode: string;
}

interface Order {
  _id: string;
  items: OrderItem[];
  total: number;
  status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";
  address: OrderAddress;
  paymentMethod: string;
  createdAt: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancelingOrderId, setCancelingOrderId] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadOrders() {
      setIsLoading(true);
      setError("");

      try {
        const response = await fetch("/api/orders", { cache: "no-store" });
        const data = (await response.json()) as { orders?: Order[]; message?: string };

        if (!response.ok) {
          throw new Error(data.message ?? "Unable to fetch orders.");
        }

        if (mounted) {
          setOrders(data.orders ?? []);
        }
      } catch (loadError) {
        if (mounted) {
          setError(loadError instanceof Error ? loadError.message : "Unable to fetch orders.");
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    loadOrders();

    return () => {
      mounted = false;
    };
  }, []);

  const getStatusBadgeColor = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  async function handleCancelOrder(orderId: string) {
    if (!confirm("Are you sure you want to cancel this order?")) {
      return;
    }

    setCancelingOrderId(orderId);
    setError("");

    try {
      const response = await fetch(`/api/orders/${orderId}/cancel`, {
        method: "POST",
      });

      const data = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(data.message ?? "Unable to cancel order.");
      }

      // Refetch orders after cancellation
      const ordersResponse = await fetch("/api/orders", { cache: "no-store" });
      const ordersData = (await ordersResponse.json()) as { orders?: Order[] };

      if (ordersResponse.ok) {
        setOrders(ordersData.orders ?? []);
      }
    } catch (cancelError) {
      setError(cancelError instanceof Error ? cancelError.message : "Unable to cancel order.");
    } finally {
      setCancelingOrderId(null);
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[32px] border border-border bg-surface p-6 shadow-[0_20px_60px_rgba(26,83,92,0.06)] sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-muted">
              Orders
            </p>
            <h1 className="mt-2 text-[clamp(1.8rem,3vw,2.6rem)] font-semibold tracking-[-0.04em] text-primary">
              Order history and tracking
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-secondary sm:text-base">
              {orders.length === 0
                ? "No orders yet. Start shopping to see your order history here."
                : `You have ${orders.length} order${orders.length !== 1 ? "s" : ""}.`}
            </p>
          </div>

          <Link
            href="/shop"
            className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
          >
            Browse shop
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {error && (
        <section className="rounded-[28px] border border-red-200 bg-red-50 p-5">
          <p className="text-sm text-red-800">{error}</p>
        </section>
      )}

      {orders.length === 0 ? (
        <section className="grid gap-4 md:grid-cols-3">
          {[
            {
              label: "Status",
              value: "No orders",
              icon: Package,
              body: "Your order timeline will appear here once you place your first order.",
            },
            {
              label: "Tracking",
              value: "Waiting",
              icon: Truck,
              body: "Shipment progress and delivery updates will appear for active orders.",
            },
            {
              label: "Recent activity",
              value: "None yet",
              icon: Clock3,
              body: "New purchases will populate the history list with reorder shortcuts and receipts.",
            },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <div key={item.label} className="rounded-[28px] border border-border bg-background/70 p-5 shadow-[0_16px_40px_rgba(26,83,92,0.05)]">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-muted">
                      {item.label}
                    </p>
                    <h2 className="mt-3 text-xl font-semibold text-primary">{item.value}</h2>
                  </div>
                  <div className="rounded-2xl border border-accent/20 bg-accent/10 p-3 text-accent">
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-secondary">{item.body}</p>
              </div>
            );
          })}
        </section>
      ) : (
        <section className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="rounded-[28px] border border-border bg-surface p-6 shadow-[0_16px_40px_rgba(26,83,92,0.05)]">
              <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-muted">
                    Order {order._id.slice(-8).toUpperCase()}
                  </p>
                  <p className="mt-1 text-sm text-secondary">
                    {new Date(order.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <span className={`inline-flex rounded-full px-4 py-2 text-sm font-semibold capitalize ${getStatusBadgeColor(order.status)}`}>
                    {order.status}
                  </span>
                  {order.status === "confirmed" && (
                    <button
                      onClick={() => handleCancelOrder(order._id)}
                      disabled={cancelingOrderId === order._id}
                      className="rounded-full border border-red-300 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 transition-colors hover:bg-red-100 disabled:opacity-70"
                    >
                      {cancelingOrderId === order._id ? "Canceling..." : "Cancel Order"}
                    </button>
                  )}
                </div>
              </div>

              <div className="mb-4 space-y-2 border-t border-border pt-4">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between gap-3 text-sm">
                    <div className="flex items-center gap-3">
                      {item.image && (
                        <div className="h-12 w-12 overflow-hidden rounded-lg bg-background">
                          <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-primary">{item.name}</p>
                        <p className="text-xs text-secondary">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <p className="font-semibold text-primary">{formatMoney(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>

              <div className="border-t border-border pt-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="font-semibold text-primary">Total:</span>
                  <span className="text-lg font-bold text-primary">{formatMoney(order.total)}</span>
                </div>
                <p className="text-xs text-secondary">
                  Delivery to: {order.address.street}, {order.address.city}, {order.address.province} {order.address.postalCode}
                </p>
              </div>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
