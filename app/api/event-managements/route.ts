import { NextResponse } from "next/server";
import mongooseConnect from "@/lib/mongoose";
import Order from "@/models/Order";

const normalizeSchedule = (schedule: unknown, fallbackDate?: string | Date) => {
  if (Array.isArray(schedule) && schedule.length > 0) {
    return schedule
      .map((item) => {
        if (!item || typeof item !== "object") return null;
        const entry = item as {
          date?: string | Date;
          shift?: string;
          packageName?: string;
          amount?: number | string;
        };
        if (!entry.date) return null;
        return {
          date: new Date(entry.date),
          shift: entry.shift === "Night" ? "Night" : "Day",
          packageName: entry.packageName || "",
          amount: Number(entry.amount || 0),
        };
      })
      .filter(Boolean);
  }

  if (fallbackDate) {
    return [
      {
        date: new Date(fallbackDate),
        shift: "Day",
        packageName: "",
        amount: 0,
      },
    ];
  }

  return [];
};

const normalizeAmounts = (body: Record<string, unknown>) => {
  const totalAmount = Number(body.totalAmount || 0);
  const discountAmount = Number(body.discountAmount || 0);
  const paidAmount = Number(body.paidAmount || body.advanceAmount || 0);
  const advanceAmount = paidAmount;
  const finalAmount = Math.max(totalAmount - discountAmount, 0);
  const dueAmount = Math.max(finalAmount - paidAmount, 0);

  return { totalAmount, discountAmount, advanceAmount, paidAmount, finalAmount, dueAmount };
};

export async function GET() {
  await mongooseConnect();
  const orders = await Order.find().sort({ eventDate: -1 });
  return NextResponse.json(orders);
}

export async function POST(request: Request) {
  await mongooseConnect();
  const body = await request.json();
  const amounts = normalizeAmounts(body);
  const eventSchedule = normalizeSchedule(body.eventSchedule, body.eventDate);
  const eventDate = eventSchedule[0]?.date || body.eventDate;

  const order = await Order.create({
    ...body,
    eventDate: eventDate ? new Date(eventDate) : undefined,
    eventSchedule,
    totalAmount: amounts.totalAmount,
    discountAmount: amounts.discountAmount,
    advanceAmount: amounts.advanceAmount,
    paidAmount: amounts.paidAmount,
    dueAmount: amounts.dueAmount,
    finalAmount: amounts.finalAmount,
  });
  return NextResponse.json(order);
}
