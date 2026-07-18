import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { Product } from "@/models/Product";
import { Category } from "@/models/Category";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const isFeatured = searchParams.get("isFeatured");

    const query: any = {};
    if (category) {
      // Check if it's a valid ObjectId or a slug
      if (mongoose.Types.ObjectId.isValid(category)) {
        query.category = category;
      } else {
        // Assume it's a slug, fetch the category first
        const categoryDoc = await mongoose.model("Category").findOne({ slug: category });
        if (categoryDoc) {
          query.category = categoryDoc._id;
        } else {
          // If category not found, return empty products array
          return NextResponse.json([]);
        }
      }
    }
    
    if (isFeatured) query.isFeatured = isFeatured === "true";

    const products = await Product.find(query).populate("category", "name slug").sort({ createdAt: -1 });
    
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ message: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    await dbConnect();
    const body = await req.json();
    
    const product = new Product(body);
    await product.save();

    return NextResponse.json(product, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || "Failed to create product" }, { status: 500 });
  }
}
