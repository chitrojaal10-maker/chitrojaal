import { NextResponse } from "next/server";
import mongooseConnect from "@/lib/mongoose";
import Order from "@/models/Order";
import Event from "@/models/Event";

export async function POST(request: Request) {
  await mongooseConnect();
  try {
    const body = await request.json();

    const customerName = body.customerName || body.name || "";
    const customerPhone = body.customerPhone || body.phone || "";
    const customerEmail = body.customerEmail || body.email || "";
    const customerAddress = body.customerAddress || body.address || "";
    const eventLocation =
      body.eventLocation || body.location || customerAddress;
    const eventDate = body.eventDate || body.bookingDate;
    const eventSchedule = Array.isArray(body.eventSchedule)
      ? body.eventSchedule
      : eventDate
        ? [{ date: eventDate, shift: body.eventShift || "Day" }]
        : [];
    const packageName =
      body.package || body.selectedPackage || body.eventType || "Not specified";
    const packageDetails = body.packageDetails || body.message || "";
    const totalAmount = Number(body.totalAmount || body.amount || 0);
    const discountAmount = Number(body.discountAmount || 0);
    const parsedAdvance = Number(body.advanceAmount || body.advance || 0);
    const parsedPaid = Number(body.paidAmount || body.paid || 0);
    const finalAmount = Math.max(totalAmount - discountAmount, 0);

    const totalPaid = Math.max(parsedPaid, parsedAdvance);

    if (!customerName || !customerPhone || !eventDate) {
      return NextResponse.json(
        { message: "Name, Phone number, and Event Date are required." },
        { status: 400 },
      );
    }

    const parsedEventDate = new Date(eventDate);
    const formattedSchedule = eventSchedule.map((s: { date: string | Date; shift?: string; packageName?: string }) => ({
      date: new Date(s.date || eventDate),
      shift: s.shift === "Night" ? "Night" : "Day",
      packageName: s.packageName || "",
    }));

    const newOrder = await Order.create({
      customerName,
      customerPhone,
      customerEmail: customerEmail || "",
      customerAddress,
      eventDate: parsedEventDate,
      eventSchedule: formattedSchedule,
      eventLocation,
      eventName: body.eventName || `${customerName} - ${packageName}`,
      eventType: body.eventType || packageName,
      package: packageName,
      eventProgramType: body.eventProgramType || "Main Program",
      otherEventName: body.otherEventName || "",
      packageDetails,
      googleMapsLink: body.googleMapsLink || "",
      bookingSource: body.bookingSource || "Website",
      notes: body.notes || body.message || "",
      totalAmount,
      discountAmount,
      advanceAmount: totalPaid,
      paidAmount: totalPaid,
      dueAmount: Math.max(finalAmount - totalPaid, 0),
      finalAmount,
      status: "Pending",
      createdFromBooking: true,
    });

    await Event.create({
      name: newOrder.eventName || `${customerName} - ${packageName}`,
      type: packageName,
      date: newOrder.eventDate,
      location: eventLocation,
      clientName: customerName,
      clientEmail: customerEmail,
      contactNumber: customerPhone,
      totalAmount,
      notes: newOrder.notes,
      bookingSource: newOrder.bookingSource,
      googleMapsLink: newOrder.googleMapsLink,
      orderId: newOrder._id,
      createdFromBooking: true,
      status: "Pending",
    });

    return NextResponse.json(
      {
        message: "Booking request received successfully!",
        bookingId: newOrder._id,
        orderId: newOrder._id,
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
