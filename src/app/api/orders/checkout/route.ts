import mongoose from "mongoose";
import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth-client";
import { connectToDatabase } from "@/lib/db";
import { Cart } from "@/lib/models/Cart";
import { Order } from "@/lib/models/Order";

export const runtime = "nodejs";

type CheckoutBody = {
  address?: {
    fullName?: string;
    phone?: string;
    street?: string;
    city?: string;
    province?: string;
    postalCode?: string;
  };
};

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    let body: CheckoutBody;

    try {
      body = (await request.json()) as CheckoutBody;
    } catch {
      return NextResponse.json({ message: "Invalid request body." }, { status: 400 });
    }

    const address = body.address ?? {};
    const fieldErrors: Record<string, string> = {};

    if (!address.fullName?.trim()) fieldErrors.fullName = "Full name is required.";
    if (!address.phone?.trim()) fieldErrors.phone = "Phone number is required.";
    if (!address.street?.trim()) fieldErrors.street = "Street address is required.";
    if (!address.city?.trim()) fieldErrors.city = "City is required.";
    if (!address.province?.trim()) fieldErrors.province = "Province is required.";
    if (!address.postalCode?.trim()) fieldErrors.postalCode = "Postal code is required.";

    if (Object.keys(fieldErrors).length > 0) {
      return NextResponse.json(
        { message: "Please fix the highlighted fields.", fieldErrors },
        { status: 400 },
      );
    }

    await connectToDatabase();

    const cart = await Cart.findOne({ user: user.userId })
      .populate({
        path: "items.product",
        populate: { path: "category", select: "name slug" },
      });

    if (!cart || cart.items.length === 0) {
      return NextResponse.json({ message: "Your cart is empty." }, { status: 400 });
    }

    const items = cart.items.map((item : { product: unknown; quantity: number }) => {
      const product = item.product as unknown as {
        _id: mongoose.Types.ObjectId;
        name: string;
        price: number;
        images?: string[];
      };

      return {
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        image: product.images?.[0] ?? "",
      };
    });

    const total = items.reduce((sum : number, item : { price: number; quantity: number }) => sum + item.price * item.quantity, 0);

    const order = await Order.create({
      user: user.userId,
      items,
      total,
      status: "confirmed",
      address: {
        fullName: address.fullName?.trim(),
        phone: address.phone?.trim(),
        street: address.street?.trim(),
        city: address.city?.trim(),
        province: address.province?.trim(),
        postalCode: address.postalCode?.trim(),
      },
      paymentMethod: "cash_on_delivery",
    });

    await Cart.updateOne({ user: user.userId }, { $set: { items: [] } });

    return NextResponse.json(
      {
        message: "Order placed successfully.",
        orderId: order._id.toString(),
        total,
      },
      { status: 201 },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to complete checkout.";
    const status = message === "Your cart is empty." ? 400 : 500;
    return NextResponse.json({ message }, { status });
  }
}
