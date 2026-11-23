import { NextResponse } from "next/server";
import { hashPassword } from "@/lib/password";
import mongooseConnect from "@/lib/mongoose";
import Staff from "@/models/Staff";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  await mongooseConnect();
  try {
    const { id } = await params;
    const body = await request.json();
    const { password, ...updates } = body;
    const updatedStaff = await Staff.findByIdAndUpdate(
      id,
      {
        ...updates,
        accessRole: "staff",
        updatedAt: new Date(),
        ...(password ? { passwordHash: hashPassword(password) } : {}),
      },
      { new: true },
    ).select("-passwordHash");

    if (!updatedStaff) {
      return NextResponse.json(
        { success: false, error: "Staff member not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, data: updatedStaff });
  } catch (error) {
    console.error("Error updating staff member", error);
    return NextResponse.json(
      { success: false, error: "Could not update staff member" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  await mongooseConnect();
  try {
    const { id } = await params;
    await Staff.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting staff member", error);
    return NextResponse.json(
      { success: false, error: "Could not delete staff member" },
      { status: 500 },
    );
  }
}
