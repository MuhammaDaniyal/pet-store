import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Product } from "@/lib/models/Product";
import { Category } from "@/lib/models/Category";
import { getCurrentUser } from "@/lib/auth-client";

export const runtime = "nodejs";

function toSlug(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function createUniqueSlug(name: string) {
  const base = toSlug(name) || "product";
  let slug = base;
  let counter = 1;

  // Keep appending an increment until we find a free slug.
  while (await Product.exists({ slug })) {
    counter += 1;
    slug = `${base}-${counter}`;
  }

  return slug;
}

export async function GET() {
  try {
    await connectToDatabase();
    const products = await Product.find().populate("category").sort({ createdAt: -1 }).lean();
    return NextResponse.json({ products }, { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unable to fetch products";
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { name, description, price, category, stock, images = [], isActive = true } = body;

    if (!name || !description || price === undefined || price === null || !category) {
      return NextResponse.json({ message: "name, description, price and category are required" }, { status: 400 });
    }

    await connectToDatabase();

    const cat = await Category.findById(category);
    if (!cat) {
      return NextResponse.json({ message: "Invalid category" }, { status: 400 });
    }

    const normalizedName = String(name).trim();
    const duplicate = await Product.findOne({
      category: cat._id,
      name: { $regex: new RegExp(`^${escapeRegex(normalizedName)}$`, "i") },
    }).lean();

    if (duplicate) {
      return NextResponse.json(
        { message: "A product with the same name already exists in this category" },
        { status: 409 }
      );
    }

    const slug = await createUniqueSlug(normalizedName);

    const created = await Product.create({
      name: normalizedName,
      description,
      price: Number(price),
      category: cat._id,
      stock: Number(stock || 0),
      images: Array.isArray(images) ? images : [],
      slug,
      isActive: Boolean(isActive),
      // Required by schema; admin products are regular store items by default.
      animalType: "other",
      isLiveAnimal: false,
    });

    return NextResponse.json({ message: "Product created", product: created }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unable to create product";
    return NextResponse.json({ message }, { status: 500 });
  }
}
