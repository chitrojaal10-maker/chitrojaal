import { NextResponse } from "next/server";
import mongooseConnect from "@/lib/mongoose";
import Staff from "@/models/Staff";

interface Params {
  params: Promise<Record<string, never>>;
}

export async function PUT(request: Request, { params }: Params) {
  await mongooseConnect();
  try {
    const body = await request.json();
    const id = body?.id;

    if (!id) {
      return NextResponse.json(
        { message: "Staff id is required" },
        { status: 400 },
      );
    }

    const updated = await Staff.findByIdAndUpdate(id, body, { new: true });

    if (!updated) {
      return NextResponse.json({ message: "Staff not found" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to update staff" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request, { params }: Params) {
  await mongooseConnect();
  try {
    const body = await request.json().catch(() => ({}));
    const id = body?.id;

    if (!id) {
      return NextResponse.json(
        { message: "Staff id is required" },
        { status: 400 },
      );
    }

    await Staff.findByIdAndDelete(id);
    return NextResponse.json(
      { message: "Staff deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to delete staff" },
      { status: 500 },
    );
  }
}
