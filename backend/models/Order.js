import mongoose from "mongoose";

/* ================================
   Order Item Subdocument
================================ */
const orderItemSchema = new mongoose.Schema(
    {
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },

        name: {
            type: String,
            required: true,
        },

        price: {
            type: Number,
            required: true,
        },

        quantity: {
            type: Number,
            required: true,
            min: 1,
        },

        isVeg: {
            type: Boolean,
            default: true,
        },
    },
    { _id: false }
);

/* ================================
   Main Order Schema
================================ */
const orderSchema = new mongoose.Schema(
    {
        orderNumber: {
            type: String,
            unique: true,
        },

        shopId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Shop",
            required: true,
        },

        items: {
            type: [orderItemSchema],
            required: true,
        },

        totalAmount: {
            type: Number,
            required: true,
            min: 0,
        },

        tableNo: {
            type: String,
        },

        customerPhone: {
            type: String,
            required: true,
        },

        status: {
            type: String,
            enum: [
                "pending",
                "preparing",
                "served",
                "cancelled",
            ],
            default: "pending",
        },

        paymentStatus: {
            type: String,
            enum: ["pending", "paid", "failed"],
            default: "pending",
        },

        paymentId: {
            type: String,
        },

        orderSource: {
            type: String,
            enum: ["qr", "manual"],
            default: "qr",
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

/* ================================
   Generate Order Number
================================ */
orderSchema.pre("save", function (next) {
    if (this.orderNumber) return next();

    const random = Math.floor(1000 + Math.random() * 9000);
    this.orderNumber = `QD-${Date.now()}-${random}`;

    next();
});


/* ================================
   Indexes
================================ */
orderSchema.index({ shopId: 1 });
orderSchema.index({ paymentStatus: 1 });
orderSchema.index({ status: 1 });

export default mongoose.model("Order", orderSchema);
