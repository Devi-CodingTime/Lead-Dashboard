import mongoose from "mongoose";

const leadSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  interestedProperty: { type: String },
  unitType: { type: String, enum: ["2 BHK", "3 BHK", "Villa"], required: true },
  budget: { type: String, required: true },
  source: { type: String, enum: ["Website", "Facebook", "Referral", "Walk-in"] },
  status: {
    type: String,
    enum: ["New", "Contacted", "Site Visit Scheduled", "Closed", "Lost"],
    default: "New",
    required: true,
  },
  notes: { type: String },
}, { timestamps: true });

export default mongoose.model("Lead", leadSchema);
