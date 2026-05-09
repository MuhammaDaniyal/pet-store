import { getCurrentUser } from "@/lib/auth-client";
import { connectToDatabase } from "@/lib/db";
import { Category } from "@/lib/models/Category";
import { Product } from "@/lib/models/Product";
import { User } from "@/lib/models/User";

import { ProductCard, type ShopProduct } from "@/components/shop/ProductCard";

interface ShopCategory {
  name?: string;
  slug?: string;
}

interface ShopProductRecord {
  _id: string;
  name: string;
  slug?: string;
  price: number;
  images?: string[];
  animalType: string;
  isFeatured?: boolean;
  category?: ShopCategory | null;
}

export const revalidate = 0;

export default async function ShopPage() {
  await connectToDatabase();

  const authUser = await getCurrentUser();
  const products = (await Product.find({ isActive: true })
    .populate({ path: "category", select: "name slug" })
    .limit(200)
    .lean()) as ShopProductRecord[];

  let wishlistedIds = new Set<string>();

  if (authUser) {
    const user = await User.findById(authUser.userId).select("wishlist").lean();

    if (user && Array.isArray(user.wishlist)) {
      wishlistedIds = new Set(user.wishlist.map((item: any) => item.toString()));
    }
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <h1 className="mb-6 text-3xl font-semibold text-primary">Shop</h1>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => {
          const id = String(product._id);
          const cardProduct: ShopProduct = {
            id,
            name: product.name,
            slug: product.slug,
            price: product.price,
            images: product.images ?? [],
            animalType: product.animalType,
            category: product.category?.name ? { name: product.category.name, slug: product.category.slug } : null,
            isFeatured: product.isFeatured,
          };

          return (
            <ProductCard
              key={id}
              product={cardProduct}
              initialWishlisted={wishlistedIds.has(id)}
              isLoggedIn={Boolean(authUser)}
            />
          );
        })}
      </div>
    </main>
  );
}
