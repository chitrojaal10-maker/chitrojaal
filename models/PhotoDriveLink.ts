import mongoose from "mongoose";

const PhotoDriveLinkSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    link: { type: String, required: true },
    clientName: { type: String },
    eventName: { type: String },
    notes: { type: String },
    accessLevel: { type: String, default: "Client" },
    status: { type: String, default: "Active" },
    createdBy: { type: String, default: "admin" },
  },
  { timestamps: true },
);

export default mongoose.models.PhotoDriveLink ||
  mongoose.model("PhotoDriveLink", PhotoDriveLinkSchema);
