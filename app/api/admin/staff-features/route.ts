import { NextResponse } from "next/server";
import mongooseConnect from "@/lib/mongoose";
import StaffFeature from "@/models/StaffFeature";
import { getSessionTokenFromRequest, verifySessionToken } from "@/lib/session";

const DEFAULT_FEATURES = [
  {
    title: "Upcoming Events",
    description: "See the next shoots and bookings at a glance.",
    href: "/admin/event-managements",
    iconKey: "calendar",
    badge: "Live",
    audience: "all",
    order: 1,
  },
  {
    title: "Photo Gallery",
    description: "Browse approved photos and reference boards.",
    href: "/admin/pose-library",
    iconKey: "camera",
    badge: "Read only",
    audience: "all",
    order: 2,
  },
  {
    title: "Team Roster",
    description: "Check the active crew and assigned members.",
    href: "/admin/staff",
    iconKey: "users",
    badge: "Team",
    audience: "admin",
    order: 3,
  },
];

async function getSessionRole(request: Request) {
  const token = getSessionTokenFromRequest(request);
  const session = await verifySessionToken(token);
  return session?.accessRole || null;
}

async function seedDefaultFeaturesIfNeeded() {
  const count = await StaffFeature.countDocuments();
  if (count > 0) return;
  await StaffFeature.insertMany(
    DEFAULT_FEATURES.map((feature) => ({
      ...feature,
      active: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    })),
  );
}

export async function GET(request: Request) {
  await mongooseConnect();
  try {
    await seedDefaultFeaturesIfNeeded();

    const role = await getSessionRole(request);
    const query =
      role === "admin"
        ? {}
        : { active: true, audience: { $in: ["all", "staff"] } };

    const features = await StaffFeature.find({
      ...query,
      title: { $ne: "Staff Notes" },
    })
      .sort({ order: 1, createdAt: 1 })
      .lean();

    return NextResponse.json({ success: true, data: features });
  } catch (error) {
    console.error("Error fetching staff features:", error);
    return NextResponse.json(
      { success: false, error: "Server Error" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  await mongooseConnect();
  try {
    const body = await request.json();
    const feature = await StaffFeature.create({
      ...body,
      active: body.active !== false,
      order: Number(body.order) || 0,
      updatedAt: new Date(),
    });

    return NextResponse.json({ success: true, data: feature }, { status: 201 });
  } catch (error) {
    console.error("Error creating staff feature:", error);
    return NextResponse.json(
      { success: false, error: "Bad Request" },
      { status: 400 },
    );
  }
}

export async function PUT(request: Request) {
  await mongooseConnect();
  try {
    const body = await request.json();
    const { _id, ...updates } = body;
    const feature = await StaffFeature.findByIdAndUpdate(
      _id,
      {
        ...updates,
        order: Number(updates.order) || 0,
        updatedAt: new Date(),
      },
      { new: true },
    );

    return NextResponse.json({ success: true, data: feature });
  } catch (error) {
    console.error("Error updating staff feature:", error);
    return NextResponse.json(
      { success: false, error: "Bad Request" },
      { status: 400 },
    );
  }
}

export async function DELETE(request: Request) {
  await mongooseConnect();
  try {
    const body = await request.json();
    if (!body?._id) {
      return NextResponse.json(
        { success: false, error: "Feature id is required" },
        { status: 400 },
      );
    }

    await StaffFeature.findByIdAndDelete(body._id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting staff feature:", error);
    return NextResponse.json(
      { success: false, error: "Bad Request" },
      { status: 400 },
    );
  }
}
