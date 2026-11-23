import mongoose, { Schema } from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    customerName: { type: String, required: true },
    customerPhone: { type: String, required: true },
    customerEmail: { type: String },
    customerAddress: { type: String },
    eventDate: { type: Date, required: true },
    eventSchedule: [
      {
        date: { type: Date, required: true },
        shift: {
          type: String,
          enum: ["Day", "Night"],
          default: "Day",
        },
        packageName: { type: String },
        amount: { type: Number, default: 0 },
      },
    ],
    eventLocation: { type: String },
    eventName: { type: String },
    eventType: { type: String },
    eventProgramType: {
      type: String,
      enum: ["Main Program", "Other Event"],
      default: "Main Program",
    },
    otherEventName: { type: String },
    package: { type: String, default: "" },
    packageDetails: { type: String },
    googleMapsLink: { type: String },
    bookingSource: { type: String, default: "Admin" },
    notes: { type: String },
    totalAmount: { type: Number, required: true, default: 0 },
    discountAmount: { type: Number, default: 0 },
    advanceAmount: { type: Number, default: 0 },
    paidAmount: { type: Number, default: 0 },
    dueAmount: { type: Number, required: true, default: 0 },
    finalAmount: { type: Number, default: 0 },
    status: { type: String, default: "Pending" },
    createdFromBooking: { type: Boolean, default: false },
    payments: [{ type: Schema.Types.ObjectId, ref: "Payment" }],
    photographer: { type: String },
    duration: { type: String },
  },
  { timestamps: true },
);

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
