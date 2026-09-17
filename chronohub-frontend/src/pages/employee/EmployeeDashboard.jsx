import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import API from "../../api/axios";
import Layout from "../../components/layout/Layout";

function EmployeeDashboard() {
  const [leaveType, setLeaveType] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [reason, setReason] = useState("");
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);

  const fetchLeaves = async () => {
    try {
      const { data } = await API.get("/leaves");
      setLeaves(data);
    } catch {
      toast.error("Failed to fetch your leave requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (new Date(fromDate) > new Date(toDate)) {
      toast.error("End date must be after start date");
      return;
    }

    try {
      await API.post("/leaves", {
        leaveType,
        fromDate,
        toDate,
        reason,
      });

      toast.success("Leave request submitted successfully!");

      setLeaveType("");
      setFromDate("");
      setToDate("");
      setReason("");
      setIsLeaveModalOpen(false);

      fetchLeaves();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to submit leave request"
      );
    }
  };

  const pending = leaves.filter((l) => l.status === "pending").length;
  const approved = leaves.filter((l) => l.status === "approved").length;
  const rejected = leaves.filter((l) => l.status === "rejected").length;

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <Layout>
      <div className="relative min-h-screen bg-slate-100 dark:bg-slate-950 transition-colors duration-300">

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8 relative z-10"
        >
          {/* Header */}
          <motion.div variants={itemVariants}>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <div>
                <p className="text-slate-500 dark:text-slate-400 text-sm">
                  Track and manage your time off and expense claims
                </p>
              </div>
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsLeaveModalOpen(true)}
                  className="px-5 py-3 bg-blue-600 
                    text-white rounded-xl shadow-lg hover:shadow-2xl hover:bg-blue-700
                    transition-all font-semibold flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg> Apply Leave
                </motion.button>
                <Link
                  to="/employee/reimbursements"
                  className="px-5 py-3 border-2 border-slate-300 dark:border-slate-700 text-blue-400 
                    rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 
                    transition-all font-semibold flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> Reimbursements
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Summary Cards */}
          <motion.div variants={itemVariants} className="grid md:grid-cols-3 gap-6">
            {/* Pending Card */}
            <motion.div
              whileHover={{ y: -5, transition: { duration: 0.3 } }}
              className="group bg-white dark:bg-slate-900 
                rounded-2xl p-6 shadow-md border border-slate-200 dark:border-slate-800
                hover:shadow-2xl hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Pending Requests</p>
                  <h3 className="text-4xl font-bold mt-2 text-yellow-400">
                    {pending}
                  </h3>
                </div>
                <div className="w-14 h-14 rounded-xl bg-yellow-500/20 
                  flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-7 h-7 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
              </div>
            </motion.div>

            {/* Approved Card */}
            <motion.div
              whileHover={{ y: -5, transition: { duration: 0.3 } }}
              className="group bg-white dark:bg-slate-900 
                rounded-2xl p-6 shadow-md border border-slate-200 dark:border-slate-800
                hover:shadow-2xl hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Approved Leaves</p>
                  <h3 className="text-4xl font-bold mt-2 text-green-400">
                    {approved}
                  </h3>
                </div>
                <div className="w-14 h-14 rounded-xl bg-green-500/20 
                  flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-7 h-7 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
              </div>
            </motion.div>

            {/* Rejected Card */}
            <motion.div
              whileHover={{ y: -5, transition: { duration: 0.3 } }}
              className="group bg-white dark:bg-slate-900 
                rounded-2xl p-6 shadow-md border border-slate-200 dark:border-slate-800
                hover:shadow-2xl hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Rejected Requests</p>
                  <h3 className="text-4xl font-bold mt-2 text-red-400">
                    {rejected}
                  </h3>
                </div>
                <div className="w-14 h-14 rounded-xl bg-red-500/20 
                  flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-7 h-7 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Leave History */}
          <motion.div 
            variants={itemVariants}
            className="bg-white dark:bg-slate-900 
              p-6 lg:p-8 rounded-2xl shadow-md border border-slate-200 dark:border-slate-800"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-800 dark:text-white">
                Recent Leave History
              </h2>
              <Link
                to="/employee/leaves"
                className="text-sm font-medium text-blue-400 hover:underline"
              >
                View All →
              </Link>
            </div>

            {loading ? (
              <div className="text-center py-12 text-slate-400">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-2"
                />
                Loading...
              </div>
            ) : leaves.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <svg className="w-16 h-16 mx-auto mb-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                <p className="text-slate-400">
                  No leaves applied yet.
                </p>
                <button
                  onClick={() => setIsLeaveModalOpen(true)}
                  className="mt-4 text-blue-400 font-semibold hover:underline"
                >
                  Apply for your first leave →
                </button>
              </motion.div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-left">
                  <thead>
                    <tr className="border-b-2 border-slate-300 dark:border-slate-700 
                      text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      <th className="py-3 px-4">Type</th>
                      <th className="py-3 px-4">From</th>
                      <th className="py-3 px-4">To</th>
                      <th className="py-3 px-4">Duration</th>
                      <th className="py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaves.slice(0, 5).map((leave, index) => {
                      const duration = Math.ceil(
                        (new Date(leave.toDate) - new Date(leave.fromDate)) / (1000 * 60 * 60 * 24)
                      ) + 1;
                      return (
                        <motion.tr
                          key={leave._id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="border-b border-slate-200 dark:border-slate-800 
                            hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                          <td className="py-4 px-4 font-medium text-slate-700 dark:text-slate-200">
                            {leave.leaveType}
                          </td>
                          <td className="py-4 px-4 text-slate-600 dark:text-slate-300">
                            {formatDate(leave.fromDate)}
                          </td>
                          <td className="py-4 px-4 text-slate-600 dark:text-slate-300">
                            {formatDate(leave.toDate)}
                          </td>
                          <td className="py-4 px-4 text-slate-600 dark:text-slate-300">
                            {duration} {duration === 1 ? "day" : "days"}
                          </td>
                          <td className="py-4 px-4">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                leave.status === "approved"
                                  ? "bg-green-500/20 text-green-400"
                                  : leave.status === "rejected"
                                  ? "bg-red-500/20 text-red-400"
                                  : "bg-yellow-500/20 text-yellow-400"
                              }`}
                            >
                              {leave.status}
                            </span>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>

      {/* MODAL */}
      {isLeaveModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <div
            className="absolute inset-0 bg-black/70"
            onClick={() => setIsLeaveModalOpen(false)}
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative bg-slate-900 w-full max-w-lg p-8 rounded-2xl shadow-2xl border border-slate-800"
          >
            <button
              onClick={() => setIsLeaveModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white text-xl"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>

            <h2 className="text-2xl font-bold mb-6 text-white">
              Apply for Leave
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Leave Type
                </label>
                <select
                  className="w-full px-4 py-3 border-2 border-slate-700 
                    bg-slate-800 text-white rounded-xl 
                    focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition"
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value)}
                  required
                >
                  <option value="">Select leave type</option>
                  <option value="Sick Leave">Sick Leave</option>
                  <option value="Casual Leave">Casual Leave</option>
                  <option value="Annual Leave">Annual Leave</option>
                  <option value="Personal Leave">Personal Leave</option>
                  <option value="Emergency Leave">Emergency Leave</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    From Date
                  </label>
                  <input
                    type="date"
                    className="w-full px-4 py-3 border-2 border-slate-700 
                      bg-slate-800 text-white rounded-xl 
                      focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    To Date
                  </label>
                  <input
                    type="date"
                    className="w-full px-4 py-3 border-2 border-slate-700 
                      bg-slate-800 text-white rounded-xl 
                      focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Reason
                </label>
                <textarea
                  placeholder="Enter reason for leave..."
                  className="w-full px-4 py-3 border-2 border-slate-700 
                    bg-slate-800 text-white rounded-xl 
                    focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition resize-none"
                  rows="3"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  required
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700
                  text-white rounded-xl font-semibold shadow-lg hover:shadow-xl 
                  transition-all"
              >
                Submit Leave Request
              </motion.button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </Layout>
  );
}

export default EmployeeDashboard;
