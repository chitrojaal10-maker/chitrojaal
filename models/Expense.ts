import mongoose from "mongoose";

const ExpenseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    category: { type: String, required: true },
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    vendor: { type: String },
    notes: { type: String },
    createdBy: { type: String, default: "admin" },
    status: { type: String, default: "Approved" },
  },
  { timestamps: true },
);

export default mongoose.models.Expense ||
  mongoose.model("Expense", ExpenseSchema);
