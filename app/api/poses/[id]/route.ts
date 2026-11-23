import { NextResponse } from "next/server";
import mongooseConnect from "@/lib/mongoose";
import Pose from "@/models/Pose";
import { getSessionTokenFromRequest, verifySessionToken } from "@/lib/session";

async function requireAdmin(request: Request) {
  const token = getSessionTokenFromRequest(request);
  const session = await verifySessionToken(token);
  return session?.accessRole === "admin";
}

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function DELETE(request: Request, context: RouteContext) {
  await mongooseConnect();
  try {
    if (!(await requireAdmin(request))) {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const { id } = await context.params;
    const deletedPose = await Pose.findByIdAndDelete(id);

    if (!deletedPose) {
      return NextResponse.json({ error: "Pose not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting pose:", error);
    return NextResponse.json({ error: "Error deleting pose" }, { status: 500 });
  }
}
