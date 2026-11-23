// app/api/poses/route.ts
import { NextResponse } from "next/server";
import mongooseConnect from "@/lib/mongoose";
import Pose from "@/models/Pose";
import { getSessionTokenFromRequest, verifySessionToken } from "@/lib/session";

async function requireAdmin(request: Request) {
  const token = getSessionTokenFromRequest(request);
  const session = await verifySessionToken(token);
  return session?.accessRole === "admin";
}

export async function GET(request: Request) {
  await mongooseConnect();
  try {
    const { searchParams } = new URL(request.url);
    const folderId = searchParams.get('folderId');

    const query: { folder?: string } = {};
    if (folderId) {
      query.folder = folderId;
    }

    const poses = await Pose.find(query).populate('folder');
    return NextResponse.json(poses);
  } catch (error) {
    console.error("Error fetching poses:", error);
    return NextResponse.json({ error: "Error fetching poses" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  await mongooseConnect();
  try {
    if (!(await requireAdmin(request))) {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }
    const { name, imageUrls, folderId, category } = await request.json();
    if (!name || !imageUrls || imageUrls.length === 0 || !folderId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newPose = new Pose({
      name,
      imageUrls,
      folder: folderId,
      category,
    });

    await newPose.save();
    return NextResponse.json(newPose, { status: 201 });
  } catch (error) {
    console.error("Error creating pose:", error);
    return NextResponse.json({ error: "Error creating pose" }, { status: 500 });
  }
}
