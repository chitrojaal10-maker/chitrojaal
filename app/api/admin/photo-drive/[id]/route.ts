import { NextResponse } from "next/server";
import mongooseConnect from "@/lib/mongoose";
import PhotoDriveLink from "@/models/PhotoDriveLink";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  await mongooseConnect();
  try {
    const { id } = await params;
    await PhotoDriveLink.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting photo drive link", error);
    return NextResponse.json(
      { success: false, error: "Could not delete link" },
      { status: 500 },
    );
  }
}
