import mongoose from "mongoose";

const reimbursementSchema = new mongoose.Schema(
    {
        employee: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        amount: {
            type: Number,
            required: true,
            min: 0,
        },

        category: {
            type: String,
            required: true,
            enum: ["travel", "meals", "equipment", "software", "training", "other"],
        },

        description: {
            type: String,
            required: true,
        },

        receiptUrl: {
            type: String,
            default: null,
        },

        status: {
            type: String,
            enum: ["pending", "approved", "rejected", "paid"],
            default: "pending",
        },

        reviewedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },

        reviewedAt: {
            type: Date,
        },

        paidBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },

        paidAt: {
            type: Date,
        },

        rejectionReason: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

const Reimbursement = mongoose.model("Reimbursement", reimbursementSchema);

export default Reimbursement;
