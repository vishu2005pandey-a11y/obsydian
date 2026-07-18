import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { Order } from "@/models/Order";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    
    // If admin, they can see all orders or filter by user, but let's default to their own if not admin route
    let query: any = { user: session.user.id };
    
    const orders = await Order.find(query)
      .populate("items.product", "name price images slug")
      .sort({ createdAt: -1 });
      
    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json({ message: "Failed to fetch orders" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const body = await req.json();
    
    const order = new Order({
      user: session.user.id,
      items: body.items,
      shippingAddress: body.shippingAddress,
      totalAmount: body.totalAmount,
      paymentMethod: body.paymentMethod || 'COD',
      paymentStatus: 'pending',
      orderStatus: 'pending'
    });
    
    await order.save();

    return NextResponse.json(order, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || "Failed to create order" }, { status: 500 });
  }
}
