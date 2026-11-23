import mongoose from "mongoose";

const BentoConfigSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true },
    value: { type: mongoose.Schema.Types.Mixed, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.BentoConfig || mongoose.model("BentoConfig", BentoConfigSchema);
