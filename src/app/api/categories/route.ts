import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { Category } from "@/models/Category";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET() {
  try {
    await dbConnect();
    const categories = await Category.find().sort({ name: 1 });
    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json({ message: "Failed to fetch categories" }, { status: 500 });
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
    
    const category = new Category(body);
    await category.save();

    return NextResponse.json(category, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || "Failed to create category" }, { status: 500 });
  }
}
