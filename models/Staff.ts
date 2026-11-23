import mongoose from "mongoose";

const StaffSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, required: true },
  loginId: { type: String, unique: true, sparse: true },
  passwordHash: { type: String },
  accessRole: { type: String, enum: ["admin", "staff"], default: "staff" },
  contact: { type: String },
  address: { type: String },
  joiningDate: { type: String },
  salary: { type: String },
  eventsCovered: { type: Number, default: 0 },
  phone: { type: String },
  joinDate: { type: Date, default: Date.now },
  assignments: { type: Number, default: 0 },
  status: { type: String, default: "Active" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.models.Staff || mongoose.model("Staff", StaffSchema);
