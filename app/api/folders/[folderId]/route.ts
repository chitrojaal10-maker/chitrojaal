import { NextResponse } from "next/server";
import mongooseConnect from "@/lib/mongoose";
import Folder from "@/models/Folder";
import { getSessionTokenFromRequest, verifySessionToken } from "@/lib/session";

async function requireAdmin(request: Request) {
  const token = getSessionTokenFromRequest(request);
  const session = await verifySessionToken(token);
  return session?.accessRole === "admin";
}

// GET a single folder by ID
export async function GET(request: Request, context: any) {
  await mongooseConnect();
  try {
    const { folderId } = await context.params;
    const folder = await Folder.findById(folderId);

    if (!folder) {
      return NextResponse.json({ error: "Folder not found" }, { status: 404 });
    }
    return NextResponse.json(folder);
  } catch (error) {
    console.error("Error fetching folder:", error);
    return NextResponse.json({ error: "Error fetching folder" }, { status: 500 });
  }
}

export async function PUT(request: Request, context: any) {
  await mongooseConnect();
  try {
    if (!(await requireAdmin(request))) {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const { folderId } = await context.params;
    const { name } = await request.json();
    const folder = await Folder.findByIdAndUpdate(folderId, { name }, { new: true });

    if (!folder) {
      return NextResponse.json({ error: "Folder not found" }, { status: 404 });
    }

    return NextResponse.json(folder);
  } catch (error) {
    console.error("Error updating folder:", error);
    return NextResponse.json({ error: "Error updating folder" }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: any) {
  await mongooseConnect();
  try {
    if (!(await requireAdmin(request))) {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const { folderId } = await context.params;
    const deleted = await Folder.findByIdAndDelete(folderId);

    if (!deleted) {
      return NextResponse.json({ error: "Folder not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting folder:", error);
    return NextResponse.json({ error: "Error deleting folder" }, { status: 500 });
  }
}
