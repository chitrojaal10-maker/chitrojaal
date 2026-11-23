import { NextResponse } from "next/server";
import mongooseConnect from "@/lib/mongoose";
import Order from "@/models/Order";

export async function POST(request: Request) {
  await mongooseConnect();
  try {
    const bookingData = await request.json();

    // Basic validation
    if (
      !bookingData.name ||
      !bookingData.email ||
      !bookingData.phone ||
      !bookingData.eventDate
    ) {
      return NextResponse.json(
        { message: "Required fields are missing." },
        { status: 400 },
      );
    }

    const newOrder = new Order({
      customerName: bookingData.name,
      customerEmail: bookingData.email,
      customerPhone: bookingData.phone,
      eventDate: bookingData.eventDate,
      package: bookingData.package || "Not specified", // Default value
      totalAmount: bookingData.totalAmount || 0, // Default value
      paidAmount: 0,
      dueAmount: bookingData.totalAmount || 0,
      status: "Pending",
      createdAt: new Date(),
    });

    await newOrder.save();

    return NextResponse.json(
      {
        message: "Booking request received successfully!",
        bookingId: newOrder._id,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Booking request failed:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
