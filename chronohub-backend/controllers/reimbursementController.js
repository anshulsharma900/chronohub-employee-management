import Reimbursement from "../models/Reimbursement.js";

export const submitClaim = async (req, res) => {
  try {
    const { amount, category, description, receiptUrl } = req.body;

    if (!amount || !category || !description) {
      return res.status(400).json({ message: "Amount, category, and description are required" });
    }

    if (amount <= 0) {
      return res.status(400).json({ message: "Amount must be greater than 0" });
    }

    const claim = await Reimbursement.create({
      employee: req.user._id,
      amount,
      category,
      description,
      receiptUrl: receiptUrl || null,
    });

    res.status(201).json(claim);
  } catch (error) {
    console.error("Submit claim error:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getClaims = async (req, res) => {
  try {
    let claims;

    if (req.user.role === "employee") {
      claims = await Reimbursement.find({ employee: req.user._id })
        .sort({ createdAt: -1 });
    } else {
      claims = await Reimbursement.find()
        .populate("employee", "name email department")
        .populate("reviewedBy", "name")
        .populate("paidBy", "name")
        .sort({ createdAt: -1 });
    }

    res.json(claims);
  } catch (error) {
    console.error("Get claims error:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getClaimById = async (req, res) => {
  try {
    const claim = await Reimbursement.findById(req.params.id)
      .populate("employee", "name email department")
      .populate("reviewedBy", "name")
      .populate("paidBy", "name");

    if (!claim) {
      return res.status(404).json({ message: "Claim not found" });
    }

    if (
      req.user.role === "employee" &&
      claim.employee._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Not authorized to view this claim" });
    }

    res.json(claim);
  } catch (error) {
    console.error("Get claim error:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

export const reviewClaim = async (req, res) => {
  try {
    const { status, rejectionReason } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Status must be 'approved' or 'rejected'" });
    }

    const claim = await Reimbursement.findById(req.params.id);

    if (!claim) {
      return res.status(404).json({ message: "Claim not found" });
    }

    if (claim.status !== "pending") {
      return res.status(400).json({ message: "Only pending claims can be reviewed" });
    }

    claim.status = status;
    claim.reviewedBy = req.user._id;
    claim.reviewedAt = new Date();

    if (status === "rejected" && rejectionReason) {
      claim.rejectionReason = rejectionReason;
    }

    await claim.save();

    const updatedClaim = await Reimbursement.findById(claim._id)
      .populate("employee", "name email")
      .populate("reviewedBy", "name");

    res.json(updatedClaim);
  } catch (error) {
    console.error("Review claim error:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

export const markAsPaid = async (req, res) => {
  try {
    const claim = await Reimbursement.findById(req.params.id);

    if (!claim) {
      return res.status(404).json({ message: "Claim not found" });
    }

    if (claim.status !== "approved") {
      return res.status(400).json({ message: "Only approved claims can be marked as paid" });
    }

    claim.status = "paid";
    claim.paidBy = req.user._id;
    claim.paidAt = new Date();

    await claim.save();

    const updatedClaim = await Reimbursement.findById(claim._id)
      .populate("employee", "name email")
      .populate("reviewedBy", "name")
      .populate("paidBy", "name");

    res.json(updatedClaim);
  } catch (error) {
    console.error("Mark as paid error:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

export const cancelClaim = async (req, res) => {
  try {
    const claim = await Reimbursement.findById(req.params.id);

    if (!claim) {
      return res.status(404).json({ message: "Claim not found" });
    }

    if (claim.employee.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to cancel this claim" });
    }

    if (claim.status !== "pending") {
      return res.status(400).json({ message: "Only pending claims can be cancelled" });
    }

    await Reimbursement.findByIdAndDelete(req.params.id);

    res.json({ message: "Claim cancelled successfully" });
  } catch (error) {
    console.error("Cancel claim error:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

export const deleteClaim = async (req, res) => {
  try {
    const claim = await Reimbursement.findById(req.params.id);

    if (!claim) {
      return res.status(404).json({ message: "Claim not found" });
    }

    await Reimbursement.findByIdAndDelete(req.params.id);

    res.json({ message: "Claim deleted successfully" });
  } catch (error) {
    console.error("Delete claim error:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getReimbursementStats = async (req, res) => {
  try {
    let query = {};

    if (req.user.role === "employee") {
      query.employee = req.user._id;
    }

    const [stats] = await Reimbursement.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          totalClaims: { $sum: 1 },
          totalAmount: { $sum: "$amount" },
          pendingCount: {
            $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] },
          },
          pendingAmount: {
            $sum: { $cond: [{ $eq: ["$status", "pending"] }, "$amount", 0] },
          },
          approvedCount: {
            $sum: { $cond: [{ $eq: ["$status", "approved"] }, 1, 0] },
          },
          approvedAmount: {
            $sum: { $cond: [{ $eq: ["$status", "approved"] }, "$amount", 0] },
          },
          rejectedCount: {
            $sum: { $cond: [{ $eq: ["$status", "rejected"] }, 1, 0] },
          },
          paidCount: {
            $sum: { $cond: [{ $eq: ["$status", "paid"] }, 1, 0] },
          },
          paidAmount: {
            $sum: { $cond: [{ $eq: ["$status", "paid"] }, "$amount", 0] },
          },
        },
      },
    ]);

    res.json(
      stats || {
        totalClaims: 0,
        totalAmount: 0,
        pendingCount: 0,
        pendingAmount: 0,
        approvedCount: 0,
        approvedAmount: 0,
        rejectedCount: 0,
        paidCount: 0,
        paidAmount: 0,
      }
    );
  } catch (error) {
    console.error("Get stats error:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};
