import Link from "next/link";
import { Heart, ArrowRight, Trash2 } from "lucide-react";
import Image from "next/image";

import { getCurrentUser } from "@/lib/auth-client";
import { connectToDatabase } from "@/lib/db";
import { User } from "@/lib/models/User";
import { Product } from "@/lib/models/Product";
import WishlistRemoveButton from "@/components/account/WishlistRemoveButton";

export const revalidate = 0;

export default async function WishlistPage() {
  const authUser = await getCurrentUser();
  
  if (!authUser?.userId) {
    return (
      <div className="space-y-6">
        <section className="rounded-[32px] border border-border bg-surface p-6 shadow-[0_20px_60px_rgba(26,83,92,0.06)] sm:p-8">
          <p className="text-center text-secondary">Please log in to view your wishlist</p>
        </section>
      </div>
    );
  }

  await connectToDatabase();

  const user = await User.findById(authUser.userId)
    .populate({
      path: "wishlist",
      model: Product,
      select: "_id name price images category",
    })
    .lean();

  const wishlistItems = (user?.wishlist || []) as any[];

  const formatPrice = (priceInCents: number) => {
    return (priceInCents / 100).toFixed(2);
  };

  return (
    <div className="space-y-6">
      <section className="rounded-[32px] border border-border bg-surface p-6 shadow-[0_20px_60px_rgba(26,83,92,0.06)] sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-muted">
              Wishlist
            </p>
            <h1 className="mt-2 text-[clamp(1.8rem,3vw,2.6rem)] font-semibold tracking-[-0.04em] text-primary">
              Saved items, ready when you are
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-secondary sm:text-base">
              You have {wishlistItems.length} item{wishlistItems.length !== 1 ? "s" : ""} saved
            </p>
          </div>

          <Link
            href="/shop"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-5 py-3 text-sm font-semibold text-primary transition-colors hover:border-accent/30 hover:bg-accent/10"
          >
            Continue shopping
            <ArrowRight className="h-4 w-4 text-accent" />
          </Link>
        </div>
      </section>

      {wishlistItems.length === 0 ? (
        <section className="rounded-[28px] border border-border bg-background/70 p-6 shadow-[0_16px_40px_rgba(26,83,92,0.05)]">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl border border-accent/20 bg-accent/10 p-3 text-accent">
              <Heart className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-muted">
                Wishlist preview
              </p>
              <h2 className="mt-2 text-xl font-semibold text-primary">No items yet</h2>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {[
              "Browse the shop and add items to your wishlist.",
              "Your saved products will appear here with quick-add buttons.",
            ].map((message) => (
              <div key={message} className="rounded-2xl border border-border bg-surface p-4">
                <p className="text-sm leading-relaxed text-secondary">{message}</p>
              </div>
            ))}
          </div>
        </section>
      ) : (
        <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {wishlistItems.map((item: any) => (
            <div
              key={item._id}
              className="group relative rounded-2xl border border-border bg-card p-4 shadow-sm transition-all hover:shadow-lg"
            >
              <Link href={`/shop/${item._id}`}>
                <div className="relative h-40 w-full bg-muted/50 rounded-lg overflow-hidden mb-4">
                  {item.images && item.images.length > 0 ? (
                    <Image
                      src={item.images[0]}
                      alt={item.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-3xl">🐾</div>
                  )}
                </div>
              </Link>

              <Link href={`/shop/${item._id}`} className="block">
                <h3 className="text-lg font-semibold text-primary hover:underline">
                  {item.name}
                </h3>
              </Link>

              <div className="mt-3 flex items-center justify-between">
                <span className="text-xl font-bold text-accent">
                  ${formatPrice(item.price)}
                </span>
                <WishlistRemoveButton productId={String(item._id)} />
              </div>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
