import { NextResponse } from "next/server";
import mongooseConnect from "@/lib/mongoose";
import Expense from "@/models/Expense";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  await mongooseConnect();
  try {
    const { id } = await params;
    await Expense.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting expense", error);
    return NextResponse.json(
      { success: false, error: "Could not delete expense" },
      { status: 500 },
    );
  }
}
