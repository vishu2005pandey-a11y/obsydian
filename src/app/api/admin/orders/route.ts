import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { Order } from "@/models/Order";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    await dbConnect();
    const orders = await Order.find({})
      .populate("items.product", "name price images slug")
      .populate("user", "name email")
      .sort({ createdAt: -1 });
      
    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json({ message: "Failed to fetch orders" }, { status: 500 });
  }
}
