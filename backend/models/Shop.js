import mongoose from "mongoose";

const shopSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    ownerName: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
    },

    address: {
      type: String,
    },

    description: {
      type: String,
    },

    openingTime: {
      type: String,
    },

    closingTime: {
      type: String,
    },

    status: {
      type: String,
      enum: ["active", "blocked"],
      default: "active",
    },

    qrUrl: {
      type: String,
      unique: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

/* Index for performance */
shopSchema.index({ status: 1 });

export default mongoose.model("Shop", shopSchema);
