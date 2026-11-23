import { NextResponse } from "next/server";
import mongooseConnect from "@/lib/mongoose";
import Order from "@/models/Order";
import Expense from "@/models/Expense";

export async function POST() {
  await mongooseConnect();
  try {
    // Archive expenses that are 'Approved'
    await Expense.updateMany(
      { status: "Approved" },
      { $set: { status: "Archived" } }
    );

    // Archive orders that are 'Pending'
    await Order.updateMany(
      { status: "Pending" },
      { $set: { status: "Archived" } }
    );

    return NextResponse.json({ success: true, message: "Finance data reset successfully." });
  } catch (error) {
    console.error("Error resetting finance data", error);
    return NextResponse.json(
      { success: false, error: "Could not reset finance data" },
      { status: 500 }
    );
  }
}
