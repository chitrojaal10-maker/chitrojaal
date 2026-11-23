import { NextResponse } from "next/server";
import mongooseConnect from "@/lib/mongoose";
import Order from "@/models/Order";
import Payment from "@/models/Payment";
import Expense from "@/models/Expense";

export async function GET(request: Request) {
  await mongooseConnect();

  try {
    const { searchParams } = new URL(request.url);
    const month = searchParams.get("month") || "";

    const monthStart = month ? new Date(`${month}-01T00:00:00.000Z`) : null;
    const monthEnd = monthStart
      ? new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 1)
      : null;

    const monthQuery = (field: string) =>
      monthStart && monthEnd
        ? {
            [field]: {
              $gte: monthStart,
              $lt: monthEnd,
            },
          }
        : {};

    const orderQuery = { ...monthQuery("eventDate"), status: { $ne: "Archived" } };
    const expenseQuery = { ...monthQuery("date"), status: "Approved" };

    const [orders, payments, expenses] = await Promise.all([
      Order.find(
        orderQuery,
        "totalAmount paidAmount advanceAmount dueAmount customerName package eventDate eventSchedule",
      )
        .sort({ eventDate: -1 })
        .lean(),
      Payment.find(monthQuery("date"), "amount date method")
        .sort({ date: -1 })
        .lean(),
      Expense.find(expenseQuery).sort({ date: -1 }).lean(),
    ]);

    const income = payments.reduce((sum, item) => sum + (item.amount || 0), 0);
    const expenditure = expenses.reduce(
      (sum, item) => sum + (item.amount || 0),
      0,
    );
    const outstanding = orders.reduce(
      (sum, item) => sum + (item.dueAmount || 0),
      0,
    );

    return NextResponse.json({
      success: true,
      data: {
        income,
        expenditure,
        outstanding,
        expenses,
        orders: orders.slice(0, 8),
      },
    });
  } catch (error) {
    console.error("Error loading finance summary", error);
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
    const expense = await Expense.create(body);
    return NextResponse.json({ success: true, data: expense }, { status: 201 });
  } catch (error) {
    console.error("Error creating expense", error);
    return NextResponse.json(
      { success: false, error: "Could not save expense" },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
  await mongooseConnect();
  try {
    const body = await request.json();
    const { _id, ...updates } = body;
    const expense = await Expense.findByIdAndUpdate(_id, updates, {
      new: true,
    });
    return NextResponse.json({ success: true, data: expense });
  } catch (error) {
    console.error("Error updating expense", error);
    return NextResponse.json(
      { success: false, error: "Could not update expense" },
      { status: 500 },
    );
  }
}
