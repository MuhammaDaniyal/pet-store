import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Product } from "@/lib/models/Product";
import { Category } from "@/lib/models/Category";
import { getCurrentUser } from "@/lib/auth-client";

export const runtime = "nodejs";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const body = await request.json();

    await connectToDatabase();

    if (body.category) {
      const cat = await Category.findById(body.category);
      if (!cat) return NextResponse.json({ message: "Category not found" }, { status: 404 });
    }

    const updated = await Product.findByIdAndUpdate(id, body, { new: true, runValidators: true }).populate("category");
    if (!updated) return NextResponse.json({ message: "Product not found" }, { status: 404 });

    return NextResponse.json({ message: "Updated", product: updated }, { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unable to update product";
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    await connectToDatabase();
    const deleted = await Product.findByIdAndDelete(id);
    if (!deleted) return NextResponse.json({ message: "Product not found" }, { status: 404 });

    return NextResponse.json({ message: "Deleted" }, { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unable to delete product";
    return NextResponse.json({ message }, { status: 500 });
  }
}
