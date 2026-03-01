import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    category: {
      type: String,
      required: true,
      enum: [
        "drink",
        "starter",
        "main",
        "dessert",
        "snack",
        "combo",
        "other",
      ],
    },

    description: {
      type: String,
    },

    image: {
      type: String,
    },

    isAvailable: {
      type: Boolean,
      default: true,
    },

    isVeg: {
      type: Boolean,
      default: true,
    },

    shopId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
      required: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ShopAdmin",
    },
  },
  {
    timestamps: true,
  }
);

productSchema.index({ shopId: 1, category: 1 });

export default mongoose.model("Product", productSchema);
