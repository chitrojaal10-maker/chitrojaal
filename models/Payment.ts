import mongoose, { Schema } from "mongoose";

const PaymentSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  method: { type: String, required: true },
  order: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
  notes: { type: String },
});

export default mongoose.models.Payment || mongoose.model("Payment", PaymentSchema);
