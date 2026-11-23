import mongoose, { Schema } from "mongoose";

const EventSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    date: { type: Date, required: true },
    location: { type: String },
    eventType: { type: String },
    description: { type: String },
    status: {
      type: String,
      enum: ["Upcoming", "Completed", "Cancelled"],
      default: "Upcoming",
    },
    order: { type: Schema.Types.ObjectId, ref: "Order" },
    photographers: [{ type: Schema.Types.ObjectId, ref: "Staff" }],
  },
  { timestamps: true },
);

export default mongoose.models.Event || mongoose.model("Event", EventSchema);
