import mongoose from "mongoose";

const PoseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  imageUrls: { type: [String], required: true },
  folder: { type: mongoose.Schema.Types.ObjectId, ref: 'Folder', required: true },
  category: { type: String },
});

export default mongoose.models.Pose || mongoose.model("Pose", PoseSchema);
