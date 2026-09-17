import Leave from "../models/Leave.js";

export const applyLeave = async (req, res) => {
  try {
    const { leaveType, fromDate, toDate, reason } = req.body;

    if (!leaveType || !fromDate || !toDate || !reason) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const leave = await Leave.create({
      employee: req.user._id,
      leaveType,
      fromDate,
      toDate,
      reason,
    });

    res.status(201).json(leave);

  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

export const getLeaves = async (req, res) => {
  try {
    let leaves;

    if (req.user.role === "employee") {
      leaves = await Leave.find({ employee: req.user._id });
    } else {
      leaves = await Leave.find().populate("employee", "name email");
    }

    res.json(leaves);

  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

export const updateLeaveStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const leave = await Leave.findById(req.params.id);

    if (!leave) {
      return res.status(404).json({ message: "Leave not found" });
    }

    leave.status = status;
    leave.approvedBy = req.user._id;

    await leave.save();

    res.json(leave);

  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

export const cancelLeave = async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id);
    if (!leave) {
      return res.status(404).json({ message: "Leave not found" });
    }
    // Only allow cancelling if pending and owned by user
    if (leave.employee.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to cancel this leave" });
    }
    if (leave.status !== "pending") {
      return res.status(400).json({ message: "Only pending leaves can be cancelled" });
    }
    leave.status = "cancelled";
    await leave.save();
    res.json(leave);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

export const deleteLeave = async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id);
    
    if (!leave) {
      return res.status(404).json({ message: "Leave not found" });
    }

    await Leave.findByIdAndDelete(req.params.id);
    
    res.json({ message: "Leave deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
