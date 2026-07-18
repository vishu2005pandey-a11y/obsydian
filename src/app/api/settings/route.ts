import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { SiteSettings } from "@/models/SiteSettings";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET() {
  try {
    await dbConnect();
    // We only need one settings document for the site
    let settings = await SiteSettings.findOne({});
    
    // If no settings exist yet, create the default one
    if (!settings) {
      settings = await SiteSettings.create({});
    }
    
    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json({ message: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    await dbConnect();
    const body = await req.json();
    
    const allowedUpdates = [
      "heroBgImage",
      "animeCategoryBgImage",
      "aboutBgImage",
      "aboutStoryImage",
      "homeCategoryOversizedBgImage",
      "homeCategorySuperheroBgImage",
      "collectionAnimeBgImage",
      "collectionOversizedBgImage",
      "collectionVintageBgImage",
      "collectionCyberpunkBgImage",
      "upiId",
      "upiQrImage"
    ];
    
    const updateData = Object.keys(body).reduce((acc, key) => {
      if (allowedUpdates.includes(key)) {
        acc[key] = body[key];
      }
      return acc;
    }, {} as any);

    let settings = await SiteSettings.findOne({});
    if (!settings) {
      settings = new SiteSettings(updateData);
      await settings.save();
    } else {
      settings = await SiteSettings.findOneAndUpdate({}, updateData, { new: true });
    }

    return NextResponse.json(settings);
  } catch (error: any) {
    return NextResponse.json({ message: error.message || "Failed to update settings" }, { status: 500 });
  }
}
