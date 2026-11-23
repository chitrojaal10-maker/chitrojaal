import mongoose from "mongoose";

const StaffFeatureSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  href: { type: String, required: true },
  iconKey: { type: String, required: true },
  badge: { type: String },
  audience: {
    type: String,
    enum: ["all", "admin", "staff"],
    default: "all",
  },
  active: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.models.StaffFeature ||
  mongoose.model("StaffFeature", StaffFeatureSchema);
