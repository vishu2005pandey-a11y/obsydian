import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { Order } from "@/models/Order";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await dbConnect();
    
    const order = await Order.findOneAndUpdate(
      { _id: id, user: session.user.id },
      { paymentStatus: 'verifying' },
      { new: true }
    );
    
    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error: any) {
    return NextResponse.json({ message: error.message || "Failed to update order" }, { status: 500 });
  }
}
