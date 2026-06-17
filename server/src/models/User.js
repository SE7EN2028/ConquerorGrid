import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, trim: true, maxlength: 24 },
    color: { type: String, required: true },
    token: { type: String, required: true, select: false },
    claims: { type: Number, default: 0 },
  },
  { timestamps: true }
);

userSchema.methods.toClient = function () {
  return {
    id: this._id.toString(),
    username: this.username,
    color: this.color,
    claims: this.claims,
  };
};

export const User = mongoose.model("User", userSchema);
