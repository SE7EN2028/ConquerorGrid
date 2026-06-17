import mongoose from "mongoose";

const statsSchema = new mongoose.Schema({
  key: { type: String, default: "global", unique: true },
  totalClaims: { type: Number, default: 0 },
});

statsSchema.statics.getGlobal = function () {
  return this.findOneAndUpdate(
    { key: "global" },
    { $setOnInsert: { totalClaims: 0 } },
    { upsert: true, new: true }
  );
};

export const Stats = mongoose.model("Stats", statsSchema);
