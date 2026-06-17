import mongoose from "mongoose";

const cellSchema = new mongoose.Schema(
  {
    index: { type: Number, required: true, unique: true },
    col: { type: Number, required: true },
    row: { type: Number, required: true },
    ownerId: { type: String, default: null },
    ownerName: { type: String, default: null },
    ownerColor: { type: String, default: null },
    claimedAt: { type: Date, default: null },
    version: { type: Number, default: 0 },
  },
  { timestamps: false }
);

// leaderboard aggregation and adjacency checks both query by owner
cellSchema.index({ ownerId: 1 });

cellSchema.methods.toClient = function () {
  return {
    id: this.index,
    col: this.col,
    row: this.row,
    owner: this.ownerId
      ? { id: this.ownerId, name: this.ownerName, color: this.ownerColor }
      : null,
    claimedAt: this.claimedAt,
    version: this.version,
  };
};

export const Cell = mongoose.model("Cell", cellSchema);
